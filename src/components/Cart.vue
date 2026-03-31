<template>
  <div class="cart-page">
    <h1>Giỏ hàng của bạn</h1>

    <div v-if="cart.length === 0" class="empty-cart">
      <p>Giỏ hàng trống</p>
      <router-link to="/shop" class="shop-btn">Tiếp tục mua sắm</router-link>
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
            <button @click="decreaseQuantity(item)" class="qty-btn">-</button>
            <span class="qty-display">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" class="qty-btn">+</button>
          </div>
          <div class="item-total">
            <p>{{ formatPrice(item.price * item.quantity) }}đ</p>
            <button @click="removeItem(item)" class="remove-btn">Xóa</button>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-row">
          <span>Tổng cộng:</span>
          <span class="total-price">{{ formatPrice(cartTotal) }}đ</span>
        </div>
        <button @click="checkout" class="checkout-btn">Thanh toán</button>
        <router-link to="/shop" class="continue-btn">Tiếp tục mua sắm</router-link>
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
  padding: 20px;
}

.empty-cart {
  text-align: center;
  padding: 50px 20px;
}

.shop-btn {
  display: inline-block;
  background: var(--primary-green);
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 20px;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 15px;
  align-items: center;
  padding: 15px;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  background: white;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}

.item-details h3 {
  margin: 0 0 5px;
  font-size: 1.1rem;
}

.item-price {
  color: var(--primary-green);
  font-weight: bold;
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border: 1px solid var(--border-light);
  background: white;
  color: var(--primary-green);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.qty-btn:hover {
  background: var(--primary-green);
  color: white;
}

.qty-display {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
}

.item-total {
  text-align: right;
}

.item-total p {
  font-weight: bold;
  color: var(--primary-green);
  margin: 0 0 5px;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
}

.remove-btn:hover {
  background: #c0392b;
}

.cart-summary {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--border-light);
  height: fit-content;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.total-price {
  color: var(--primary-green);
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
}

.checkout-btn:hover {
  background: #1976D2;
}

.continue-btn {
  display: block;
  text-align: center;
  color: var(--primary-green);
  text-decoration: none;
  font-weight: bold;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto;
  }

  .quantity-controls {
    grid-column: 2;
    justify-self: end;
  }

  .item-total {
    grid-column: 2;
    text-align: end;
  }
}
</style>