<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const activeTab = ref('blog');
const base = 'http://localhost:3000/api';

// blog
const blogs = ref([]);
const blogTitle = ref('');
const blogContent = ref('');

// products
const products = ref([]);
const cart = ref([]);
const qty = ref(1);

// prescription
const prescriptionFile = ref(null);
const prescriptionNote = ref('');
const prescriptionStatus = ref('');

// chat
const userMessage = ref('');
const chatLog = ref([]);
const chatStatus = ref('');

async function loadBlogs() {
  try {
    const res = await axios.get(`${base}/blogs`);
    blogs.value = res.data;
  } catch (error) {
    console.error('Load blogs', error);
  }
}

async function createBlog() {
  if (!blogTitle.value || !blogContent.value) return;
  await axios.post(`${base}/blogs`, { title: blogTitle.value, content: blogContent.value });
  blogTitle.value=''; blogContent.value='';
  await loadBlogs();
}

async function loadProducts() {
  const res = await axios.get(`${base}/products`);
  products.value = res.data;
}

function addToCart(item) {
  const exists = cart.value.find(p => p.id === item.id);
  if (exists) { exists.quantity += Number(qty.value); } else { cart.value.push({ ...item, quantity: Number(qty.value) }); }
}

async function checkout() {
  if (cart.value.length === 0) return;
  const order = {
    userId: 'user1',
    items: cart.value.map(i => ({ productId: i.id, quantity: i.quantity }))
  };
  await axios.post(`${base}/orders`, order);
  cart.value=[];
  alert('Order placed');
  loadProducts();
}

async function uploadPrescription() {
  if (!prescriptionFile.value) return;
  const form = new FormData();
  form.append('prescription', prescriptionFile.value);
  form.append('userId', 'user1');
  form.append('note', prescriptionNote.value);
  try {
    const res = await axios.post(`${base}/prescriptions`, form, { headers: {'Content-Type':'multipart/form-data'} });
    prescriptionStatus.value = 'Uploaded: ' + res.data.id;
    prescriptionNote.value=''; prescriptionFile.value = null;
    document.getElementById('prescription-file').value = '';
  } catch (error) {
    prescriptionStatus.value = 'Upload failed';
    console.error(error);
  }
}

async function sendChat() {
  if (!userMessage.value) return;
  chatStatus.value = 'Sending...';
  try {
    const res = await axios.post(`${base}/chat/pharmacist`, { userId: 'user1', message: userMessage.value });
    chatLog.value.push({ role: 'user', text: userMessage.value });
    chatLog.value.push({ role: 'assistant', text: res.data.answer });
    userMessage.value='';
    chatStatus.value='';
  } catch (error) {
    chatStatus.value='Chat failed';
    console.error(error);
  }
}

onMounted(async () => {
  await loadBlogs();
  await loadProducts();
});
</script>

<template>
  <div class="container">
    <h1>Pharmacy AI Prototype</h1>
    <div class="tabs">
      <button :class="{active: activeTab==='blog'}" @click="activeTab='blog'">Blog</button>
      <button :class="{active: activeTab==='shop'}" @click="activeTab='shop'">Shop</button>
      <button :class="{active: activeTab==='prescription'}" @click="activeTab='prescription'">Upload Prescription</button>
      <button :class="{active: activeTab==='chat'}" @click="activeTab='chat'">AI Pharmacist Chat</button>
    </div>

    <section v-if="activeTab==='blog'" class="panel">
      <h2>Blog chăm sóc sức khỏe</h2>
      <div class="form"><input v-model="blogTitle" placeholder="Tiêu đề" /><textarea v-model="blogContent" placeholder="Nội dung" rows="4"></textarea><button @click="createBlog">Đăng bài</button></div>
      <div class="list"><div v-for="post in blogs" :key="post.id" class="card"><h3>{{ post.title }}</h3><p>{{ post.content }}</p><small>{{ post.createdAt && new Date(post.createdAt).toLocaleString() }}</small></div></div>
    </section>

    <section v-if="activeTab==='shop'" class="panel">
      <h2>Kênh bán sản phẩm</h2>
      <div class="product" v-for="p in products" :key="p.id"><strong>{{ p.name }}</strong> - {{ p.price }}đ - Còn {{ p.stock }}
        <div><input type="number" v-model.number="qty" min="1" style="width:80px" /> <button :disabled="p.stock===0" @click="addToCart(p)">Thêm giỏ hàng</button></div>
      </div>
      <h3>Giỏ hàng</h3>
      <div v-if="cart.length===0">Chưa có sản phẩm</div>
      <div v-else><div v-for="item in cart" :key="item.id" class="card">{{ item.name }} x {{ item.quantity }}</div><button @click="checkout">Mua ngay</button></div>
    </section>

    <section v-if="activeTab==='prescription'" class="panel">
      <h2>Mua thuốc theo đơn</h2>
      <input id="prescription-file" type="file" @change="e => prescriptionFile = e.target.files[0]" accept="image/*" />
      <textarea v-model="prescriptionNote" placeholder="Ghi chú" rows="3"></textarea>
      <button @click="uploadPrescription">Gửi đơn</button>
      <p>{{ prescriptionStatus }}</p>
    </section>

    <section v-if="activeTab==='chat'" class="panel">
      <h2>Tư vấn bởi dược sĩ</h2>
      <div class="chat-box">
        <div v-for="(msg, idx) in chatLog" :key="idx" :class="['chat-line', msg.role]">
          <strong>{{ msg.role === 'user' ? 'Bạn' : 'Dược sĩ AI' }}:</strong> {{ msg.text }}
        </div>
      </div>
      <textarea v-model="userMessage" rows="3" placeholder="Nhập câu hỏi"></textarea>
      <button @click="sendChat">Gửi</button>
      <p>{{ chatStatus }}</p>
    </section>
  </div>
</template>

<style>
body { font-family: Arial, sans-serif; }
.container { max-width: 900px; margin: 12px auto; padding: 12px; }
.tabs button { border:none; padding:8px 14px; margin-right:5px; background:#eee; cursor:pointer; }
.tabs button.active { background:#4285f4; color:#fff; }
.panel { margin-top:16px; }
.form input, .form textarea { width:100%; margin-bottom:8px; padding:8px; }
.card { background:#fafafa; border:1px solid #ddd; padding:10px; margin-bottom:8px; }
.product { margin-bottom:10px; }
.chat-box { background:#f8f9fa; border:1px solid #ddd; min-height:140px; padding:8px; margin-bottom:8px; }
.chat-line.user { text-align:right; }
.chat-line.assistant { text-align:left; }
</style>
