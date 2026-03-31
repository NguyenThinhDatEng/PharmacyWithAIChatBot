<template>
  <div class="panel">
    <div class="shop-top">
      <h2>Tủ thuốc gia đình</h2>
    </div>

    <div class="floating-cart">
      <router-link to="/cart" class="floating-cart-btn">
        🛒 {{ cart.length }}
      </router-link>
    </div>

    <!-- Dòng tìm kiếm -->
    <div class="search-bar">
      <input v-model="searchTerm" type="text" placeholder="Tìm kiếm sản phẩm theo tên..." class="search-input" />
    </div>
    
    <!-- Thanh danh mục sản phẩm -->
    <div class="category-filter">
      <button 
        v-for="cat in categories" 
        :key="cat" 
        :class="{ active: selectedCategory === cat }" 
        @click="selectedCategory = cat"
        class="category-btn"
      >
        {{ cat }}
      </button>
    </div>
    
    <!-- Lưới sản phẩm -->
    <div class="product-grid">
      <div v-for="p in filteredProducts" :key="p.id" class="product-card">
        <div class="product-top">
          <img :src="p.image" alt="Product Image" class="product-image" />
          <h5>{{ p.name }}</h5>
        </div>
        <p class="product-desc">{{ p.description }}</p>
        <p class="product-price">Giá: {{ formatPrice(p.price) }}đ</p>
        <div class="product-controls">
          <button :disabled="p.stock === 0" @click="addToCart(p, 1)" class="add-btn">Thêm vào giỏ</button>
          <router-link :to="`/product/${p.productId}`" class="detail-btn">Xem chi tiết</router-link>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import productsData from '../data/products.json';

const base = 'http://localhost:3000/api';
const products = ref([]);
const cart = ref([]);
const qty = ref(1);
const categories = ['Tất cả', 'Tiêu hóa', 'Hô hấp', 'Khớp xương', 'Mẹ & Bé', 'Chăm sóc da', 'Đề kháng'];
const selectedCategory = ref('Tất cả');
const searchTerm = ref('');

const filteredProducts = computed(() => {
  let filtered = products.value;
  if (selectedCategory.value !== 'Tất cả') {
    filtered = filtered.filter(p => p.category === selectedCategory.value);
  }
  if (searchTerm.value) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
  }
  return filtered;
});

async function loadProducts() {
  // Load từ JSON fake
  products.value = productsData;
}

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart.value = JSON.parse(savedCart);
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart.value));
}

function addToCart(item, amount = 1) {
  const exists = cart.value.find(p => p.productId === item.productId);
  if (exists) {
    exists.quantity += amount;
  } else {
    cart.value.push({ ...item, quantity: amount });
  }
  saveCart();
}

function formatPrice(value) {
  return Number(value).toLocaleString('vi-VN');
}

onMounted(() => {
  loadProducts();
  loadCart();
});
</script>