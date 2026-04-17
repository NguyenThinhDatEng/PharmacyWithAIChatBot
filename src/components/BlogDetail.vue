<template>
  <div class="blog-detail-page">
    <div v-if="blog" class="blog-detail-content">
      <nav class="breadcrumb">
        <router-link to="/">Trang chủ</router-link>
        <i class="fas fa-chevron-right"></i>
        <router-link to="/blog">Kiến thức y khoa</router-link>
        <i class="fas fa-chevron-right"></i>
        <span>{{ blog.title }}</span>
      </nav>

      <h1>{{ blog.title }}</h1>
      <img :src="blog.image" :alt="blog.title" class="blog-detail-image" />
      <div class="blog-body" v-html="blog.content"></div>
    </div>

    <div v-else class="not-found">
      <div class="not-found-icon">
        <i class="fas fa-file-medical-alt"></i>
      </div>
      <h2>Bài viết không tồn tại</h2>
    </div>

    <router-link to="/blog" class="back-btn">
      <i class="fas fa-arrow-left"></i> Quay lại Kiến thức y khoa
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import blogPosts from '../data/blogPosts.json';

const route = useRoute();
const blog = ref(null);

onMounted(() => {
  blog.value = blogPosts.find(p => p.id === Number(route.params.id));
});
</script>

<style scoped>
.blog-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 0.875rem;
}

.breadcrumb a {
  color: var(--text-muted);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--primary);
}

.breadcrumb i {
  font-size: 0.625rem;
  color: var(--text-muted);
}

.breadcrumb span {
  color: var(--text-heading);
  font-weight: 500;
}

.blog-detail-content h1 {
  margin-bottom: 24px;
  line-height: 1.3;
}

.blog-detail-image {
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  margin-bottom: 32px;
  box-shadow: var(--shadow-md);
}

.blog-body :deep(p) {
  line-height: 1.8;
  color: var(--text-secondary);
  font-size: 1.0625rem;
  margin-bottom: 1.25rem;
}

.blog-body :deep(h2) {
  font-size: 1.375rem;
  color: var(--text-heading);
  margin: 2rem 0 0.75rem;
  line-height: 1.4;
}

.blog-body :deep(h3) {
  font-size: 1.125rem;
  color: var(--text-heading);
  margin: 1.5rem 0 0.5rem;
}

.blog-body :deep(ul),
.blog-body :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.blog-body :deep(li) {
  margin-bottom: 0.4rem;
}

.blog-body :deep(strong) {
  color: var(--text-heading);
}

.not-found {
  text-align: center;
  padding: 64px 24px;
}

.not-found-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.not-found-icon i {
  font-size: 2rem;
  color: var(--text-muted);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  margin-top: 32px;
  padding: 10px 20px;
  border: 2px solid var(--primary);
  border-radius: var(--radius-full);
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--primary);
  color: white;
}
</style>
