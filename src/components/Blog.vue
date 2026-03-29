<template>
  <div class="panel">
    <h2>KIẾN THỨC Y KHOA</h2>
    <div class="blog-grid">
      <div v-for="post in blogs" :key="post.id" class="blog-card">
        <img :src="post.image" alt="Blog Image" class="blog-image" />
        <div class="blog-content">
          <h3>{{ post.title }}</h3>
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
  blogs.value = blogPosts;
}

onMounted(loadBlogs);
</script>