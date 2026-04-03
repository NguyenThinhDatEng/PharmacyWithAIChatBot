<template>
  <div class="panel">
    <div class="shop-header">
      <h2><i class="fas fa-capsules"></i> Tủ thuốc gia đình</h2>
      <p class="section-subtitle">Dược phẩm chất lượng, nguồn gốc rõ ràng</p>
    </div>

    <div class="floating-cart">
      <router-link to="/cart" class="floating-cart-btn">
        <i class="fas fa-shopping-cart"></i> {{ cart.length }}
      </router-link>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <div class="search-wrapper">
        <i class="fas fa-search search-icon"></i>
        <input v-model="searchTerm" type="text" placeholder="Tìm kiếm sản phẩm..." class="search-input" />
      </div>
    </div>

    <!-- Category Filter -->
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

    <!-- Product Grid -->
    <div class="product-grid">
      <div v-for="p in filteredProducts" :key="p.id" class="product-card">
        <div class="product-top">
          <img :src="p.image" :alt="p.name" class="product-image" />
          <h5>{{ p.name }}</h5>
        </div>
        <p class="product-desc">{{ p.description }}</p>
        <p class="product-price">{{ formatPrice(p.price) }}đ</p>
        <div class="product-controls">
          <button :disabled="p.stock === 0" @click="addToCart(p, 1)" class="add-btn">
            <i class="fas fa-cart-plus"></i> Thêm
          </button>
          <router-link :to="`/product/${p.productId}`" class="detail-btn">
            <i class="fas fa-eye"></i> Chi tiết
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0" class="no-results">
      <div class="no-results-icon">
        <i class="fas fa-search"></i>
      </div>
      <p>Không tìm thấy sản phẩm phù hợp</p>
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

<style scoped>
.shop-header {
  text-align: center;
  margin-bottom: 24px;
}

.shop-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.shop-header h2 i {
  color: var(--primary);
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

/* Search */
.search-wrapper {
  position: relative;
  max-width: 480px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 0.875rem;
}

.search-input {
  padding-left: 44px !important;
  border-radius: var(--radius-full) !important;
  background: var(--bg-subtle) !important;
  border: 2px solid var(--border-light) !important;
  max-width: none !important;
}

.search-input:focus {
  border-color: var(--primary) !important;
  background: var(--bg-white) !important;
}

/* No results */
.no-results {
  text-align: center;
  padding: 48px 24px;
}

.no-results-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.no-results-icon i {
  font-size: 1.5rem;
  color: var(--text-muted);
}

.no-results p {
  color: var(--text-muted);
}
</style>
