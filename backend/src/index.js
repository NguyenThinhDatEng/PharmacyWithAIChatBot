require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
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

// In-memory prototype data
const blogs = [];
const products = [
  { id: 1, name: 'Viên uống bổ sung vitamin C', price: 120000, stock: 50 },
  { id: 2, name: 'Thuốc cảm cúm ABC', price: 85000, stock: 80 },
  { id: 3, name: 'Kem bôi chống viêm', price: 95000, stock: 40 },
];
const orders = [];
const prescriptions = [];
const chatHistory = [];

// Routes: Blog
app.get('/api/blogs', (req, res) => res.json(blogs));
app.post('/api/blogs', (req, res) => {
  const { title, content, author = 'Admin' } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content are required' });
  const post = { id: blogs.length + 1, title, content, author, createdAt: new Date() };
  blogs.push(post);
  res.status(201).json(post);
});

// Routes: Products
app.get('/api/products', (req, res) => res.json(products));

// Routes: Orders
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
    if (product.stock < item.quantity) return res.status(400).json({ error: `Product ${product.name} không đủ số lượng` });
    product.stock -= item.quantity;
    computedTotal += product.price * item.quantity;
    orderItems.push({ id: product.id, name: product.name, price: product.price, quantity: item.quantity });
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
      note: buyer.note || ''
    },
    paymentMethod,
    deliveryMethod: deliveryMethod || 'delivery',
    items: orderItems,
    total: total || computedTotal,
    status: 'pending',
    createdAt: new Date()
  };

  orders.push(order);

  const orderData = loadOrderDatabase();
  const phoneKey = buyer.phone.trim();
  if (!orderData[phoneKey]) {
    orderData[phoneKey] = {
      buyer: {
        name: buyer.name,
        phone: buyer.phone,
        email: buyer.email || '',
        address: buyer.address,
        note: buyer.note || ''
      },
      orders: []
    };
  } else {
    orderData[phoneKey].buyer = {
      ...orderData[phoneKey].buyer,
      name: buyer.name,
      email: buyer.email || orderData[phoneKey].buyer.email,
      address: buyer.address,
      note: buyer.note || orderData[phoneKey].buyer.note
    };
  }

  orderData[phoneKey].orders.push(order);
  saveOrderDatabase(orderData);

  res.status(201).json(order);
});

// Routes: Prescription upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/api/prescriptions', upload.single('prescription'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File is required' });
  const { userId, note } = req.body;
  const item = { id: prescriptions.length + 1, userId: userId || 'anonymous', note: note || '', filePath: req.file.path, status: 'pending', createdAt: new Date() };
  prescriptions.push(item);
  res.status(201).json(item);
});
app.get('/api/prescriptions', (req, res) => res.json(prescriptions));
app.get('/api/prescriptions/:id', (req, res) => {
  const p = prescriptions.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

app.use('/uploads', express.static(uploadDir));

// Routes: Chat AI with fallback chain: OpenRouter → Gemini → Groq
const { OpenRouter } = require('@openrouter/sdk');
const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');

const keys = process.env.KEYS.split(",");
const MODEL = process.env.MODEL;

const SYSTEM_PROMPT = 'Bạn là dược sĩ chuyên nghiệp. Trả lời ngắn gọn, lịch sự, an toàn, khuyến nghị khám chuyên gia nếu cần.';

async function callOpenRouter(message) {
  const prompt = `${SYSTEM_PROMPT} Người dùng hỏi: "${message}"`;
  for (const key of keys) {
    const openRouter = new OpenRouter({ apiKey: key });
    try {
      console.log('OpenRouter: thử key', key.slice(0, 15) + '...');
      const result = await openRouter.chat.send({
        chatGenerationParams: {
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
        }
      });
      if (result.error) throw new Error(result.error.message);
      const content = result.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (err) {
      console.error('OpenRouter key lỗi, thử tiếp...', err.message);
    }
  }
  throw new Error('Tất cả OpenRouter keys đều thất bại');
}

async function callGemini(message) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `${SYSTEM_PROMPT} Người dùng hỏi: "${message}"`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text;
}

async function callGroq(message) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
  });
  return completion.choices[0].message.content;
}

async function CallToAIModel(message) {
  // 1. OpenRouter
  try {
    const content = await callOpenRouter(message);
    if (content) return content;
  } catch (err) {
    console.error('OpenRouter thất bại, chuyển sang Gemini...', err.message);
  }

  // 2. Fallback: Google Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log('Fallback: thử Google Gemini...');
      const content = await callGemini(message);
      if (content) return content;
    } catch (err) {
      console.error('Gemini lỗi, chuyển sang Groq...', err.message);
    }
  }

  // 3. Fallback: Groq
  if (process.env.GROQ_API_KEY) {
    try {
      console.log('Fallback: thử Groq...');
      const content = await callGroq(message);
      if (content) return content;
    } catch (err) {
      console.error('Groq lỗi:', err.message);
    }
  }

  return 'Xin lỗi, hiện tại tôi không trả lời được.';
}

// Streaming generator functions for SSE
async function* streamOpenRouter(message) {
  const prompt = `${SYSTEM_PROMPT} Người dùng hỏi: "${message}"`;
  for (const key of keys) {
    try {
      console.log('OpenRouter stream: thử key', key.slice(0, 15) + '...');
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: prompt }], stream: true }),
      });
      if (!res.ok) { console.error('OR stream key HTTP', res.status); continue; }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') return;
          try { const c = JSON.parse(payload).choices?.[0]?.delta?.content; if (c) yield c; } catch (_) {}
        }
      }
      return;
    } catch (err) { console.error('OR stream key lỗi:', err.message); }
  }
  throw new Error('OpenRouter stream thất bại');
}

async function* streamGemini(message) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `${SYSTEM_PROMPT} Người dùng hỏi: "${message}"`;
  const stream = await ai.models.generateContentStream({ model: 'gemini-2.5-flash', contents: prompt });
  for await (const chunk of stream) { if (chunk.text) yield chunk.text; }
}

async function* streamGroq(message) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: message }],
    stream: true,
  });
  for await (const chunk of stream) {
    const c = chunk.choices[0]?.delta?.content; if (c) yield c;
  }
}

app.post('/api/chat/stream', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (text) => res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
  const done = () => { res.write('data: [DONE]\n\n'); res.end(); };

  async function tryStream(genFn) {
    for await (const chunk of genFn(message)) send(chunk);
  }

  try {
    try { await tryStream(streamOpenRouter); return done(); }
    catch (err) { console.error('OR stream lỗi, sang Gemini:', err.message); }

    if (process.env.GEMINI_API_KEY) {
      try { await tryStream(streamGemini); return done(); }
      catch (err) { console.error('Gemini stream lỗi, sang Groq:', err.message); }
    }

    if (process.env.GROQ_API_KEY) {
      try { await tryStream(streamGroq); return done(); }
      catch (err) { console.error('Groq stream lỗi:', err.message); }
    }

    send('Xin lỗi, hiện tại tôi không trả lời được.'); done();
  } catch (err) {
    if (!res.writableEnded) { send('Xin lỗi, có lỗi xảy ra.'); done(); }
  }
});

app.post('/api/chat/pharmacist', async (req, res) => {
  const { userId, message } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const answer = await CallToAIModel(message);
    const entry = { id: chatHistory.length + 1, userId: userId || 'anonymous', message, answer, createdAt: new Date() };
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
      openRouterData: err.response?.data
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
