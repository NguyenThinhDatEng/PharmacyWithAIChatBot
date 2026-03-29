<template>
  <div class="panel">
    <h2>DỊCH VỤ CỦA CHÚNG TÔI</h2>
    <div class="services-grid">
      <div v-for="service in services" :key="service.id" class="service-card">
        <div class="service-icon">{{ service.icon }}</div>
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import servicesData from '../data/services.json';

const services = ref([]);

onMounted(() => {
  services.value = servicesData;
});
</script>