<template>
  <div class="home">
    <!-- Banner chính -->
    <section class="hero-banner">
      <div class="banner-content">
        <h1>Người bạn đồng hành sức khỏe gia đình bạn</h1>
        <p>Kết hợp tư vấn tận tâm và công nghệ AI hiện đại cho sức khỏe tối ưu.</p>
        <div class="cta-buttons">
          <router-link to="/shop" class="cta-btn outline">Khám phá tủ thuốc</router-link>
          <router-link to="/chat" class="cta-btn outline">Chat ngay với Dược sĩ AI</router-link>
        </div>
      </div>
      <div class="banner-image">
        <img :src="BannerImage" alt="Dược sĩ trao thuốc" />
      </div>
    </section>

    <!-- Tại sao chọn Trương Thị Yến? -->
    <section class="why-choose">
      <h2>Tại sao chọn Trương Thị Yến?</h2>
      <div class="benefits-grid">
        <div class="benefit-item">
          <div class="benefit-icon">💊</div>
          <h6>Dược sĩ tư vấn 24/7</h6>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🔍</div>
          <h6>Nguồn gốc thuốc minh bạch</h6>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🚚</div>
          <h6>Giao hàng nhanh chóng</h6>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🤖</div>
          <h6>Hệ thống AI thông minh</h6>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🏥</div>
          <h6>Chăm sóc toàn diện</h6>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">❤️</div>
          <h6>Tận tâm với khách hàng</h6>
        </div>
      </div>
    </section>

    <!-- Tủ thuốc gia đình -->
    <section class="product-categories">
      <h2>Tủ thuốc gia đình</h2>
      <div class="cabinet-grid">
        <div class="category-card">
          <img src="/medicineCabinet/digestion.png" alt="Tiêu hóa" />
          <h4>Tiêu hóa</h4>
          <p>Các sản phẩm hỗ trợ tiêu hóa, giảm đau bụng, đầy hơi.</p>
        </div>
        <div class="category-card">
          <img src="/medicineCabinet/breathing.png" alt="Hô hấp" />
          <h4>Hô hấp</h4>
          <p>Thuốc và sản phẩm cho đường hô hấp, giảm ho, sổ mũi.</p>
        </div>
        <div class="category-card">
          <img src="/medicineCabinet/mom_baby.png" alt="Mẹ & Bé" />
          <h4>Mẹ & Bé</h4>
          <p>Sản phẩm chăm sóc sức khỏe mẹ và bé yêu.</p>
        </div>
        <div class="category-card">
          <img src="/medicineCabinet/vitamin.png" alt="Vitamin & Đề kháng" />
          <h4>Vitamin & Đề kháng</h4>
          <p>Bổ sung vitamin và tăng cường đề kháng cơ thể.</p>
        </div>
      </div>
      <router-link to="/shop" class="view-all-btn">Xem tất cả sản phẩm</router-link>
    </section>

    <!-- Kiến thức y khoa -->
    <section class="blog-preview">
      <h2>Kiến thức y khoa</h2>
      <div class="blog-grid">
        <div v-for="post in latestPosts" :key="post.id" class="blog-card">
          <img class="blog-image" :src="post.image" :alt="post.title" />
          <div class="blog-content">
            <h3>{{ post.title }}</h3>
          </div>
        </div>
      </div>
      <router-link to="/blog" class="view-all-btn">Xem tất cả bài viết</router-link>
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

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
}
</script>