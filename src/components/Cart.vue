<template>
  <div class="cart-page">
    <h1><i class="fas fa-shopping-cart"></i> Giỏ hàng của bạn</h1>

    <div v-if="cart.length === 0" class="empty-cart">
      <div class="empty-icon">
        <i class="fas fa-cart-arrow-down"></i>
      </div>
      <h3>Giỏ hàng trống</h3>
      <p>Hãy thêm sản phẩm từ tủ thuốc gia đình</p>
      <router-link to="/shop" class="shop-btn">
        <i class="fas fa-capsules"></i> Tiếp tục mua sắm
      </router-link>
    </div>

    <div v-else>
      <div v-if="!showCheckoutForm" class="cart-content">
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
                <i class="fas fa-trash-alt"></i> Xóa
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
            <i class="fas fa-credit-card"></i> Thanh toán
          </button>

          <router-link to="/shop" class="continue-btn">
            <i class="fas fa-arrow-left"></i> Tiếp tục mua sắm
          </router-link>
        </div>
      </div>

      <div v-else class="checkout-panel">
        <div class="checkout-header">
          <div>
            <h3>Thanh toán đơn hàng</h3>
            <p class="checkout-total">Tổng: {{ formatPrice(cartTotal) }}đ</p>
          </div>
          <button @click="cancelCheckout" class="back-btn">
            <i class="fas fa-arrow-left"></i> Quay lại giỏ hàng
          </button>
        </div>

        <div class="checkout-form">
          <h4>Thông tin người mua</h4>
          <div class="field-group">
            <label class="form-field">
              <span>Họ và tên</span>
              <input type="text" v-model="buyer.name" placeholder="Nguyễn Văn A" />
            </label>
            <label class="form-field">
              <span>Số điện thoại</span>
              <input type="tel" v-model="buyer.phone" placeholder="0987654321" />
            </label>
            <label class="form-field">
              <span>Email</span>
              <input type="email" v-model="buyer.email" placeholder="email@example.com" />
            </label>
            <label class="form-field">
              <span>Địa chỉ</span>
              <input type="text" v-model="buyer.address" placeholder="Số nhà, đường, quận" />
            </label>
            <label class="form-field">
              <span>Ghi chú</span>
              <textarea v-model="buyer.note" placeholder="Ghi chú giao hàng hoặc yêu cầu đặc biệt"></textarea>
            </label>
          </div>

          <div class="payment-options">
            <h4>Phương thức thanh toán</h4>
            <div class="option-group">
              <label class="radio-label">
                <input type="radio" v-model="paymentMethod" value="bank_transfer" class="radio-input" />
                <span class="radio-text">Chuyển khoản ngân hàng</span>
              </label>
              <div v-show="paymentMethod === 'bank_transfer'" :class="{ 'bank-details-active': paymentMethod === 'bank_transfer' }" class="bank-details">
                <p><strong>Số tài khoản:</strong> 123456789</p>
                <p><strong>Ngân hàng:</strong> Vietcombank</p>
                <p><strong>Chủ tài khoản:</strong> Nhà thuốc ABC</p>
                <small>Vui lòng chuyển khoản theo thông tin trên và xác nhận sau khi thanh toán.</small>
              </div>
              <label class="radio-label">
                <input type="radio" v-model="paymentMethod" value="cash_on_delivery" class="radio-input" />
                <span class="radio-text">Thanh toán khi nhận hàng</span>
              </label>
            </div>
          </div>

          <div class="delivery-options">
            <h4>Phương thức nhận hàng</h4>
            <label class="checkbox-label">
              <input type="checkbox" v-model="pickupAtPharmacy" class="checkbox-input" />
              <span class="checkbox-text">Nhận tại nhà thuốc</span>
            </label>
            <p v-if="!pickupAtPharmacy" class="delivery-note">Hàng sẽ được giao tận nhà (phí ship tính thêm).</p>
          </div>

          <div class="checkout-actions">
            <button @click="submitOrder" class="submit-btn">Xác nhận đơn hàng</button>
            <button @click="cancelCheckout" class="cancel-btn">Quay lại giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();
const base = 'http://localhost:3000/api';
const cart = ref([]);
const showCheckoutForm = ref(false);
const buyer = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  note: ''
});
const paymentMethod = ref('');
const pickupAtPharmacy = ref(false);

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

function checkout() {
  if (cart.value.length === 0) return;
  showCheckoutForm.value = true;
}

function cancelCheckout() {
  showCheckoutForm.value = false;
  paymentMethod.value = '';
  pickupAtPharmacy.value = false;
  buyer.value = {
    name: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  };
}

function validateCheckout() {
  if (!buyer.value.name.trim()) {
    toast.error('Vui lòng nhập họ và tên người mua.');
    return false;
  }
  if (!buyer.value.phone.trim()) {
    toast.error('Vui lòng nhập số điện thoại.');
    return false;
  }
  if (!buyer.value.address.trim()) {
    toast.error('Vui lòng nhập địa chỉ nhận hàng.');
    return false;
  }
  if (!paymentMethod.value) {
    toast.error('Vui lòng chọn phương thức thanh toán.');
    return false;
  }
  return true;
}

async function submitOrder() {
  if (!validateCheckout()) return;

  const orderPayload = {
    userId: 'user1',
    items: cart.value.map(i => ({ productId: i.productId, quantity: i.quantity })),
    buyer: {
      name: buyer.value.name.trim(),
      phone: buyer.value.phone.trim(),
      email: buyer.value.email.trim(),
      address: buyer.value.address.trim(),
      note: buyer.value.note.trim()
    },
    paymentMethod: paymentMethod.value,
    deliveryMethod: pickupAtPharmacy.value ? 'pickup' : 'delivery',
    total: cartTotal.value
  };

  try {
    await axios.post(`${base}/orders`, orderPayload);
    cart.value = [];
    saveCart();
    cancelCheckout();
    toast.success('Đặt hàng thành công!');
    router.push('/shop');
  } catch (error) {
    const message = error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại';
    toast.error(message);
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

.checkout-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.checkout-header h3 {
  margin: 0;
}

.checkout-total {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--bg-white);
  color: var(--text-heading);
  cursor: pointer;
  font-weight: 600;
}

.back-btn:hover {
  background: var(--bg-subtle);
}

.payment-options {
  margin-top: 16px;
}

.payment-options, .delivery-options, .checkout-form {
  margin-bottom: 20px;
  padding: 16px;
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.checkout-form h4,
.payment-options h4,
.delivery-options h4 {
  margin: 0 0 12px 0;
  font-size: 1rem;
  color: var(--text-heading);
}

.field-group {
  display: grid;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text-secondary);
}

.form-field input,
.form-field textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: var(--bg-white);
  color: var(--text-heading);
}

.form-field textarea {
  min-height: 100px;
  resize: vertical;
}

.checkout-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.submit-btn,
.cancel-btn {
  flex: 1 1 160px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.submit-btn {
  background: var(--primary);
  color: white;
}

.submit-btn:hover {
  background: var(--primary-dark);
}

.cancel-btn {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  color: var(--text-heading);
}

.payment-options, .delivery-options {
  background: var(--bg-white);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-label, .checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9375rem;
}

.radio-input, .checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}

.radio-text, .checkbox-text {
  color: var(--text-secondary);
}

.bank-details {
  margin-left: 26px;
  background: var(--bg-white);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 0.875rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 12px;
}

.bank-details-active {
  padding: 12px;
  max-height: 120px;
}

.delivery-note {
  margin-left: 26px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
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

  .checkout-panel {
    gap: 16px;
  }

  .checkout-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .field-group {
    gap: 12px;
  }

  .checkout-actions {
    flex-direction: column;
  }

  .submit-btn, .cancel-btn {
    flex: 1;
  }

  .payment-options, .delivery-options {
    padding: 12px;
  }

  .bank-details {
    margin-left: 0;
  }

  .delivery-note {
    margin-left: 0;
  }
}
</style>
