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

async function CallToAIModel(message) {
  if (!process.env.OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY not set in .env');

  const prompt = `Bạn là dược sĩ chuyên nghiệp. Trả lời ngắn gọn, lịch sự, an toàn, khuyến nghị khám chuyên gia nếu cần. Người dùng hỏi: "${message}"`;

  console.log('CallToAIModel: model ' + process.env.MODEL);
  console.log('CallToAIModel: message', message);

  try {
    const stream = await openRouter.chat.send({
      chatGenerationParams: {
        model: process.env.MODEL,
        messages: [
          { role: 'user', content: prompt }
        ],
        stream: true,
      }

    });

    console.log('CallToAIModel: response', stream);

    let fullContent = '';

    // Đọc stream
    for await (const chunk of stream) {
      // Check for errors in chunk
      if ('error' in chunk) {
        console.error(`Stream error: ${chunk.error.message}`);
        if (chunk.choices?.[0]?.finish_reason === 'error') {
          console.log('Stream terminated due to error');
        }
        return 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu.';
      }
      // Process normal content
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        console.log(content);
        fullContent += content;
      }
    }

    return fullContent || 'Xin lỗi, hiện tại tôi không trả lời được.';
  } catch (err) {
    console.error('CallToAIModel err', {
      message: err.message,
      status: err.response?.status,
      responseData: err.response?.data,
      errDetails: err,
    });
    throw err;
  }
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
