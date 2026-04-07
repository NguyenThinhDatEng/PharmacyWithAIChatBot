<template>
  <div class="panel">
    <div class="contact-header">
      <h2><i class="fas fa-phone-alt"></i> Liên hệ</h2>
      <p class="section-subtitle">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
    </div>

    <div class="contact-grid">
      <div class="contact-card">
        <div class="contact-icon-wrap">
          <i class="fas fa-phone-alt"></i>
        </div>
        <h4>Điện thoại</h4>
        <p>0909 090 090</p>
      </div>
      <div class="contact-card">
        <div class="contact-icon-wrap">
          <i class="fas fa-envelope"></i>
        </div>
        <h4>Email</h4>
        <p>contact@pharmacyai.com</p>
      </div>
      <div class="contact-card">
        <div class="contact-icon-wrap">
          <i class="fab fa-facebook-f"></i>
        </div>
        <h4>Facebook</h4>
        <p><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">facebook.com</a></p>
      </div>
      <div class="contact-card">
        <div class="contact-icon-wrap">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <h4>Địa chỉ</h4>
        <p>Dương Sơn, Tam Sơn, Từ Sơn, Bắc Ninh</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-header {
  text-align: center;
  margin-bottom: 32px;
}

.contact-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.contact-header h2 i {
  color: var(--primary);
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.contact-card {
  text-align: center;
  padding: 32px 20px;
  border-radius: var(--radius-lg);
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  transition: all 0.2s ease;
}

.contact-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.contact-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 1.25rem;
}

.contact-card h4 {
  margin-bottom: 8px;
  color: var(--text-heading);
}

.contact-card p {
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

.contact-card a {
  color: var(--primary);
  font-weight: 500;
}

.contact-card a:hover {
  color: var(--primary-dark);
}
</style>
