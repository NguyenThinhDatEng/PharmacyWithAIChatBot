<template>
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
      
      <!-- Nút Hotline -->
      <div class="hotline">
        <a href="tel:1800XXXX" class="hotline-btn">Hotline 1800 XXXX</a>
      </div>
      
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
