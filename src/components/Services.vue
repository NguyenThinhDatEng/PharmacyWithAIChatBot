<template>
  <div class="panel">
    <div class="services-header">
      <h2><i class="fas fa-hand-holding-medical"></i> Dịch vụ của chúng tôi</h2>
      <p class="section-subtitle">Chăm sóc sức khỏe toàn diện cho gia đình bạn</p>
    </div>
    <div class="services-grid">
      <div v-for="service in services" :key="service.id" class="service-card">
        <div class="service-icon-wrap">
          <i :class="getIcon(service.icon)"></i>
        </div>
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

const iconMap = {
  '💊': 'fas fa-capsules',
  '🔍': 'fas fa-search',
  '🚚': 'fas fa-truck',
  '🤖': 'fas fa-robot',
  '🏥': 'fas fa-hospital',
  '❤️': 'fas fa-heart',
  '📚': 'fas fa-book-medical',
  '💉': 'fas fa-syringe',
  '🩺': 'fas fa-stethoscope',
  '👨‍⚕️': 'fas fa-user-md',
  '📋': 'fas fa-clipboard-list',
  '🧪': 'fas fa-flask',
};

function getIcon(emoji) {
  return iconMap[emoji] || 'fas fa-medkit';
}

onMounted(() => {
  services.value = servicesData;
});
</script>

<style scoped>
.services-header {
  text-align: center;
  margin-bottom: 8px;
}

.services-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.services-header h2 i {
  color: var(--primary);
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 8px;
}

.service-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--bg-subtle), var(--bg-muted));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.service-icon-wrap i {
  font-size: 1.75rem;
  color: var(--primary);
}
</style>
