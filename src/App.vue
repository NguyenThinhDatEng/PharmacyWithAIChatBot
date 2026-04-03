<template>
  <div class="app-layout">
    <header class="header">
      <div class="header-container">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <img :src="Logo" alt="Nhà thuốc Trương Thị Yến" class="logo-img" />
          <span class="brand-name">Trương Thị Yến</span>
        </router-link>

        <!-- Navigation -->
        <nav class="nav-menu" :class="{ 'nav-open': isMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMenu">
            <i class="fas fa-home"></i> Trang Chủ
          </router-link>
          <router-link to="/shop" class="nav-link" @click="closeMenu">
            <i class="fas fa-capsules"></i> Tủ thuốc
          </router-link>
          <router-link to="/blog" class="nav-link" @click="closeMenu">
            <i class="fas fa-book-medical"></i> Kiến thức
          </router-link>
          <router-link to="/services" class="nav-link" @click="closeMenu">
            <i class="fas fa-hand-holding-medical"></i> Dịch vụ
          </router-link>
          <router-link to="/about" class="nav-link" @click="closeMenu">
            <i class="fas fa-info-circle"></i> Giới thiệu
          </router-link>
          <router-link to="/contact" class="nav-link" @click="closeMenu">
            <i class="fas fa-phone-alt"></i> Liên hệ
          </router-link>
        </nav>

        <!-- Hotline -->
        <a href="tel:18001234" class="hotline-btn">
          <i class="fas fa-headset"></i> 1800 1234
        </a>

        <!-- Hamburger -->
        <div class="hamburger" @click="toggleMenu" v-if="isMobile">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </div>
    </header>

    <!-- Category Mega-Nav (Long Châu style) -->
    <CategoryNav />

    <main class="container">
      <router-view />
    </main>

    <Chat />

    <footer class="app-footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-col footer-brand">
            <img :src="Logo" alt="Logo" class="footer-logo" />
            <h4>Nhà thuốc Trương Thị Yến</h4>
            <p>Đồng hành cùng sức khỏe gia đình Việt. Tư vấn tận tâm, dược phẩm chất lượng.</p>
          </div>
          <div class="footer-col">
            <h4>Liên kết</h4>
            <ul>
              <li><router-link to="/shop">Tủ thuốc gia đình</router-link></li>
              <li><router-link to="/blog">Kiến thức y khoa</router-link></li>
              <li><router-link to="/services">Dịch vụ</router-link></li>
              <li><router-link to="/about">Giới thiệu</router-link></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Liên hệ</h4>
            <ul>
              <li><i class="fas fa-phone-alt"></i> Hotline: 1800 1234</li>
              <li><i class="fas fa-envelope"></i> support@pharmacyai.vn</li>
              <li><i class="fas fa-map-marker-alt"></i> Dương Sơn, Tam Sơn, Từ Sơn, Bắc Ninh</li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Theo dõi</h4>
            <div class="social-links">
              <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="#" aria-label="Zalo"><i class="fas fa-comment-dots"></i></a>
            </div>
            <p class="footer-note">Mở cửa: 7:00 - 21:00 hàng ngày</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Nhà thuốc Trương Thị Yến. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Chat from './components/Chat.vue';
import CategoryNav from './components/CategoryNav.vue';
import Logo from './assets/Logo.png';

const isMenuOpen = ref(false);
const isMobile = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) isMenuOpen.value = false;
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

/* Header nav active state */
.nav-link {
  border-bottom: 3px solid transparent;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.nav-link i {
  margin-right: 4px;
  font-size: 0.8em;
}

.nav-link.router-link-active {
  border-bottom-color: var(--primary);
  color: var(--primary);
  font-weight: 600;
}

/* Footer */
.app-footer {
  background: var(--text-heading);
  color: rgba(255, 255, 255, 0.85);
  padding: 0;
  margin-top: 48px;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 32px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
}

.footer-col h4 {
  color: var(--text-white);
  font-family: var(--font-heading);
  margin: 0 0 16px;
  font-size: 1rem;
  font-weight: 600;
}

.footer-col p {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col ul li {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.65);
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-col ul li i {
  width: 16px;
  text-align: center;
  color: var(--primary-light);
}

.footer-col ul li a {
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-col ul li a:hover {
  color: var(--primary-light);
}

.social-links {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.social-links a {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.social-links a:hover {
  background: var(--primary);
  color: var(--text-white);
  transform: translateY(-2px);
}

.footer-note {
  font-size: 0.8125rem !important;
  color: rgba(255, 255, 255, 0.5) !important;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8125rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-inner {
    padding: 32px 16px 16px;
  }

  .hotline-btn {
    display: none;
  }

  .nav-link i {
    margin-right: 6px;
  }
}
</style>
