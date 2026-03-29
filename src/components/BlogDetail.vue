<template>
  <div class="panel">
    <h2>{{ blog ? blog.title : 'Bài viết không tồn tại' }}</h2>
    <div v-if="blog">
      <img :src="blog.image" alt="Blog Image" class="blog-detail-image" />
      <p>{{ blog.content }}</p>
    </div>
    <router-link to="/blog" class="back-btn">Quay lại Kiến thức y khoa</router-link>
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