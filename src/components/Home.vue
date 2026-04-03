<template>
  <div class="home">
    <!-- Hero Banner -->
    <section class="hero-banner">
      <div class="banner-content">
        <p class="hero-tag"><i class="fas fa-shield-alt"></i> Uy tín - Tận tâm - Chất lượng</p>
        <h1>Người bạn đồng hành sức khỏe gia đình bạn</h1>
        <p>Kết hợp tư vấn tận tâm và công nghệ AI hiện đại cho sức khỏe tối ưu.</p>
        <div class="cta-buttons">
          <router-link to="/shop" class="cta-btn primary">
            <i class="fas fa-capsules"></i> Khám phá tủ thuốc
          </router-link>
          <router-link to="/chat" class="cta-btn outline">
            <i class="fas fa-robot"></i> Chat với Dược sĩ AI
          </router-link>
        </div>
      </div>
      <div class="banner-image">
        <img :src="BannerImage" alt="Dược sĩ trao thuốc" />
      </div>
    </section>

    <!-- Trust Badges -->
    <section class="trust-badges">
      <div class="badge-item">
        <i class="fas fa-truck-fast"></i>
        <span>Giao hàng nhanh</span>
      </div>
      <div class="badge-item">
        <i class="fas fa-certificate"></i>
        <span>Thuốc chính hãng</span>
      </div>
      <div class="badge-item">
        <i class="fas fa-headset"></i>
        <span>Tư vấn 24/7</span>
      </div>
      <div class="badge-item">
        <i class="fas fa-rotate-left"></i>
        <span>Đổi trả dễ dàng</span>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="why-choose">
      <h2>Tại sao chọn Trương Thị Yến?</h2>
      <p class="section-subtitle">Hơn 20 năm kinh nghiệm phục vụ sức khỏe cộng đồng</p>
      <div class="benefits-grid">
        <div class="benefit-item">
          <div class="benefit-icon-wrap">
            <i class="fas fa-user-md"></i>
          </div>
          <h6>Dược sĩ tư vấn 24/7</h6>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon-wrap">
            <i class="fas fa-search"></i>
          </div>
          <h6>Nguồn gốc minh bạch</h6>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon-wrap">
            <i class="fas fa-shipping-fast"></i>
          </div>
          <h6>Giao hàng nhanh</h6>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon-wrap">
            <i class="fas fa-robot"></i>
          </div>
          <h6>AI thông minh</h6>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon-wrap">
            <i class="fas fa-hospital"></i>
          </div>
          <h6>Chăm sóc toàn diện</h6>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon-wrap">
            <i class="fas fa-heart"></i>
          </div>
          <h6>Tận tâm phục vụ</h6>
        </div>
      </div>
    </section>

    <!-- Product Categories -->
    <section class="product-categories">
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

    <!-- Blog Preview -->
    <section class="blog-preview">
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
import { computed } from 'vue';
import BannerImage from '../assets/banner.png';
import blogPosts from '../data/blogPosts.json';

const latestPosts = computed(() => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3);
});
</script>

<style scoped>
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
  margin-bottom: 16px;
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
