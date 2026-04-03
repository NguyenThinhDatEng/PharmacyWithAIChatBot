<template>
  <div class="cart-page">
    <h1><i class="fas fa-basket-shopping"></i> Giỏ hàng của bạn</h1>

    <div v-if="cart.length === 0" class="empty-cart">
      <div class="empty-icon">
        <i class="fas fa-basket-shopping"></i>
      </div>
      <h3>Giỏ hàng trống</h3>
      <p>Hãy thêm sản phẩm từ tủ thuốc gia đình</p>
      <router-link to="/shop" class="shop-btn">
        <i class="fas fa-pills"></i> Tiếp tục mua sắm
      </router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cart" :key="item.productId" class="cart-item">
          <img :src="item.image" :alt="item.name" class="item-image" />
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-price">{{ formatPrice(item.price) }}đ</p>
          </div>
          <div class="quantity-controls">
            <button @click="decreaseQuantity(item)" class="qty-btn" aria-label="Giảm số lượng">
              <i class="fas fa-minus"></i>
            </button>
            <span class="qty-display">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" class="qty-btn" aria-label="Tăng số lượng">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="item-total">
            <p class="total-amount">{{ formatPrice(item.price * item.quantity) }}đ</p>
            <button @click="removeItem(item)" class="remove-btn" aria-label="Xóa sản phẩm">
              <i class="fas fa-trash-can"></i> Xóa
            </button>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <h3>Tóm tắt đơn hàng</h3>
        <div class="summary-detail">
          <span>Số sản phẩm:</span>
          <span>{{ cart.length }}</span>
        </div>
        <div class="summary-row">
          <span>Tổng cộng:</span>
          <span class="total-price">{{ formatPrice(cartTotal) }}đ</span>
        </div>
        <button @click="checkout" class="checkout-btn">
          <i class="fas fa-money-check-dollar"></i> Thanh toán
        </button>
        <router-link to="/shop" class="continue-btn">
          <i class="fas fa-chevron-left"></i> Tiếp tục mua sắm
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const base = 'http://localhost:3000/api';
const cart = ref([]);

const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart.value = JSON.parse(savedCart);
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart.value));
}

function increaseQuantity(item) {
  item.quantity += 1;
  saveCart();
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    removeItem(item);
  }
  saveCart();
}

function removeItem(item) {
  const index = cart.value.indexOf(item);
  if (index > -1) {
    cart.value.splice(index, 1);
  }
  saveCart();
}

function formatPrice(value) {
  return Number(value).toLocaleString('vi-VN');
}

async function checkout() {
  if (cart.value.length === 0) return;
  const order = {
    userId: 'user1',
    items: cart.value.map(i => ({ productId: i.productId, quantity: i.quantity }))
  };
  try {
    await axios.post(`${base}/orders`, order);
    cart.value = [];
    saveCart();
    alert('Đặt hàng thành công!');
    router.push('/shop');
  } catch (error) {
    alert('Có lỗi xảy ra, vui lòng thử lại');
    console.error(error);
  }
}

watch(cart, saveCart, { deep: true });

onMounted(loadCart);
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 0;
}

.cart-page h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.cart-page h1 i {
  color: var(--primary);
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 64px 24px;
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.empty-icon i {
  font-size: 2rem;
  color: var(--text-muted);
}

.empty-cart h3 {
  margin-bottom: 8px;
}

.empty-cart p {
  margin-bottom: 24px;
}

.shop-btn {
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

.shop-btn:hover {
  background: var(--primary-dark);
  color: white;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding: 20px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: var(--bg-white);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease;
}

.cart-item:hover {
  box-shadow: var(--shadow-md);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--bg-subtle);
}

.item-details h3 {
  margin: 0 0 6px;
  font-size: 1rem;
  color: var(--text-heading);
}

.item-price {
  color: var(--primary);
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  background: var(--bg-white);
  color: var(--text-heading);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  padding: 0;
  min-height: unset;
}

.qty-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: none;
}

.qty-display {
  min-width: 32px;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-heading);
}

.item-total {
  text-align: right;
}

.total-amount {
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 8px;
  font-size: 1.1rem;
}

.remove-btn {
  background: none;
  color: var(--accent-red);
  border: 1px solid var(--accent-red);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  min-height: unset;
}

.remove-btn:hover {
  background: var(--accent-red);
  color: white;
}

/* Summary */
.cart-summary {
  background: var(--bg-white);
  padding: 28px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 100px;
}

.cart-summary h3 {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.summary-detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.total-price {
  color: var(--primary);
}

.checkout-btn {
  width: 100%;
  padding: 16px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.checkout-btn:hover {
  background: var(--primary-dark);
  box-shadow: var(--shadow-md);
  color: white;
}

.continue-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 8px;
  transition: color 0.2s ease;
}

.continue-btn:hover {
  color: var(--primary-dark);
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto;
    padding: 16px;
  }

  .quantity-controls {
    grid-column: 2;
    justify-self: start;
  }

  .item-total {
    grid-column: 2;
    text-align: left;
  }

  .cart-summary {
    position: static;
  }
}
</style>
