<template>
  <div class="panel">
    <h2>Chi tiết sản phẩm</h2>
    <div v-if="product" class="product-detail">      <img :src="product.image" alt="Product Image" class="product-detail-image" />      <h3>{{ product.name }}</h3>
      <p class="product-desc">{{ product.description || 'Hàm lượng: 500mg' }}</p>
      <p class="product-price">Giá: {{ product.price }}đ</p>
      <p class="product-stock">Còn lại: {{ product.stock }}</p>
      <div class="product-controls">
        <input type="number" v-model.number="qty" min="1" max="10" class="qty-input" />
        <button :disabled="product.stock === 0" @click="addToCart(product)" class="add-btn">Thêm vào giỏ</button>
      </div>
    </div>
    <div v-else>
      <p>Sản phẩm không tồn tại.</p>
    </div>
    <router-link to="/shop" class="back-btn">Quay lại Tủ thuốc gia đình</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import productsData from '../data/products.json';

const route = useRoute();
const product = ref(null);
const qty = ref(1);

async function loadProduct() {
  product.value = productsData.find(p => p.id === Number(route.params.id));
}

function addToCart(item) {
  alert(`Đã thêm ${item.name} vào giỏ`);
}

onMounted(loadProduct);
</script>