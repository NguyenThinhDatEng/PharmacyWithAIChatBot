<template>
  <div class="panel">
    <div class="blog-header">
      <h2><i class="fas fa-notes-medical"></i> Kiến thức y khoa</h2>
      <p class="section-subtitle">Cập nhật thông tin sức khỏe hữu ích cho gia đình</p>
    </div>
    <div class="blog-grid">
      <div v-for="post in blogs" :key="post.id" class="blog-card">
        <img :src="post.image" alt="Blog Image" class="blog-image" />
        <div class="blog-content">
          <p class="post-date"><i class="far fa-calendar-alt"></i> {{ formatDate(post.publishedAt) }}</p>
          <h3>{{ post.title }}</h3>
          <p>{{ post.description }}</p>
          <router-link :to="`/blog/${post.id}`" class="read-more-btn">
            Đọc tiếp <i class="fas fa-chevron-right"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import blogPosts from '../data/blogPosts.json';

const blogs = ref([]);

async function loadBlogs() {
  blogs.value = [...blogPosts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

onMounted(loadBlogs);
</script>

<style scoped>
.blog-header {
  text-align: center;
  margin-bottom: 8px;
}

.blog-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.blog-header h2 i {
  color: var(--primary);
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.post-date {
  font-size: 0.8125rem !important;
  color: var(--text-muted) !important;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px !important;
}
</style>
