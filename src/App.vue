<template>
  <div class="app-layout">
    <header class="header">
      <div class="header-container">
        <!-- Logo & Thương hiệu -->
      <div class="logo">
        <img :src="Logo" alt="Pharmacy Logo" class="logo-img" />
      </div>
      
      <!-- Thanh menu điều hướng -->
      <nav class="nav-menu" :class="{ 'nav-open': isMenuOpen }">
        <router-link to="/" class="nav-link">Trang Chủ</router-link>
        <router-link to="/shop" class="nav-link">Tủ thuốc gia đình</router-link>
        <router-link to="/blog" class="nav-link">Kiến thức y khoa</router-link>
        <router-link to="/services" class="nav-link">Dịch vụ</router-link>
        <router-link to="/about" class="nav-link">Giới thiệu</router-link>
        <router-link to="/contact" class="nav-link">Liên hệ</router-link>
      </nav>
      
      <!-- Hamburger menu cho mobile -->
      <div class="hamburger" @click="toggleMenu" v-if="isMobile">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>
  </header>
  
  <div class="container">
    <router-view />
  </div>

  <Chat />

  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-column">
        <h4>Nhà thuốc Trương Thị yến</h4>
        <p>Đồng hành cùng sức khỏe gia đình Việt.</p>
      </div>
      <div class="footer-column">
        <h4>Liên hệ</h4>
        <p>Hotline: 1800 1234</p>
        <p>Email: support@pharmacyai.vn</p>
      </div>
      <div class="footer-column">
        <h4>Theo dõi</h4>
        <p>Facebook | Instagram | Zalo</p>
      </div>
    </div>
    <p class="footer-copyright">© 2026 Trương Thị Yến</p>
  </footer>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Chat from './components/Chat.vue';
import Logo from './assets/Logo.png';

const isMenuOpen = ref(false);
const isMobile = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) isMenuOpen.value = false; // Đóng menu khi resize lên desktop
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  flex: 1;
}

.nav-link {
  border-bottom: 3px solid transparent;
  transition: border-color 0.3s ease;
}

.nav-link.router-link-active {
  border-bottom-color: #27ae60;
}

.app-footer {
  background-color: #f8f9fa;
  padding: 20px 15px;
  margin-top: 30px;
  border-top: 1px solid #e6e6e6;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.footer-column {
  flex: 1;
  min-width: 180px;
}

.footer-column h4 {
  margin: 0 0 8px;
  color: #1c6b2d;
}

.footer-column p {
  margin: 4px 0;
  color: #555;
}

.footer-copyright {
  text-align: center;
  margin-top: 15px;
  color: #777;
  font-size: 14px;
}
</style>
