<template>
  <div class="panel">
    <div class="blog-banner">
      <img src="https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90):format(webp)/de_xuat_kham_suc_khoe_mien_phi_tu_2026_cho_nhieu_nhom_nguoi_1_561ca7b062.png" alt="Kiến thức y khoa banner" class="banner-image" />
    </div>
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