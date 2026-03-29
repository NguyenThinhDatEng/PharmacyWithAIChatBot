<template>
  <div class="home">
    <!-- Banner chính -->
    <section class="hero-banner">
      <div class="banner-content">
        <h1>Người bạn đồng hành sức khỏe gia đình bạn</h1>
        <p>Kết hợp tư vấn tận tâm và công nghệ AI hiện đại cho sức khỏe tối ưu.</p>
        <div class="cta-buttons">
          <router-link to="/shop" class="cta-btn primary">Khám phá tủ thuốc</router-link>
          <router-link to="/chat" class="cta-btn secondary">Chat ngay với Dược sĩ AI</router-link>
        </div>
      </div>
      <div class="banner-image">
        <img src="https://media.loveitopcdn.com/21183/cong-ty-tnhh-kinh-doanh-duoc-thien-thanh-1.jpg" alt="Dược sĩ trao thuốc" />
      </div>
    </section>

    <!-- Tại sao chọn Trương Thị Yến? -->
    <section class="why-choose">
      <h2>Tại sao chọn Trương Thị Yến?</h2>
      <div class="benefits-grid">
        <div class="benefit-item">
          <div class="benefit-icon">💊</div>
          <h3>Dược sĩ tư vấn 24/7</h3>
          <p>Hỗ trợ tư vấn thuốc mọi lúc, nhanh chóng và hiệu quả.</p>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🔍</div>
          <h3>Nguồn gốc thuốc minh bạch</h3>
          <p>Đảm bảo chất lượng và nguồn gốc rõ ràng cho mọi sản phẩm.</p>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🚚</div>
          <h3>Giao hàng nhanh chóng</h3>
          <p>Giao tận nơi, an toàn và tiện lợi trong thời gian ngắn.</p>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🤖</div>
          <h3>Hệ thống AI thông minh</h3>
          <p>Công nghệ AI hỗ trợ tư vấn và theo dõi sức khỏe cá nhân hóa.</p>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🏥</div>
          <h3>Chăm sóc sức khỏe toàn diện</h3>
          <p>Từ phòng ngừa đến điều trị, chúng tôi đồng hành cùng bạn.</p>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">❤️</div>
          <h3>Tận tâm với khách hàng</h3>
          <p>Luôn đặt sức khỏe và sự hài lòng của bạn lên hàng đầu.</p>
        </div>
      </div>
    </section>

    <!-- Tủ thuốc gia đình -->
    <section class="product-categories">
      <h2>Tủ thuốc gia đình</h2>
      <div class="categories-grid">
        <div class="category-card">
          <img src="https://via.placeholder.com/200x150?text=Tiêu+hóa" alt="Tiêu hóa" />
          <h3>Tiêu hóa</h3>
          <p>Các sản phẩm hỗ trợ tiêu hóa, giảm đau bụng, đầy hơi.</p>
        </div>
        <div class="category-card">
          <img src="https://via.placeholder.com/200x150?text=Hô+hấp" alt="Hô hấp" />
          <h3>Hô hấp</h3>
          <p>Thuốc và sản phẩm cho đường hô hấp, giảm ho, sổ mũi.</p>
        </div>
        <div class="category-card">
          <img src="https://via.placeholder.com/200x150?text=Mẹ+&+Bé" alt="Mẹ & Bé" />
          <h3>Mẹ & Bé</h3>
          <p>Sản phẩm chăm sóc sức khỏe mẹ và bé yêu.</p>
        </div>
        <div class="category-card">
          <img src="https://via.placeholder.com/200x150?text=Vitamin+&+Đề+kháng" alt="Vitamin & Đề kháng" />
          <h3>Vitamin & Đề kháng</h3>
          <p>Bổ sung vitamin và tăng cường đề kháng cơ thể.</p>
        </div>
      </div>
      <router-link to="/shop" class="view-all-btn">Xem tất cả sản phẩm</router-link>
    </section>

    <!-- Kiến thức y khoa -->
    <section class="blog-preview">
      <h2>Kiến thức y khoa</h2>
      <div class="blog-grid">
        <div class="blog-card">
          <img src="https://via.placeholder.com/300x200?text=Phòng+ngừa+cảm+cúm" alt="Phòng ngừa cảm cúm" />
          <h3>5 mẹo phòng ngừa cảm cúm cho bé</h3>
          <p>5/5/2023</p>
          <router-link to="/blog/1" class="read-more-btn">Đọc tiếp</router-link>
        </div>
        <div class="blog-card">
          <img src="https://via.placeholder.com/300x200?text=Sử+dụng+kháng+sinh" alt="Sử dụng kháng sinh" />
          <h3>Sử dụng kháng sinh đúng cách</h3>
          <p>11/5/2023</p>
          <router-link to="/blog/2" class="read-more-btn">Đọc tiếp</router-link>
        </div>
        <div class="blog-card">
          <img src="https://via.placeholder.com/300x200?text=Chăm+sóc+người+cao+tuổi" alt="Chăm sóc người cao tuổi" />
          <h3>Chăm sóc sức khỏe người cao tuổi</h3>
          <p>13/5/2023</p>
          <router-link to="/blog/3" class="read-more-btn">Đọc tiếp</router-link>
        </div>
      </div>
      <router-link to="/blog" class="view-all-btn">Xem tất cả bài viết</router-link>
    </section>
  </div>
</template>

<script setup>
// Không cần logic đặc biệt, sử dụng router-link
</script>