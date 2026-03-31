<template>
  <div class="product-detail-page">
    <div v-if="product" class="product-container">
      <!-- Header sản phẩm -->
      <div class="product-header">
        <div class="product-image-section">
          <img :src="product.image" :alt="product.name" class="product-main-image" />
        </div>
        <div class="product-info-section">
          <h1 class="product-title">{{ product.name }}</h1>
          <p class="product-id">Mã sản phẩm: {{ product.productId }}</p>

          <!-- Thông tin giá & khuyến mãi -->
          <div class="price-section">
            <div class="current-price">{{ formatPrice(product.price) }}đ</div>
            <div class="original-price">{{ formatPrice(product.originalPrice) }}đ</div>
            <span class="discount-badge">{{ product.discount }}</span>
          </div>
          <div class="promotion-info">{{ product.promotion }}</div>

          <!-- Đánh giá & tương tác -->
          <div class="rating-section">
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= product.rating.stars }">
                ★
              </span>
            </div>
            <span class="rating-text">
              {{ product.rating.stars }}/5 ({{ product.rating.reviews }} đánh giá, {{ product.rating.comments }} bình luận)
            </span>
          </div>
          <button class="review-btn">Xem đánh giá & bình luận</button>
        </div>
      </div>

      <!-- Mô tả sản phẩm -->
      <div class="product-description">
        <h2>Mô tả sản phẩm</h2>
        <p class="description-text">{{ product.description }}</p>
        <div class="key-ingredients">
          <h3>Thành phần chính:</h3>
          <ul>
            <li v-for="ingredient in product.specifications.ingredients.slice(0, 5)" :key="ingredient">
              {{ ingredient }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Thông số kỹ thuật -->
      <div class="product-specifications">
        <h2>Thông số kỹ thuật</h2>
        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label">Dung tích:</span>
            <span class="spec-value">{{ product.volume }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Thành phần:</span>
            <span class="spec-value">{{ product.specifications.ingredients.join(', ') }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Xuất xứ:</span>
            <span class="spec-value">{{ product.specifications.origin.join(', ') }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Nhà sản xuất:</span>
            <span class="spec-value">{{ product.specifications.manufacturer.join(', ') }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Hạn sử dụng:</span>
            <span class="spec-value">{{ product.specifications.shelfLife }}</span>
          </div>
        </div>
      </div>

      <!-- Chính sách bán hàng -->
      <div class="product-policies">
        <h2>Chính sách bán hàng</h2>
        <div class="policies-list">
          <div class="policy-item">
            <span class="policy-icon">🚚</span>
            <div>
              <strong>Vận chuyển:</strong> {{ product.policies.shipping }}
            </div>
          </div>
          <div class="policy-item">
            <span class="policy-icon">↩️</span>
            <div>
              <strong>Đổi trả:</strong> {{ product.policies.return }}
            </div>
          </div>
        </div>
      </div>

      <!-- Nút hành động -->
      <div class="action-buttons">
        <button class="add-to-cart-btn" @click="addToCart(product)">
          🛒 Thêm vào giỏ hàng
        </button>
        <button class="buy-now-btn" @click="buyNow(product)">
          ⚡ Mua ngay
        </button>
      </div>
    </div>

    <div v-else class="product-not-found">
      <h2>Sản phẩm không tồn tại</h2>
      <router-link to="/shop" class="back-btn">Quay lại Tủ thuốc gia đình</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import productsData from '../data/products.json';

const route = useRoute();
const product = ref(null);

async function loadProduct() {
  // Find product by productId instead of id
  product.value = productsData.find(p => p.productId === route.params.id);
}

function formatPrice(price) {
  return price.toLocaleString('vi-VN');
}

function addToCart(item) {
  alert(`Đã thêm ${item.name} vào giỏ hàng`);
}

function buyNow(item) {
  alert(`Mua ngay: ${item.name}`);
}

onMounted(loadProduct);
</script>

<style scoped>
.product-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.product-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.product-image-section {
  display: flex;
  justify-content: center;
}

.product-main-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.product-id {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 2rem;
  font-weight: bold;
  color: #e74c3c;
}

.original-price {
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
}

.discount-badge {
  background: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

.promotion-info {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 5px;
  padding: 10px;
  color: #856404;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
}

.star.filled {
  color: #f39c12;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
}

.review-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  align-self: flex-start;
}

.product-description,
.product-specifications,
.product-policies {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-description h2,
.product-specifications h2,
.product-policies h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.description-text {
  line-height: 1.6;
  color: #555;
  margin-bottom: 20px;
}

.key-ingredients h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.key-ingredients ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.key-ingredients li {
  background: #f8f9fa;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
  color: #666;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-label {
  font-weight: bold;
  color: #2c3e50;
}

.spec-value {
  color: #666;
  text-align: right;
}

.policies-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.policy-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.policy-icon {
  font-size: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 30px 0;
}

.add-to-cart-btn,
.buy-now-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn {
  background: #27ae60;
  color: white;
}

.add-to-cart-btn:hover {
  background: #229954;
}

.buy-now-btn {
  background: #e74c3c;
  color: white;
}

.buy-now-btn:hover {
  background: #c0392b;
}

.product-not-found {
  text-align: center;
  padding: 50px 20px;
}

.back-btn {
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .product-header {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .current-price {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .product-description,
  .product-specifications,
  .product-policies {
    padding: 20px;
  }
}
</style>