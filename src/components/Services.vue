<template>
  <div class="panel">
    <div class="services-header">
      <h2><i class="fas fa-hand-holding-medical"></i> Dịch vụ</h2>
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
  '💊': 'fas fa-pills',
  '🔍': 'fas fa-magnifying-glass',
  '🚚': 'fas fa-truck-medical',
  '🤖': 'fas fa-laptop-medical',
  '🏥': 'fas fa-house-medical',
  '❤️': 'fas fa-heart-pulse',
  '📚': 'fas fa-book-medical',
  '💉': 'fas fa-syringe',
  '🩺': 'fas fa-stethoscope',
  '👨‍⚕️': 'fas fa-user-nurse',
  '📋': 'fas fa-list-check',
  '🧪': 'fas fa-flask-vial',
  '🩸': 'fas fa-droplet',
  '🍎': 'fas fa-apple-whole',
  '⚙️': 'fas fa-gears',
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
