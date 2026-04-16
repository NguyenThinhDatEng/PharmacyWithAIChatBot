<template>
  <div class="panel">
    <div class="contact-layout">
      <!-- Cột trái: thông tin liên hệ -->
      <div class="contact-info">
        <div class="contact-header">
          <h2><i class="fas fa-phone-alt"></i> Liên hệ</h2>
          <p class="section-subtitle">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
        </div>

        <ul class="contact-list">
          <li class="contact-item">
            <div class="contact-icon-wrap">
              <i class="fas fa-phone-alt"></i>
            </div>
            <div>
              <h4>Điện thoại</h4>
              <p><a href="tel:0909090090">0909 090 090</a></p>
            </div>
          </li>
          <li class="contact-item">
            <div class="contact-icon-wrap">
              <i class="fas fa-envelope"></i>
            </div>
            <div>
              <h4>Email</h4>
              <p><a href="mailto:contact@pharmacyai.com">contact@pharmacyai.com</a></p>
            </div>
          </li>
          <li class="contact-item">
            <div class="contact-icon-wrap">
              <i class="fab fa-facebook-f"></i>
            </div>
            <div>
              <h4>Facebook</h4>
              <p><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">facebook.com</a></p>
            </div>
          </li>
          <li class="contact-item">
            <div class="contact-icon-wrap">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <h4>Địa chỉ</h4>
              <p>Dương Sơn, Tam Sơn, Từ Sơn, Bắc Ninh</p>
            </div>
          </li>
          <li class="contact-item">
            <div class="contact-icon-wrap">
              <i class="fas fa-clock"></i>
            </div>
            <div>
              <h4>Giờ mở cửa</h4>
              <p>7:00 – 21:00 hàng ngày</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Cột phải: bản đồ -->
      <div class="map-wrapper">
        <iframe
          src="https://maps.google.com/maps?q=21.1436006,105.9599429&z=18&output=embed"
          width="100%"
          height="100%"
          style="border: 0; min-height: 380px;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Vị trí nhà thuốc"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 32px;
  align-items: stretch;
}

/* --- Cột trái --- */
.contact-header {
  margin-bottom: 24px;
}

.contact-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  color: var(--text-heading);
}

.contact-header h2 i {
  color: var(--primary);
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 0.9375rem;
  margin-top: 4px;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  transition: box-shadow 0.2s ease;
}

.contact-item:hover {
  box-shadow: var(--shadow-sm);
}

.contact-icon-wrap {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.contact-item h4 {
  margin: 0 0 4px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.contact-item p {
  margin: 0;
  color: var(--text-heading);
  font-size: 0.9375rem;
  font-weight: 500;
}

.contact-item a {
  color: var(--primary);
  text-decoration: none;
}

.contact-item a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* --- Cột phải --- */
.map-wrapper {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

.map-wrapper iframe {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 380px;
}

/* Mobile */
@media (max-width: 768px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }

  .map-wrapper iframe {
    min-height: 280px;
  }
}
</style>
