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

// Routes: Chat AI with OpenRouter SDK
const { OpenRouter } = require('@openrouter/sdk');

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  // defaultHeaders: {
  //   'HTTP-Referer': 'http://localhost:3000',
  //   'X-OpenRouter-Title': 'Pharmacy_AI',
  // },
});

const keys = [
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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"
];

const MODEL = "google/gemma-3n-e4b-it:free";

async function CallToAIModel(message) {
  const prompt = `Bạn là dược sĩ chuyên nghiệp. Trả lời ngắn gọn, lịch sự, an toàn, khuyến nghị khám chuyên gia nếu cần. Người dùng hỏi: "${message}"`;

  let fullContent = '';

  for (const key of keys) {
    try {
      console.log('Đang thử với key:', key.slice(0, 15) + '...');
      const stream = await openRouter.chat.send({
        chatGenerationParams: {
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        },
        apiKey: key, // truyền key hiện tại
      });

      for await (const chunk of stream) {
        if ('error' in chunk) {
          console.error(`Stream error: ${chunk.error.message}`);
          throw new Error(chunk.error.message);
        }
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) {
          fullContent += content;
        }
      }

      if (fullContent) return fullContent;
    } catch (err) {
      console.error('Key lỗi, thử key tiếp theo...', err.message);
      fullContent = ''; // reset để thử lại với key khác
      continue;
    }
  }

  return 'Xin lỗi, hiện tại tôi không trả lời được.';
}

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
