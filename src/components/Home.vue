<template>
  <div class="home">
    <!-- Hero Banner Carousel -->
    <section class="hero-banner">
      <div class="banner-carousel">
        <div
          class="banner-slide"
          v-for="(banner, index) in banners"
          :key="index"
          :class="{ active: currentBanner === index }"
          :style="{ backgroundImage: `url(${banner})` }"
        ></div>
        <!-- Overlay + CTA always visible -->
        <div class="banner-overlay">
          <div class="banner-content">
            <p class="hero-tag"><i class="fas fa-shield-alt"></i> Uy tín - Tận tâm - Chất lượng</p>
            <div class="cta-buttons">
              <router-link to="/shop" class="cta-btn primary">
                <i class="fas fa-capsules"></i> Khám phá tủ thuốc
              </router-link>
              <button class="cta-btn outline" @click="openChat">
                <i class="fas fa-robot"></i> Chat với Dược sĩ AI
              </button>
            </div>
          </div>
        </div>
        <!-- Dots navigation -->
        <div class="banner-dots">
          <button
            v-for="(_, i) in banners"
            :key="i"
            :class="{ active: currentBanner === i }"
            @click="goToBanner(i)"
            class="banner-dot"
          ></button>
        </div>
        <!-- Prev / Next arrows -->
        <button class="banner-arrow banner-arrow-left" @click="prevBanner"><i class="fas fa-chevron-left"></i></button>
        <button class="banner-arrow banner-arrow-right" @click="nextBanner"><i class="fas fa-chevron-right"></i></button>
      </div>
    </section>

    <!-- Why Choose Us - ảnh -->
    <section class="why-choose">
      <img src="/why-choose.jpg" alt="Tại sao chọn nhà thuốc Trương Thị Yến" class="why-choose-img" />
    </section>

    <!-- Product Categories -->
    <section class="product-categories" style="background-image: url('/backgrounds/bg1.jpg'); background-size: cover; background-position: center;">
      <h2>Tủ thuốc gia đình</h2>
      <p class="section-subtitle">Danh mục sản phẩm phổ biến</p>
      <div class="cabinet-grid">
        <router-link to="/shop" class="category-card">
          <img src="/medicineCabinet/digestion.png" alt="Tiêu hóa" />
          <div class="category-info">
            <h4>Tiêu hóa</h4>
            <p>Hỗ trợ tiêu hóa, giảm đau bụng, đầy hơi</p>
          </div>
        </router-link>
        <router-link to="/shop" class="category-card">
          <img src="/medicineCabinet/breathing.png" alt="Hô hấp" />
          <div class="category-info">
            <h4>Hô hấp</h4>
            <p>Đường hô hấp, giảm ho, sổ mũi</p>
          </div>
        </router-link>
        <router-link to="/shop" class="category-card">
          <img src="/medicineCabinet/mom_baby.png" alt="Mẹ & Bé" />
          <div class="category-info">
            <h4>Mẹ & Bé</h4>
            <p>Chăm sóc sức khỏe mẹ và bé yêu</p>
          </div>
        </router-link>
        <router-link to="/shop" class="category-card">
          <img src="/medicineCabinet/vitamin.png" alt="Vitamin" />
          <div class="category-info">
            <h4>Vitamin & Đề kháng</h4>
            <p>Bổ sung vitamin, tăng đề kháng</p>
          </div>
        </router-link>
      </div>
      <router-link to="/shop" class="view-all-btn">
        Xem tất cả sản phẩm <i class="fas fa-arrow-right"></i>
      </router-link>
    </section>

    <!-- Best Sellers -->
    <section class="best-sellers" style="background-image: url('/backgrounds/bg2.jpg'); background-size: cover; background-position: center;">
      <div class="best-sellers-header">
        <span class="bs-label"><i class="fas fa-fire"></i> Sản phẩm bán chạy</span>
      </div>
      <div class="bs-track-wrap">
        <button class="bs-arrow bs-arrow-left" @click="scrollBestSellers(-1)" :disabled="bsPage === 0">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="bs-slide-wrap">
          <Transition :name="slideDir">
            <div class="bs-track" :key="bsPage">
              <div
                v-for="product in visibleBsProducts"
                :key="product.productId"
                class="bs-card"
                @click="goToShop(product)"
              >
                <div class="bs-badge-origin" v-if="product.specifications?.origin?.[0]">
                  <span class="origin-flag">{{ getFlag(product.specifications.origin[0]) }}</span>
                  {{ product.specifications.origin[0] }}
                </div>
                <div v-if="product.discount && product.discount !== '0%'" class="bs-badge-discount">
                  {{ product.discount }}
                </div>
                <div v-if="product.promotion?.includes('tặng')" class="bs-badge-promo">
                  <i class="fas fa-gift"></i> {{ product.promotion.match(/Mua \d+ tặng \d+/)?.[0] }}
                </div>
                <img :src="product.image" :alt="product.name" class="bs-img" />
                <div class="bs-info">
                  <p class="bs-name">{{ product.name }}</p>
                  <div class="bs-price-row">
                    <span class="bs-price">{{ formatPrice(product.price) }}</span>
                    <span class="bs-original" :class="{ 'bs-invisible': !(product.originalPrice > product.price) }">
                      {{ formatPrice(product.originalPrice || product.price) }}
                    </span>
                  </div>
                  <p class="bs-volume">{{ product.volume }}</p>
                  <button class="bs-btn">Chọn mua</button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
        <button class="bs-arrow bs-arrow-right" @click="scrollBestSellers(1)" :disabled="bsPage >= bsTotalPages - 1">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>

    <!-- Blog Preview -->
    <section class="blog-preview" style="background-image: url('/backgrounds/bg3.jpg'); background-size: cover; background-position: center;">
      <h2>Kiến thức y khoa</h2>
      <p class="section-subtitle">Cập nhật thông tin sức khỏe hữu ích</p>
      <div class="blog-grid">
        <div v-for="post in latestPosts" :key="post.id" class="blog-card">
          <img class="blog-image" :src="post.image" :alt="post.title" />
          <div class="blog-content">
            <h3>{{ post.title }}</h3>
          </div>
        </div>
      </div>
      <router-link to="/blog" class="view-all-btn">
        Xem tất cả bài viết <i class="fas fa-arrow-right"></i>
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import blogPosts from '../data/blogPosts.json';
import allProducts from '../data/products.json';
import { chatOpen } from '../composables/useChat.js';

const router = useRouter();
const bsPage = ref(0);
const BS_PER_PAGE = 5;
const slideDir = ref('slide-left');

// Banner carousel
const banners = [
  '/banners/banner1.jpg',
  '/banners/banner2.jpg',
  '/banners/banner3.jpg',
  '/banners/banner4.jpg',
  '/banners/banner5.jpg',
  '/banners/banner6.jpg',
];
const currentBanner = ref(0);
let bannerTimer = null;

function nextBanner() {
  currentBanner.value = (currentBanner.value + 1) % banners.length;
}
function prevBanner() {
  currentBanner.value = (currentBanner.value - 1 + banners.length) % banners.length;
}
function goToBanner(i) {
  currentBanner.value = i;
}
function startBannerTimer() {
  bannerTimer = setInterval(nextBanner, 4000);
}
function stopBannerTimer() {
  clearInterval(bannerTimer);
}

function openChat() {
  chatOpen.value = true;
}

onMounted(startBannerTimer);
onUnmounted(stopBannerTimer);

const latestPosts = computed(() => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3);
});

const topSellingProducts = computed(() =>
  [...allProducts].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 12)
);

const bsTotalPages = computed(() => Math.ceil(topSellingProducts.value.length / BS_PER_PAGE));

const visibleBsProducts = computed(() => {
  const start = bsPage.value * BS_PER_PAGE;
  return topSellingProducts.value.slice(start, start + BS_PER_PAGE);
});

function scrollBestSellers(dir) {
  const next = bsPage.value + dir;
  if (next >= 0 && next < bsTotalPages.value) {
    slideDir.value = dir > 0 ? 'slide-left' : 'slide-right';
    bsPage.value = next;
  }
}

function goToShop(product) {
  router.push({ path: '/shop', query: { category: product.category } });
}

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + 'đ';
}

const FLAG_MAP = {
  'Nhật Bản': '🇯🇵', 'Đức': '🇩🇪', 'Hoa Kỳ': '🇺🇸', 'Úc': '🇦🇺',
  'Hàn Quốc': '🇰🇷', 'Anh': '🇬🇧', 'Việt Nam': '🇻🇳', 'Pháp': '🇫🇷',
  'Ý': '🇮🇹', 'Canada': '🇨🇦',
};
function getFlag(origin) {
  return FLAG_MAP[origin] || '🌐';
}
</script>

<style scoped>
/* Hero Banner Carousel */
.hero-banner {
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;
  margin-bottom: 0;
}

.banner-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.banner-slide.active {
  opacity: 1;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
  display: flex;
  align-items: center;
  z-index: 2;
}

.banner-content {
  padding: 0 64px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

.banner-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
}

.banner-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  padding: 0;
}

.banner-dot.active {
  background: #fff;
  transform: scale(1.3);
}

.banner-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  font-size: 1rem;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.banner-arrow:hover {
  background: rgba(255, 255, 255, 0.35);
}

.banner-arrow-left { left: 16px; }
.banner-arrow-right { right: 16px; }

/* Why Choose - image */
.why-choose {
  margin-bottom: 56px;
  padding: 0;
}

.why-choose-img {
  width: 100%;
  display: block;
  max-height: 480px;
  object-fit: cover;
}

/* Hero Tag */
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.95);
  padding: 8px 20px;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Trust Badges */
.trust-badges {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 56px;
  margin-top: -24px;
  position: relative;
  z-index: 1;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.badge-item i {
  font-size: 1.25rem;
  color: var(--primary);
  width: 40px;
  height: 40px;
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-item span {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-heading);
}

/* Section Subtitle */
.section-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 32px;
}

/* Benefit Icon Wrap (replaces emoji) */
.benefit-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--bg-subtle), var(--bg-muted));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.benefit-icon-wrap i {
  font-size: 1.5rem;
  color: var(--primary);
}

/* Category info padding */
.category-info {
  padding: 16px;
}

.category-info h4 {
  margin: 0 0 4px;
}

.category-info p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.category-card {
  text-decoration: none;
}

/* Best Sellers */
.best-sellers {
  margin-bottom: 56px;
  position: relative;
}

.best-sellers-header {
  text-align: center;
  position: relative;
  z-index: 3;
  margin-bottom: -20px;
}

.bs-label {
  display: inline-block;
  background: linear-gradient(135deg, #b71c1c 0%, #e53935 45%, #ff6d00 100%);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 10px 36px;
  border-radius: 32px;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 20px rgba(183, 28, 28, 0.55), 0 2px 8px rgba(255, 109, 0, 0.4);
}

.bs-label i {
  color: #ffe082;
  margin-right: 6px;
}

.bs-track-wrap {
  position: relative;
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  border-radius: 20px;
  padding: 32px 56px 20px;
}

.bs-slide-wrap {
  position: relative;
  overflow: hidden;
  flex: 1;
}

.bs-track {
  display: flex;
  gap: 16px;
  width: 100%;
}

/* Slide left (next page) */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}
.slide-left-leave-active,
.slide-right-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.slide-left-enter-from  { transform: translateX(100%); opacity: 0; }
.slide-left-leave-to    { transform: translateX(-100%); opacity: 0; }
.slide-right-enter-from { transform: translateX(-100%); opacity: 0; }
.slide-right-leave-to   { transform: translateX(100%); opacity: 0; }

.bs-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  color: var(--primary);
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
}

.bs-arrow:hover:not(:disabled) {
  background: var(--primary);
  color: #fff;
}

.bs-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.bs-arrow-left { left: 10px; }
.bs-arrow-right { right: 10px; }

.bs-card {
  flex: 1 1 0;
  min-width: 0;
  height: 360px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.bs-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
}

.bs-badge-origin {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255,255,255,0.9);
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #333;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 3px;
  z-index: 1;
}

.origin-flag { font-size: 0.85rem; }

.bs-badge-discount {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--accent-red);
  color: #fff;
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 1;
}

.bs-badge-promo {
  position: absolute;
  top: 36px;
  right: 8px;
  background: var(--accent-amber);
  color: #fff;
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 0.7rem;
  font-weight: 700;
  z-index: 1;
}

.bs-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  background: var(--bg-subtle);
}

.bs-info {
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.bs-name {
  font-size: 0.78rem;
  color: var(--text-heading);
  line-height: 1.4;
  max-height: calc(1.4em * 3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.bs-price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
  margin: 4px 0 0;
}

.bs-price {
  color: var(--accent-red);
  font-weight: 700;
  font-size: 0.95rem;
}

.bs-original {
  color: var(--text-muted);
  font-size: 0.75rem;
  text-decoration: line-through;
}

.bs-invisible {
  visibility: hidden;
}

.bs-volume {
  color: var(--text-muted);
  font-size: 0.72rem;
  margin: 0;
  background: var(--bg-subtle);
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
}

.bs-btn {
  margin-top: 8px;
  width: 100%;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 0;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.bs-btn:hover {
  background: var(--primary-dark);
}

@media (max-width: 768px) {
  .bs-track-wrap {
    padding: 16px 44px;
  }
  .bs-card {
    flex: 0 0 160px;
  }
  .bs-img {
    height: 120px;
  }
}

@media (max-width: 768px) {
  .trust-badges {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: -12px;
  }

  .badge-item {
    padding: 16px 12px;
  }

  .badge-item span {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .trust-badges {
    grid-template-columns: 1fr;
  }
}
</style>
