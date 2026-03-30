<template>
  <div class="panel">
    <h2>KIẾN THỨC Y KHOA</h2>
    <div class="blog-grid">
      <div v-for="post in blogs" :key="post.id" class="blog-card">
        <img :src="post.image" alt="Blog Image" class="blog-image" />
        <div class="blog-content">
          <h3>{{ post.title }}</h3>          
          <p class="post-date">{{ formatDate(post.publishedAt) }}</p>          
          <p>{{ post.description }}</p>
          <router-link :to="`/blog/${post.id}`" class="read-more-btn">Đọc tiếp</router-link>
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

<style>
.post-date {
  color: var(--text-light)
}
</style>