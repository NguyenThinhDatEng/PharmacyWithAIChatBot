const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), override: true });
const { Client } = require('@notionhq/client');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const ordersFile = path.join(__dirname, '..', 'orders.json');
function loadOrderDatabase() {
  if (!fs.existsSync(ordersFile)) return {};
  try {
    return JSON.parse(fs.readFileSync(ordersFile, 'utf8')) || {};
  } catch (err) {
    console.error('Không thể đọc orders.json:', err.message);
    return {};
  }
}

function saveOrderDatabase(data) {
  try {
    fs.writeFileSync(ordersFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Không thể ghi orders.json:', err.message);
  }
}

const blogs = [];
const productsFile = path.join(__dirname, '../../src/data/products.json');
const rawProducts = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
const products = rawProducts.map(p => ({
  id: p.productId,
  name: p.name,
  price: p.price,
  stock: 9999,
  soldCount: p.soldCount || 0,
}));

function persistSoldCount() {
  try {
    const raw = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    products.forEach(p => {
      const item = raw.find(r => r.productId === p.id);
      if (item) item.soldCount = p.soldCount;
    });
    fs.writeFileSync(productsFile, JSON.stringify(raw, null, 2), 'utf-8');
  } catch (err) {
    console.error('Không thể cập nhật soldCount:', err.message);
  }
}

const orders = [];
const prescriptions = [];
const chatHistory = [];

const notion = process.env.NOTION_TOKEN
  ? new Client({ auth: process.env.NOTION_TOKEN })
  : null;

async function pushOrderToNotion(order) {
  if (!notion || !process.env.NOTION_DATABASE_ID) return;

  const itemsText = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
  const paymentLabel = order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'COD';
  const deliveryLabel = order.deliveryMethod === 'pickup' ? 'Nhận tại quầy' : 'Giao tận nhà';

  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        'Tên đơn hàng': { title: [{ text: { content: `ĐH#${order.id} - ${order.buyer.name}` } }] },
        'Trạng thái TT': { select: { name: 'Chưa thanh toán' } },
        'Phương thức TT': { select: { name: paymentLabel } },
        'Trạng thái đơn': { select: { name: 'Chờ xử lý' } },
        'Hình thức nhận': { select: { name: deliveryLabel } },
        'Khách hàng': { rich_text: [{ text: { content: order.buyer.name } }] },
        'Số điện thoại': { phone_number: order.buyer.phone },
        'Địa chỉ': { rich_text: [{ text: { content: order.buyer.address } }] },
        'Sản phẩm': { rich_text: [{ text: { content: itemsText } }] },
        'Tổng tiền (VNĐ)': { number: order.total },
        'Ghi chú': { rich_text: [{ text: { content: order.buyer.note || '' } }] },
        'Thời gian đặt': { date: { start: new Date(order.createdAt).toISOString() } },
      },
    });
    console.log(`Notion: đã lưu ĐH#${order.id}`);
  } catch (err) {
    console.error('Notion push lỗi:', err.message);
  }
}

app.get('/api/blogs', (req, res) => res.json(blogs));
app.post('/api/blogs', (req, res) => {
  const { title, content, author = 'Admin' } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content are required' });

  const post = { id: blogs.length + 1, title, content, author, createdAt: new Date() };
  blogs.push(post);
  res.status(201).json(post);
});

app.get('/api/products', (req, res) => res.json(products));

app.post('/api/orders', (req, res) => {
  const { userId, items, buyer, paymentMethod, deliveryMethod, total } = req.body;

  if (!buyer || !buyer.phone || !buyer.name || !buyer.address) {
    return res.status(400).json({ error: 'buyer.name, buyer.phone và buyer.address là bắt buộc' });
  }
  if (!paymentMethod) {
    return res.status(400).json({ error: 'paymentMethod is required' });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items is required and cannot be empty' });
  }

  let computedTotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Product ${product.name} không đủ số lượng` });
    }

    product.stock -= item.quantity;
    product.soldCount = (product.soldCount || 0) + item.quantity;
    computedTotal += product.price * item.quantity;
    orderItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const orderId = orders.length + 1;
  const order = {
    id: orderId,
    userId: userId || 'anonymous',
    buyer: {
      name: buyer.name,
      phone: buyer.phone,
      email: buyer.email || '',
      address: buyer.address,
      note: buyer.note || '',
    },
    paymentMethod,
    deliveryMethod: deliveryMethod || 'delivery',
    items: orderItems,
    total: total || computedTotal,
    status: 'pending',
    createdAt: new Date(),
  };

  orders.push(order);
  persistSoldCount();

  const orderData = loadOrderDatabase();
  const phoneKey = buyer.phone.trim();

  if (!orderData[phoneKey]) {
    orderData[phoneKey] = {
      buyer: {
        name: buyer.name,
        phone: buyer.phone,
        email: buyer.email || '',
        address: buyer.address,
        note: buyer.note || '',
      },
      orders: [],
    };
  } else {
    orderData[phoneKey].buyer = {
      ...orderData[phoneKey].buyer,
      name: buyer.name,
      email: buyer.email || orderData[phoneKey].buyer.email,
      address: buyer.address,
      note: buyer.note || orderData[phoneKey].buyer.note,
    };
  }

  orderData[phoneKey].orders.push(order);
  saveOrderDatabase(orderData);
  pushOrderToNotion(order);

  res.status(201).json(order);
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });

app.post('/api/prescriptions', upload.single('prescription'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File is required' });

  const { userId, note } = req.body;
  const item = {
    id: prescriptions.length + 1,
    userId: userId || 'anonymous',
    note: note || '',
    filePath: req.file.path,
    status: 'pending',
    createdAt: new Date(),
  };
  prescriptions.push(item);
  res.status(201).json(item);
});

app.get('/api/prescriptions', (req, res) => res.json(prescriptions));
app.get('/api/prescriptions/:id', (req, res) => {
  const prescription = prescriptions.find(x => x.id === Number(req.params.id));
  if (!prescription) return res.status(404).json({ error: 'Not found' });
  res.json(prescription);
});

app.use('/uploads', express.static(uploadDir));

const { OpenRouter } = require('@openrouter/sdk');
const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');

function validateEnvKeys() {
  const openRouterKeys = (process.env.KEYS || '').split(',').map(k => k.trim()).filter(Boolean);
  if (openRouterKeys.length === 0) {
    console.warn('[CONFIG] KEYS is empty - OpenRouter will fail');
  } else {
    openRouterKeys.forEach(key => {
      if (!key.startsWith('sk-or-v1-')) {
        console.warn(`[CONFIG] OpenRouter key may be invalid (expected sk-or-v1-...): ${key.slice(0, 12)}...`);
      }
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.warn('[CONFIG] GEMINI_API_KEY is empty - Gemini fallback will fail');
  } else if (!hasConfiguredValue(process.env.GEMINI_API_KEY)) {
    console.warn('[CONFIG] GEMINI_API_KEY is a placeholder - Gemini fallback will be skipped');
  }

  const groq = process.env.GROQ_API_KEY || '';
  if (groq && !groq.startsWith('gsk_')) {
    console.warn(`[CONFIG] GROQ_API_KEY may be invalid (expected gsk_...): ${groq.slice(0, 12)}...`);
  } else if (!hasConfiguredValue(groq)) {
    console.warn('[CONFIG] GROQ_API_KEY is empty or placeholder - Groq fallback will be skipped');
  }

  if (!process.env.XAI_API_KEY) {
    console.warn('[CONFIG] XAI_API_KEY is empty - xAI fallback will fail');
  } else if (!hasConfiguredValue(process.env.XAI_API_KEY)) {
    console.warn('[CONFIG] XAI_API_KEY is a placeholder - xAI fallback will be skipped');
  }
}
validateEnvKeys();

const keys = (process.env.KEYS || '').split(',').map(k => k.trim()).filter(Boolean);
const MODEL = process.env.MODEL;
const XAI_MODEL = process.env.XAI_MODEL || 'grok-4.3';
const SYSTEM_PROMPT = 'Bạn là dược sĩ chuyên nghiệp. Trả lời ngắn gọn, lịch sự, an toàn, khuyến nghị khám chuyên gia nếu cần.';

async function callOpenRouter(message) {
  const prompt = `${SYSTEM_PROMPT} Người dùng hỏi: "${message}"`;

  for (const key of keys.filter(hasConfiguredValue)) {
    const openRouter = new OpenRouter({ apiKey: key });
    try {
      console.log('OpenRouter: thử key', key.slice(0, 15) + '...');
      const result = await openRouter.chat.send({
        chatGenerationParams: {
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
        },
      });
      if (result.error) throw new Error(result.error.message);

      const content = result.choices?.[0]?.message?.content;
      if (content) {
        console.log('[AI provider] OpenRouter response received');
        return content;
      }
    } catch (err) {
      console.error('OpenRouter key lỗi, thử tiếp...', err.message);
    }
  }

  throw new Error('Tất cả OpenRouter keys đều thất bại');
}

async function callGemini(message) {
  console.log('[AI provider] Gemini request model gemini-2.5-flash-lite');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `${SYSTEM_PROMPT} Người dùng hỏi: "${message}"`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
  });
  console.log('[AI provider] Gemini response received');
  return response.text;
}

async function callGroq(message) {
  console.log('[AI provider] Groq request model llama-3.3-70b-versatile');
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
  });
  console.log('[AI provider] Groq response received');
  return completion.choices[0].message.content;
}

async function callXAI(message) {
  console.log(`[AI provider] xAI request model ${XAI_MODEL}`);
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: XAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`xAI HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('[AI provider] xAI response received');
  return data.choices?.[0]?.message?.content;
}

async function CallToAIModel(message) {
  try {
    const content = await callOpenRouter(message);
    if (content) return content;
  } catch (err) {
    console.error('OpenRouter thất bại, chuyển sang Gemini...', err.message);
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      console.log('Fallback: thử Google Gemini...');
      const content = await callGemini(message);
      if (content) return content;
    } catch (err) {
      console.error('Gemini lỗi, chuyển sang Groq...', err.message);
    }
  }

  if (process.env.GROQ_API_KEY) {
    try {
      console.log('Fallback: thử Groq...');
      const content = await callGroq(message);
      if (content) return content;
    } catch (err) {
      console.error('Groq lỗi, chuyển sang xAI...', err.message);
    }
  }

  if (process.env.XAI_API_KEY) {
    try {
      console.log('Fallback: thử xAI...');
      const content = await callXAI(message);
      if (content) return content;
    } catch (err) {
      console.error('xAI lỗi:', err.message);
    }
  }

  return 'Xin lỗi, hiện tại tôi không trả lời được.';
}

async function* parseSseTextStream(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') return;

      try {
        const content = JSON.parse(payload).choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch (_) { }
    }
  }
}

async function* streamOpenRouter(message) {
  const prompt = `${SYSTEM_PROMPT} Người dùng hỏi: "${message}"`;

  for (const key of keys.filter(hasConfiguredValue)) {
    try {
      console.log('OpenRouter stream: thử key', key.slice(0, 15) + '...');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        }),
      });
      if (!response.ok) {
        console.error('OpenRouter stream HTTP', response.status);
        continue;
      }

      yield* parseSseTextStream(response);
      return;
    } catch (err) {
      console.error('OpenRouter stream key lỗi:', err.message);
    }
  }

  throw new Error('OpenRouter stream thất bại');
}

async function* streamGemini(message) {
  console.log('[AI provider] Gemini stream request model gemini-2.5-flash');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `${SYSTEM_PROMPT} Người dùng hỏi: "${message}"`;
  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  console.log('[AI provider] Gemini stream opened');

  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text;
  }
}

async function* streamGroq(message) {
  console.log('[AI provider] Groq stream request model llama-3.3-70b-versatile');
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
    stream: true,
  });
  console.log('[AI provider] Groq stream opened');

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) yield content;
  }
}

async function* streamXAI(message) {
  console.log(`[AI provider] xAI stream request model ${XAI_MODEL}`);
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: XAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`xAI stream HTTP ${response.status}: ${errorText}`);
  }

  console.log('[AI provider] xAI stream opened');
  yield* parseSseTextStream(response);
}

const DEFAULT_CHAT_PROVIDER = 'gemini';
const CHAT_PROVIDER_ORDER = ['gemini', 'xai', 'groq', 'openrouter'];

function hasConfiguredValue(value) {
  return Boolean(value && value.trim() && !value.toLowerCase().includes('placeholder'));
}

function hasOpenRouterConfig() {
  return keys.some(hasConfiguredValue) && hasConfiguredValue(MODEL);
}

const CHAT_PROVIDERS = [
  {
    id: 'gemini',
    label: 'Gemini',
    isAvailable: () => hasConfiguredValue(process.env.GEMINI_API_KEY),
    call: callGemini,
    stream: streamGemini,
  },
  {
    id: 'xai',
    label: 'xAI',
    isAvailable: () => hasConfiguredValue(process.env.XAI_API_KEY),
    call: callXAI,
    stream: streamXAI,
  },
  {
    id: 'groq',
    label: 'Groq',
    isAvailable: () => hasConfiguredValue(process.env.GROQ_API_KEY),
    call: callGroq,
    stream: streamGroq,
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    isAvailable: hasOpenRouterConfig,
    call: callOpenRouter,
    stream: streamOpenRouter,
  },
];

function getProviderById(providerId) {
  return CHAT_PROVIDERS.find(provider => provider.id === providerId);
}

function normalizeProviderId(providerId) {
  return getProviderById(providerId) ? providerId : DEFAULT_CHAT_PROVIDER;
}

function getProviderSequence(providerId) {
  const requestedProvider = normalizeProviderId(providerId);
  const orderedIds = [requestedProvider, ...CHAT_PROVIDER_ORDER]
    .filter((id, index, arr) => arr.indexOf(id) === index);

  return orderedIds
    .map(getProviderById)
    .filter(provider => {
      if (!provider) return false;
      const available = provider.isAvailable();
      if (!available) {
        console.warn(`[AI] skipping provider without valid config: ${provider.id}`);
      }
      return available;
    });
}

function getProviderPayload() {
  return {
    providers: CHAT_PROVIDER_ORDER.map(id => {
      const provider = getProviderById(id);
      return {
        id: provider.id,
        label: provider.label,
        available: provider.isAvailable(),
        isDefault: provider.id === DEFAULT_CHAT_PROVIDER,
      };
    }),
    defaultProvider: DEFAULT_CHAT_PROVIDER,
    fallbackOrder: CHAT_PROVIDER_ORDER,
  };
}

async function callChatProvider(message, providerId) {
  const requestedProvider = normalizeProviderId(providerId);
  const sequence = getProviderSequence(requestedProvider);

  console.log('[AI] requested provider:', requestedProvider);

  for (const provider of sequence) {
    try {
      console.log('[AI] trying provider:', provider.id);
      const content = await provider.call(message);
      if (content) {
        console.log('[AI] provider success:', provider.id, 'fallback:', provider.id !== requestedProvider);
        return {
          content,
          requestedProvider,
          providerUsed: provider.id,
          fallbackUsed: provider.id !== requestedProvider,
        };
      }
    } catch (err) {
      console.error(`[AI] provider failed: ${provider.id}`, err.message);
    }
  }

  return {
    content: 'Xin lá»—i, hiá»‡n táº¡i tÃ´i khÃ´ng tráº£ lá»i Ä‘Æ°á»£c.',
    requestedProvider,
    providerUsed: null,
    fallbackUsed: false,
  };
}

app.get('/api/chat/providers', (req, res) => {
  res.json(getProviderPayload());
});

app.post('/api/chat/stream', async (req, res) => {
  const { message, provider } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);
  const send = (text) => sendEvent({ chunk: text });
  const done = () => {
    res.write('data: [DONE]\n\n');
    res.end();
  };

  async function tryStream(streamFn) {
    for await (const chunk of streamFn(message)) send(chunk);
  }

  try {
    const requestedProvider = normalizeProviderId(provider);
    const sequence = getProviderSequence(requestedProvider);

    console.log('[AI stream] requested provider:', requestedProvider);

    for (const chatProvider of sequence) {
      try {
        console.log('[AI stream] trying provider:', chatProvider.id);
        const iterator = chatProvider.stream(message)[Symbol.asyncIterator]();
        const first = await iterator.next();
        const providerUsed = chatProvider.id;

        console.log('[AI stream] provider success:', providerUsed, 'fallback:', providerUsed !== requestedProvider);
        sendEvent({
          type: 'meta',
          requestedProvider,
          providerUsed,
          fallbackUsed: providerUsed !== requestedProvider,
        });

        if (!first.done && first.value) send(first.value);

        while (true) {
          const next = await iterator.next();
          if (next.done) break;
          if (next.value) send(next.value);
        }

        return done();
      } catch (err) {
        console.error(`[AI stream] provider failed: ${chatProvider.id}`, err.message);
      }
    }

    send('Xin lá»—i, hiá»‡n táº¡i tÃ´i khÃ´ng tráº£ lá»i Ä‘Æ°á»£c.');
    return done();

    try {
      await tryStream(streamOpenRouter);
      return done();
    } catch (err) {
      console.error('OpenRouter stream lỗi, sang Gemini:', err.message);
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        await tryStream(streamGemini);
        return done();
      } catch (err) {
        console.error('Gemini stream lỗi, sang Groq:', err.message);
      }
    }

    if (process.env.GROQ_API_KEY) {
      try {
        await tryStream(streamGroq);
        return done();
      } catch (err) {
        console.error('Groq stream lỗi, sang xAI:', err.message);
      }
    }

    if (process.env.XAI_API_KEY) {
      try {
        await tryStream(streamXAI);
        return done();
      } catch (err) {
        console.error('xAI stream lỗi:', err.message);
      }
    }

    send('Xin lỗi, hiện tại tôi không trả lời được.');
    done();
  } catch (err) {
    if (!res.writableEnded) {
      send('Xin lỗi, có lỗi xảy ra.');
      done();
    }
  }
});

app.post('/api/chat/pharmacist', async (req, res) => {
  const { userId, message, provider } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const result = await callChatProvider(message, provider);
    const entry = {
      id: chatHistory.length + 1,
      userId: userId || 'anonymous',
      message,
      answer: result.content,
      requestedProvider: result.requestedProvider,
      providerUsed: result.providerUsed,
      fallbackUsed: result.fallbackUsed,
      createdAt: new Date(),
    };
    chatHistory.push(entry);
    res.json(entry);
  } catch (err) {
    console.error('chat/pharmacist error', {
      message: err.message,
      stack: err.stack,
      status: err.response?.status,
      responseData: err.response?.data,
    });
    res.status(500).json({
      error: err.message || 'Failed to call OpenRouter',
      openRouterStatus: err.response?.status,
      openRouterData: err.response?.data,
    });
  }
});

app.get('/api/chat/history', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    return res.json(chatHistory.filter(c => c.userId === userId));
  }
  res.json(chatHistory);
});

app.get('/', (req, res) => {
  res.send('Pharmacy AI Backend running');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend server running on http://localhost:${port}`));
