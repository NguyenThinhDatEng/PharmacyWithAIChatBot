<template>
  <div class="product-detail-page">
    <div v-if="product" class="product-container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/">Trang chủ</router-link>
        <i class="fas fa-chevron-right"></i>
        <router-link to="/shop">Tủ thuốc</router-link>
        <i class="fas fa-chevron-right"></i>
        <span>{{ product.name }}</span>
      </nav>

      <!-- Product Header -->
      <div class="product-header">
        <div class="product-image-section">
          <img :src="product.image" :alt="product.name" class="product-main-image" />
        </div>
        <div class="product-info-section">
          <h1 class="product-title">{{ product.name }}</h1>
          <p class="product-id">
            <i class="fas fa-hashtag"></i> Mã: {{ product.productId }}
          </p>

          <!-- Price -->
          <div class="price-section">
            <div class="current-price">{{ formatPrice(product.price) }}đ</div>
            <div class="original-price">{{ formatPrice(product.originalPrice) }}đ</div>
            <span class="discount-badge">{{ product.discount }}</span>
          </div>

          <div class="promotion-info">
            <i class="fas fa-tag"></i> {{ product.promotion }}
          </div>

          <!-- Rating -->
          <div class="rating-section">
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= product.rating.stars }">
                <i class="fas fa-star"></i>
              </span>
            </div>
            <span class="rating-text">
              {{ product.rating.stars }}/5 ({{ product.rating.reviews }} đánh giá)
            </span>
          </div>

          <!-- Action buttons -->
          <div class="action-buttons">
            <button class="add-to-cart-btn" @click="addToCart(product)">
              <i class="fas fa-basket-shopping"></i> Thêm vào giỏ hàng
            </button>
            <button class="buy-now-btn" @click="buyNow(product)">
              <i class="fas fa-credit-card"></i> Mua ngay
            </button>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="product-section">
        <h2><i class="fas fa-circle-info"></i> Mô tả sản phẩm</h2>
        <p class="description-text">{{ product.description }}</p>
        <div class="key-ingredients">
          <h3>Thành phần chính:</h3>
          <div class="ingredient-tags">
            <span v-for="ingredient in product.specifications.ingredients.slice(0, 5)" :key="ingredient" class="ingredient-tag">
              {{ ingredient }}
            </span>
          </div>
        </div>
      </div>

      <!-- Specs -->
      <div class="product-section">
        <h2><i class="fas fa-list-check"></i> Thông số kỹ thuật</h2>
        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label">Dung tích</span>
            <span class="spec-value">{{ product.volume }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Thành phần</span>
            <span class="spec-value">{{ product.specifications.ingredients.join(', ') }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Xuất xứ</span>
            <span class="spec-value">{{ product.specifications.origin.join(', ') }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Nhà sản xuất</span>
            <span class="spec-value">{{ product.specifications.manufacturer.join(', ') }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Hạn sử dụng</span>
            <span class="spec-value">{{ product.specifications.shelfLife }}</span>
          </div>
        </div>
      </div>

      <!-- Policies -->
      <div class="product-section">
        <h2><i class="fas fa-shield-halved"></i> Chính sách bán hàng</h2>
        <div class="policies-list">
          <div class="policy-item">
            <div class="policy-icon-wrap">
              <i class="fas fa-truck-fast"></i>
            </div>
            <div>
              <strong>Vận chuyển</strong>
              <p>{{ product.policies.shipping }}</p>
            </div>
          </div>
          <div class="policy-item">
            <div class="policy-icon-wrap">
              <i class="fas fa-rotate-left"></i>
            </div>
            <div>
              <strong>Đổi trả</strong>
              <p>{{ product.policies.return }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="product-not-found">
      <div class="not-found-icon">
        <i class="fas fa-magnifying-glass"></i>
      </div>
      <h2>Sản phẩm không tồn tại</h2>
      <p>Sản phẩm bạn tìm kiếm không có trong hệ thống.</p>
      <router-link to="/shop" class="back-btn">
        <i class="fas fa-chevron-left"></i> Quay lại Tủ thuốc
      </router-link>
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
  product.value = productsData.find(p => p.productId === route.params.id);
}

function formatPrice(price) {
  return price.toLocaleString('vi-VN');
}

function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const exists = cart.find(p => p.productId === item.productId);
  if (exists) {
    exists.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Đã thêm ${item.name} vào giỏ hàng`);
}

function buyNow(item) {
  addToCart(item);
}

onMounted(loadProduct);
</script>

<style scoped>
.product-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 0;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 0.875rem;
}

.breadcrumb a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: var(--primary);
}

.breadcrumb i {
  font-size: 0.625rem;
  color: var(--text-muted);
}

.breadcrumb span {
  color: var(--text-heading);
  font-weight: 500;
}

.product-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}

.product-image-section {
  display: flex;
  justify-content: center;
  background: var(--bg-subtle);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.product-main-image {
  max-width: 100%;
  max-height: 360px;
  height: auto;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-heading);
}

.product-id {
  color: var(--text-muted);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  font-family: var(--font-heading);
}

.original-price {
  font-size: 1.1rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.discount-badge {
  background: var(--accent-red);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.8125rem;
}

.promotion-info {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: #92400E;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
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
  color: var(--border);
  font-size: 1rem;
}

.star.filled {
  color: var(--accent-amber);
}

.rating-text {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.add-to-cart-btn,
.buy-now-btn {
  padding: 14px 24px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.add-to-cart-btn {
  background: var(--bg-white);
  color: var(--primary);
  border: 2px solid var(--primary);
}

.add-to-cart-btn:hover {
  background: var(--primary);
  color: white;
}

.buy-now-btn {
  background: var(--secondary);
  color: white;
  border: 2px solid var(--secondary);
}

.buy-now-btn:hover {
  background: var(--secondary-dark);
  border-color: var(--secondary-dark);
  color: white;
}

/* Product Sections */
.product-section {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  padding: 28px 32px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}

.product-section h2 {
  color: var(--text-heading);
  margin-bottom: 20px;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-section h2 i {
  color: var(--primary);
  font-size: 1.1rem;
}

.description-text {
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.key-ingredients h3 {
  color: var(--text-heading);
  margin-bottom: 12px;
  font-size: 1rem;
}

.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ingredient-tag {
  background: var(--bg-subtle);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  color: var(--primary);
  border: 1px solid var(--border-light);
  font-weight: 500;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-light);
  gap: 16px;
}

.spec-item:last-child { border-bottom: none; }

.spec-label {
  font-weight: 600;
  color: var(--text-heading);
  font-size: 0.9375rem;
  flex-shrink: 0;
}

.spec-value {
  color: var(--text-secondary);
  text-align: right;
  font-size: 0.9375rem;
}

.policies-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.policy-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
}

.policy-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
}

.policy-item strong {
  display: block;
  color: var(--text-heading);
  margin-bottom: 4px;
}

.policy-item p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

/* Not Found */
.product-not-found {
  text-align: center;
  padding: 80px 24px;
}

.not-found-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.not-found-icon i {
  font-size: 2rem;
  color: var(--text-muted);
}

.product-not-found p {
  margin-bottom: 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary);
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--primary-dark);
  color: white;
}

@media (max-width: 768px) {
  .product-header {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 20px;
  }

  .product-title { font-size: 1.5rem; }
  .current-price { font-size: 1.5rem; }

  .action-buttons {
    flex-direction: column;
  }

  .product-section {
    padding: 20px;
  }
}
</style>
