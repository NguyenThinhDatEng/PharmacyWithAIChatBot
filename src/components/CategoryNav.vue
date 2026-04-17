<template>
  <div class="category-nav">
    <div class="category-nav-inner">
      <ul class="category-list">
        <li
          v-for="cat in categories"
          :key="cat.id"
          class="category-item"
          @mouseenter="activeCategory = cat.id"
          @mouseleave="activeCategory = null"
          :class="{ 'is-active': activeCategory === cat.id }"
        >
          <router-link :to="cat.href" class="category-trigger">
            <i :class="cat.faIcon" class="cat-icon"></i>
            <span>{{ cat.label }}</span>
            <svg class="cat-chevron" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.25383 15.7071C5.64435 16.0976 6.27752 16.0976 6.66804 15.7071L12.9609 9.41421L19.2538 15.7071C19.6444 16.0976 20.2775 16.0976 20.668 15.7071C21.0586 15.3166 21.0586 14.6834 20.668 14.2929L13.668 7.29289C13.2775 6.90237 12.6444 6.90237 12.2538 7.29289L5.25383 14.2929C4.86331 14.6834 4.86331 15.3166 5.25383 15.7071Z" fill="currentColor"/>
            </svg>
          </router-link>

          <!-- Dropdown panel -->
          <Transition name="dropdown">
            <div class="category-panel" v-if="activeCategory === cat.id">
              <!-- Backdrop -->
              <div class="panel-backdrop"></div>
              <div class="panel-body">
                <!-- Left: subcategories -->
                <div class="panel-left">
                  <p class="panel-section-title">Danh mục</p>
                  <ul>
                    <li v-for="sub in cat.subcategories" :key="sub.id">
                      <router-link :to="sub.href" class="sub-link" :title="sub.fullLabel || sub.label">
                        <span class="sub-icon-wrap">
                          <i :class="sub.faIcon"></i>
                        </span>
                        <span class="sub-label">{{ sub.label }}</span>
                        <i class="fas fa-chevron-right sub-arrow"></i>
                      </router-link>
                    </li>
                  </ul>
                </div>

                <!-- Divider -->
                <div class="panel-divider"></div>

                <!-- Right: featured -->
                <div class="panel-right">
                  <p class="panel-section-title">Phổ biến nhất</p>
                  <div class="panel-right-items">
                    <router-link
                      v-for="item in cat.featured"
                      :key="item.id"
                      :to="item.href"
                      class="featured-item"
                      :title="item.fullLabel || item.label"
                    >
                      <span :class="item.image ? 'featured-thumb-wrap' : 'featured-icon-wrap'">
                        <img
                          v-if="item.image"
                          :src="item.image"
                          :alt="item.fullLabel || item.label"
                          class="featured-thumb"
                          loading="lazy"
                        />
                        <i v-else :class="item.faIcon"></i>
                      </span>
                      <span>{{ item.label }}</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import blogPosts from '../data/blogPosts.json';
import productsData from '../data/products.json';

const activeCategory = ref(null);

const truncateLabel = (text, maxLength = 72) => {
  if (!text || text.length <= maxLength) return text;

  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');

  return `${sliced.slice(0, lastSpace > 0 ? lastSpace : maxLength)}...`;
};

const featuredProductsByCategory = (category, faIcon) =>
  productsData
    .filter(product => product.category === category)
    .slice(0, 6)
    .map(product => ({
      id: `product-${product.productId}`,
      label: truncateLabel(product.name, 62),
      fullLabel: product.name,
      href: `/product/${product.productId}`,
      image: product.image,
      faIcon,
    }));

const productCategories = [
  {
    id: 'thuc-pham-chuc-nang',
    label: 'Thực phẩm chức năng',
    href: '/shop',
    faIcon: 'fas fa-leaf',
    subcategories: [
      { id: 'tpcn-1', label: 'Chống lão hóa', href: '/shop', faIcon: 'fas fa-seedling' },
      { id: 'tpcn-2', label: 'Vitamin tổng hợp', href: '/shop', faIcon: 'fas fa-tablets' },
      { id: 'tpcn-3', label: 'Hỗ trợ đường huyết', href: '/shop', faIcon: 'fas fa-tint' },
      { id: 'tpcn-4', label: 'DHA não bộ & mắt', href: '/shop', faIcon: 'fas fa-brain' },
      { id: 'tpcn-5', label: 'Hồng sâm - sâm', href: '/shop', faIcon: 'fas fa-spa' },
      { id: 'tpcn-6', label: 'Sức khỏe răng miệng', href: '/shop', faIcon: 'fas fa-tooth' },
    ],
  },
  {
    id: 'tieu-hoa',
    label: 'Tiêu hóa',
    href: '/shop',
    faIcon: 'fas fa-stomach',
    subcategories: [
      { id: 'tieu-hoa-1', label: 'Lợi khuẩn đường ruột', href: '/shop', faIcon: 'fas fa-bacteria' },
      { id: 'tieu-hoa-2', label: 'Rối loạn tiêu hóa', href: '/shop', faIcon: 'fas fa-notes-medical' },
      { id: 'tieu-hoa-3', label: 'Enzyme tiêu hóa', href: '/shop', faIcon: 'fas fa-capsules' },
      { id: 'tieu-hoa-4', label: 'Dạ dày - acid dịch vị', href: '/shop', faIcon: 'fas fa-fire' },
      { id: 'tieu-hoa-5', label: 'Viêm đại tràng', href: '/shop', faIcon: 'fas fa-shield-virus' },
    ],
  },
  {
    id: 'ho-hap',
    label: 'Hô hấp',
    href: '/shop',
    subcategories: [
      { id: 'ho-hap-1', label: 'Ho - viêm họng', href: '/shop', faIcon: 'fas fa-head-side-cough' },
      { id: 'ho-hap-2', label: 'Viêm mũi dị ứng', href: '/shop', faIcon: 'fas fa-wind' },
      { id: 'ho-hap-3', label: 'Hô hấp có đờm', href: '/shop', faIcon: 'fas fa-lungs-virus' },
      { id: 'ho-hap-4', label: 'Viên ngậm họng', href: '/shop', faIcon: 'fas fa-tablets' },
      { id: 'ho-hap-5', label: 'Làm sạch đường thở', href: '/shop', faIcon: 'fas fa-lungs' },
    ],
  },
  {
    id: 'khop-xuong',
    label: 'Khớp xương',
    href: '/shop',
    subcategories: [
      { id: 'khop-xuong-1', label: 'Đau nhức vai gáy', href: '/shop', faIcon: 'fas fa-hand-holding-medical' },
      { id: 'khop-xuong-2', label: 'Cơ xương khớp', href: '/shop', faIcon: 'fas fa-bone' },
      { id: 'khop-xuong-3', label: 'Canxi & Vitamin D', href: '/shop', faIcon: 'fas fa-tablets' },
      { id: 'khop-xuong-4', label: 'Thoái hóa khớp gối', href: '/shop', faIcon: 'fas fa-wheelchair' },
      { id: 'khop-xuong-5', label: 'Đau dây thần kinh', href: '/shop', faIcon: 'fas fa-bolt' },
    ],
  },
  {
    id: 'me-be',
    label: 'Mẹ & Bé',
    href: '/shop',
    subcategories: [
      { id: 'me-be-1', label: 'Vitamin cho mẹ bầu', href: '/shop', faIcon: 'fas fa-capsules' },
      { id: 'me-be-2', label: 'Khoáng chất thai kỳ', href: '/shop', faIcon: 'fas fa-tablets' },
      { id: 'me-be-3', label: 'DHA cho mẹ bầu', href: '/shop', faIcon: 'fas fa-heart' },
      { id: 'me-be-4', label: 'Phụ nữ sau sinh', href: '/shop', faIcon: 'fas fa-baby' },
      { id: 'me-be-5', label: 'Vệ sinh cho bé gái', href: '/shop', faIcon: 'fas fa-soap' },
    ],
  },
  {
    id: 'cham-soc-da',
    label: 'Chăm sóc da',
    href: '/shop',
    subcategories: [
      { id: 'cham-soc-da-1', label: 'Cấp ẩm chuyên sâu', href: '/shop', faIcon: 'fas fa-droplet' },
      { id: 'cham-soc-da-2', label: 'Da mụn - nhạy cảm', href: '/shop', faIcon: 'fas fa-spa' },
      { id: 'cham-soc-da-3', label: 'Giảm kích ứng da', href: '/shop', faIcon: 'fas fa-shield-alt' },
      { id: 'cham-soc-da-4', label: 'Làm mềm da', href: '/shop', faIcon: 'fas fa-hand-holding-droplet' },
      { id: 'cham-soc-da-5', label: 'Làm sạch da', href: '/shop', faIcon: 'fas fa-soap' },
    ],
  },
  {
    id: 'de-khang',
    label: 'Đề kháng',
    href: '/shop',
    subcategories: [
      { id: 'de-khang-1', label: 'Vitamin C & B', href: '/shop', faIcon: 'fas fa-lemon' },
      { id: 'de-khang-2', label: 'Suy nhược cơ thể', href: '/shop', faIcon: 'fas fa-bolt' },
      { id: 'de-khang-3', label: 'Canxi cho trẻ', href: '/shop', faIcon: 'fas fa-bone' },
      { id: 'de-khang-4', label: 'Nhiễm khuẩn hô hấp', href: '/shop', faIcon: 'fas fa-lungs' },
      { id: 'de-khang-5', label: 'Dự phòng tái phát', href: '/shop', faIcon: 'fas fa-rotate-left' },
    ],
  },
].map(category => ({
  ...category,
  featured: featuredProductsByCategory(category.label, category.faIcon),
}));

const featuredBlogIds = [1, 3, 10, 12, 22, 24];

const featuredBlogPosts = featuredBlogIds
  .map(id => blogPosts.find(post => post.id === id))
  .filter(Boolean)
  .map(post => ({
    id: `blog-${post.id}`,
    label: truncateLabel(post.title, 62),
    fullLabel: post.title,
    href: `/blog/${post.id}`,
    image: post.image,
    faIcon: 'fas fa-file-medical',
  }));

const categories = [
  ...productCategories,
  {
    id: 'kien-thuc-y-khoa',
    label: 'Kiến thức y khoa',
    href: '/blog',
    subcategories: [
      { id: 'blog-1', label: 'Hen nặng', href: '/blog', faIcon: 'fas fa-lungs' },
      { id: 'blog-2', label: 'Covid-19', href: '/blog', faIcon: 'fas fa-virus' },
      { id: 'blog-3', label: 'Tim mạch', href: '/blog', faIcon: 'fas fa-heart-pulse' },
      { id: 'blog-4', label: 'Khớp xương', href: '/blog', faIcon: 'fas fa-bone' },
      { id: 'blog-5', label: 'Mẹ & Bé', href: '/blog', faIcon: 'fas fa-baby' },
      { id: 'blog-6', label: 'Thuốc & cách dùng', href: '/blog', faIcon: 'fas fa-pills' },
      { id: 'blog-7', label: 'Nội tiết - tuyến giáp', href: '/blog', faIcon: 'fas fa-user-md' },
      { id: 'blog-8', label: 'Giấc ngủ - mệt mỏi', href: '/blog', faIcon: 'fas fa-moon' },
    ],
    featured: featuredBlogPosts,
  },
];
</script>

<style scoped>
/* ── Nav bar ─────────────────────────────────── */
.category-nav {
  background: var(--primary);
  position: sticky;
  top: 73px;
  z-index: 900;
}

.category-nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: center;
  position: relative;
}

.category-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* ── Trigger ─────────────────────────────────── */
.category-item {
  position: static;
  flex-shrink: 0;
}

.category-trigger {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 13px 18px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.18s ease, background 0.18s ease;
  border-bottom: 2px solid transparent;
  position: relative;
  border-radius: 4px 4px 0 0;
}

.cat-icon {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.18s ease;
}

.cat-chevron {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.6);
  transition: transform 0.2s ease, color 0.18s ease;
  transform: rotate(180deg);
  flex-shrink: 0;
}

/* hover state */
.category-item:hover .category-trigger,
.category-item.is-active .category-trigger {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.15);
  border-bottom-color: #ffffff;
}

.category-item:hover .cat-icon,
.category-item.is-active .cat-icon {
  color: #ffffff;
}

.category-item:hover .cat-chevron,
.category-item.is-active .cat-chevron {
  transform: rotate(0deg);
  color: #ffffff;
}

/* ── Dropdown panel ──────────────────────────── */
.category-panel {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 800;
}

.panel-backdrop {
  display: none;
}

.panel-body {
  display: flex;
  background: var(--bg-white);
  border-radius: 0 0 16px 16px;
  box-shadow: 0 12px 40px rgba(2, 11, 39, 0.12);
  overflow: hidden;
  border: 1px solid var(--border-light);
  border-top: none;
}

/* ── Transition ──────────────────────────────── */
.dropdown-enter-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.dropdown-leave-active {
  transition: opacity 0.14s ease, transform 0.12s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Left panel ──────────────────────────────── */
.panel-left {
  width: 256px;
  flex-shrink: 0;
  background: var(--bg-white);
  padding: 16px 0;
  max-height: 460px;
  overflow-y: auto;
}

.panel-section-title {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 0 16px 10px;
  margin: 0;
}

.panel-left ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sub-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
  border-radius: 0;
  position: relative;
}

.sub-link:hover {
  background: rgba(8, 145, 178, 0.06);
  color: var(--primary);
}

.sub-icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.75rem;
  color: var(--primary);
  transition: background 0.15s ease;
}

.sub-link:hover .sub-icon-wrap {
  background: rgba(8, 145, 178, 0.12);
}

.sub-label {
  flex: 1;
}

.sub-arrow {
  font-size: 0.625rem;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.sub-link:hover .sub-arrow {
  opacity: 1;
  color: var(--primary);
}

/* ── Divider ─────────────────────────────────── */
.panel-divider {
  width: 1px;
  background: var(--border-light);
  flex-shrink: 0;
  margin: 16px 0;
}

/* ── Right panel ─────────────────────────────── */
.panel-right {
  flex: 1;
  background: #F8FFFE;
  padding: 16px 20px 20px;
  max-height: 460px;
  overflow-y: auto;
}

.panel-right-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.featured-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-white);
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid var(--border-light);
  transition: all 0.18s ease;
  cursor: pointer;
}

.featured-item:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 12px rgba(8, 145, 178, 0.12);
  transform: translateY(-1px);
}

.featured-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(8,145,178,0.1), rgba(34,211,238,0.12));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1rem;
  color: var(--primary);
}

.featured-thumb-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--bg-white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.featured-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.featured-item:hover .featured-icon-wrap {
  background: linear-gradient(135deg, rgba(8,145,178,0.18), rgba(34,211,238,0.22));
}

.featured-item:hover .featured-thumb-wrap {
  border-color: rgba(8, 145, 178, 0.28);
}

.featured-item span {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-heading);
  line-height: 1.35;
}

.featured-item:hover span {
  color: var(--primary);
}

/* ── Mobile ──────────────────────────────────── */
@media (max-width: 768px) {
  .category-nav {
    display: none;
  }
}
</style>
