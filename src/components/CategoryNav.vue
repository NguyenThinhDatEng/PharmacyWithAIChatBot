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
        >
          <router-link :to="cat.href" class="category-trigger">
            <span>{{ cat.label }}</span>
            <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.25383 15.7071C5.64435 16.0976 6.27752 16.0976 6.66804 15.7071L12.9609 9.41421L19.2538 15.7071C19.6444 16.0976 20.2775 16.0976 20.668 15.7071C21.0586 15.3166 21.0586 14.6834 20.668 14.2929L13.668 7.29289C13.2775 6.90237 12.6444 6.90237 12.2538 7.29289L5.25383 14.2929C4.86331 14.6834 4.86331 15.3166 5.25383 15.7071Z" fill="currentColor"/>
            </svg>
          </router-link>

          <!-- Dropdown panel -->
          <div class="category-panel" v-show="activeCategory === cat.id">
            <div class="panel-left">
              <ul>
                <li
                  v-for="sub in cat.subcategories"
                  :key="sub.id"
                  :class="{ active: activeSub === sub.id }"
                  @mouseenter="activeSub = sub.id"
                  @mouseleave="activeSub = null"
                >
                  <router-link :to="sub.href" class="sub-link">
                    <img v-if="sub.icon" :src="sub.icon" :alt="sub.label" width="24" height="24" />
                    <i v-else :class="sub.faIcon" class="sub-fa-icon"></i>
                    <span>{{ sub.label }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="panel-right">
              <div class="panel-right-items">
                <router-link
                  v-for="item in cat.featured"
                  :key="item.id"
                  :to="item.href"
                  class="featured-item"
                >
                  <i :class="item.faIcon" class="featured-icon"></i>
                  <span>{{ item.label }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeCategory = ref(null);
const activeSub = ref(null);

const categories = [
  {
    id: 'thuoc',
    label: 'Thuốc & Điều trị',
    href: '/shop',
    subcategories: [
      { id: 's1', label: 'Tiêu hóa', href: '/shop', faIcon: 'fas fa-stomach' },
      { id: 's2', label: 'Hô hấp - Tai mũi họng', href: '/shop', faIcon: 'fas fa-lungs' },
      { id: 's3', label: 'Cơ xương khớp', href: '/shop', faIcon: 'fas fa-bone' },
      { id: 's4', label: 'Mẹ & Bé', href: '/shop', faIcon: 'fas fa-baby' },
      { id: 's5', label: 'Tim mạch - Huyết áp', href: '/shop', faIcon: 'fas fa-heart-pulse' },
      { id: 's6', label: 'Thần kinh - Não bộ', href: '/shop', faIcon: 'fas fa-brain' },
      { id: 's7', label: 'Đường huyết - Tiểu đường', href: '/shop', faIcon: 'fas fa-droplet' },
      { id: 's8', label: 'Gan - Mật', href: '/shop', faIcon: 'fas fa-shield-virus' },
      { id: 's9', label: 'Thận - Tiết niệu', href: '/shop', faIcon: 'fas fa-kidneys' },
      { id: 's10', label: 'Chăm sóc da', href: '/shop', faIcon: 'fas fa-hand-sparkles' },
      { id: 's11', label: 'Mắt - Thị lực', href: '/shop', faIcon: 'fas fa-eye' },
      { id: 's12', label: 'Giảm đau - Hạ sốt', href: '/shop', faIcon: 'fas fa-temperature-low' },
    ],
    featured: [
      { id: 'f1', label: 'Thuốc cảm cúm', href: '/shop', faIcon: 'fas fa-head-side-cough' },
      { id: 'f2', label: 'Kháng sinh', href: '/shop', faIcon: 'fas fa-pills' },
      { id: 'f3', label: 'Thuốc dạ dày', href: '/shop', faIcon: 'fas fa-stomach' },
      { id: 'f4', label: 'Thuốc ho', href: '/shop', faIcon: 'fas fa-lungs-virus' },
      { id: 'f5', label: 'Giảm đau', href: '/shop', faIcon: 'fas fa-hand-holding-medical' },
      { id: 'f6', label: 'Huyết áp', href: '/shop', faIcon: 'fas fa-heart-pulse' },
    ],
  },
  {
    id: 'tpcn',
    label: 'Thực phẩm chức năng',
    href: '/shop',
    subcategories: [
      { id: 'v1', label: 'Vitamin & Khoáng chất', href: '/shop', faIcon: 'fas fa-capsules' },
      { id: 'v2', label: 'Miễn dịch - Đề kháng', href: '/shop', faIcon: 'fas fa-shield-halved' },
      { id: 'v3', label: 'Sinh lý - Nội tiết tố', href: '/shop', faIcon: 'fas fa-person-half-dress' },
      { id: 'v4', label: 'Tiêu hóa & Men vi sinh', href: '/shop', faIcon: 'fas fa-bacteria' },
      { id: 'v5', label: 'Thần kinh não', href: '/shop', faIcon: 'fas fa-brain' },
      { id: 'v6', label: 'Hỗ trợ làm đẹp', href: '/shop', faIcon: 'fas fa-spa' },
      { id: 'v7', label: 'Cơ xương khớp', href: '/shop', faIcon: 'fas fa-bone' },
      { id: 'v8', label: 'Tim mạch - Huyết áp', href: '/shop', faIcon: 'fas fa-heart-pulse' },
      { id: 'v9', label: 'Gan - Mật', href: '/shop', faIcon: 'fas fa-shield-virus' },
      { id: 'v10', label: 'Giảm cân - Kiểm soát cân nặng', href: '/shop', faIcon: 'fas fa-weight-scale' },
      { id: 'v11', label: 'Sữa & Dinh dưỡng', href: '/shop', faIcon: 'fas fa-bottle-droplet' },
    ],
    featured: [
      { id: 'f1', label: 'Vitamin C', href: '/shop', faIcon: 'fas fa-lemon' },
      { id: 'f2', label: 'Omega-3 / Dầu cá', href: '/shop', faIcon: 'fas fa-fish' },
      { id: 'f3', label: 'Canxi & Vitamin D', href: '/shop', faIcon: 'fas fa-bone' },
      { id: 'f4', label: 'Vitamin tổng hợp', href: '/shop', faIcon: 'fas fa-capsules' },
      { id: 'f5', label: 'Kẽm - Magie', href: '/shop', faIcon: 'fas fa-tablets' },
      { id: 'f6', label: 'Men vi sinh', href: '/shop', faIcon: 'fas fa-bacteria' },
    ],
  },
  {
    id: 'cssk',
    label: 'Chăm sóc sức khỏe',
    href: '/shop',
    subcategories: [
      { id: 'c1', label: 'Thiết bị y tế', href: '/shop', faIcon: 'fas fa-stethoscope' },
      { id: 'c2', label: 'Đo huyết áp', href: '/shop', faIcon: 'fas fa-heart-pulse' },
      { id: 'c3', label: 'Đo đường huyết', href: '/shop', faIcon: 'fas fa-droplet' },
      { id: 'c4', label: 'Khẩu trang & Bảo hộ', href: '/shop', faIcon: 'fas fa-mask-face' },
      { id: 'c5', label: 'Băng gạc - Cầm máu', href: '/shop', faIcon: 'fas fa-bandage' },
      { id: 'c6', label: 'Chăm sóc mắt', href: '/shop', faIcon: 'fas fa-eye' },
      { id: 'c7', label: 'Chăm sóc tai mũi họng', href: '/shop', faIcon: 'fas fa-ear' },
      { id: 'c8', label: 'Test nhanh', href: '/shop', faIcon: 'fas fa-vial-virus' },
    ],
    featured: [
      { id: 'f1', label: 'Nhiệt kế', href: '/shop', faIcon: 'fas fa-thermometer' },
      { id: 'f2', label: 'Máy đo huyết áp', href: '/shop', faIcon: 'fas fa-heart-pulse' },
      { id: 'f3', label: 'Test COVID', href: '/shop', faIcon: 'fas fa-vial-virus' },
      { id: 'f4', label: 'Khẩu trang y tế', href: '/shop', faIcon: 'fas fa-mask-face' },
      { id: 'f5', label: 'Băng cá nhân', href: '/shop', faIcon: 'fas fa-bandage' },
      { id: 'f6', label: 'Nước muối sinh lý', href: '/shop', faIcon: 'fas fa-bottle-water' },
    ],
  },
  {
    id: 'mebi',
    label: 'Mẹ & Bé',
    href: '/shop',
    subcategories: [
      { id: 'm1', label: 'Sữa công thức', href: '/shop', faIcon: 'fas fa-bottle-baby' },
      { id: 'm2', label: 'Vitamin cho bé', href: '/shop', faIcon: 'fas fa-capsules' },
      { id: 'm3', label: 'Sản phẩm cho mẹ bầu', href: '/shop', faIcon: 'fas fa-person-pregnant' },
      { id: 'm4', label: 'Chăm sóc da bé', href: '/shop', faIcon: 'fas fa-baby' },
      { id: 'm5', label: 'Tã & Vệ sinh', href: '/shop', faIcon: 'fas fa-soap' },
    ],
    featured: [
      { id: 'f1', label: 'Sữa cho bé 0-6 tháng', href: '/shop', faIcon: 'fas fa-bottle-baby' },
      { id: 'f2', label: 'Acid Folic cho mẹ bầu', href: '/shop', faIcon: 'fas fa-person-pregnant' },
      { id: 'f3', label: 'Canxi cho bé', href: '/shop', faIcon: 'fas fa-bone' },
      { id: 'f4', label: 'Phấn rôm - Kem dưỡng', href: '/shop', faIcon: 'fas fa-baby' },
    ],
  },
  {
    id: 'blog',
    label: 'Kiến thức y khoa',
    href: '/blog',
    subcategories: [
      { id: 'b1', label: 'Sức khỏe tổng quát', href: '/blog', faIcon: 'fas fa-notes-medical' },
      { id: 'b2', label: 'Dinh dưỡng & Ăn uống', href: '/blog', faIcon: 'fas fa-utensils' },
      { id: 'b3', label: 'Bệnh thường gặp', href: '/blog', faIcon: 'fas fa-virus' },
      { id: 'b4', label: 'Thuốc & Cách dùng', href: '/blog', faIcon: 'fas fa-pills' },
      { id: 'b5', label: 'Sức khỏe mẹ & bé', href: '/blog', faIcon: 'fas fa-baby' },
    ],
    featured: [
      { id: 'f1', label: 'Cảm cúm mùa', href: '/blog', faIcon: 'fas fa-head-side-cough' },
      { id: 'f2', label: 'Tiểu đường type 2', href: '/blog', faIcon: 'fas fa-droplet' },
      { id: 'f3', label: 'Huyết áp cao', href: '/blog', faIcon: 'fas fa-heart-pulse' },
      { id: 'f4', label: 'Xem tất cả', href: '/blog', faIcon: 'fas fa-arrow-right' },
    ],
  },
];
</script>

<style scoped>
.category-nav {
  background: var(--bg-white);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 73px;
  z-index: 900;
  box-shadow: var(--shadow-sm);
}

.category-nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.category-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0;
}

/* Each top-level item */
.category-item {
  position: static;
  flex-shrink: 0;
}

.category-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-heading);
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s ease, box-shadow 0.2s ease;
  border-bottom: 2px solid transparent;
}

.category-trigger svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  transition: transform 0.2s ease, color 0.2s ease;
  transform: rotate(180deg);
}

.category-item:hover .category-trigger {
  color: var(--primary);
  box-shadow: inset 0 -2px 0 0 var(--primary);
}

.category-item:hover .category-trigger svg {
  transform: rotate(0deg);
  color: var(--primary);
}

/* Dropdown panel */
.category-panel {
  position: fixed;
  left: 0;
  right: 0;
  top: calc(73px + 45px); /* header + category-nav height */
  background: var(--bg-white);
  border-radius: 0 0 16px 16px;
  box-shadow: 0 8px 32px rgba(2, 11, 39, 0.15);
  display: flex;
  z-index: 800;
  max-width: 1280px;
  margin: 0 auto;
  overflow: hidden;
}

/* Left panel - subcategories */
.panel-left {
  width: 280px;
  flex-shrink: 0;
  background: var(--bg-white);
  border-right: 1px solid var(--border-light);
  max-height: 480px;
  overflow-y: auto;
}

.panel-left ul {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.panel-left li {
  padding: 0;
}

.panel-left li.active > .sub-link {
  background: var(--bg-subtle);
  color: var(--primary);
}

.sub-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.15s ease;
}

.sub-link:hover {
  background: var(--bg-subtle);
  color: var(--primary);
}

.sub-link img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.sub-fa-icon {
  width: 24px;
  text-align: center;
  color: var(--primary);
  font-size: 0.875rem;
  flex-shrink: 0;
}

/* Right panel - featured items */
.panel-right {
  flex: 1;
  background: var(--bg-subtle);
  padding: 20px;
  max-height: 480px;
  overflow-y: auto;
}

.panel-right-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.featured-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid var(--border-light);
}

.featured-item:hover {
  box-shadow: 0 0 0 2px var(--primary);
  transform: translateY(-1px);
}

.featured-icon {
  font-size: 1.25rem;
  color: var(--primary);
  width: 32px;
  height: 32px;
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.featured-item span {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-heading);
  line-height: 1.3;
}

/* Mobile: hide category nav */
@media (max-width: 768px) {
  .category-nav {
    display: none;
  }
}
</style>
