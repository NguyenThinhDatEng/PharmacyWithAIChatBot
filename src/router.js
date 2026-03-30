import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Blog from './components/Blog.vue';
import Shop from './components/Shop.vue';
import Services from './components/Services.vue';
import About from './components/About.vue';
import Contact from './components/Contact.vue';
import Prescription from './components/Prescription.vue';
import ProductDetail from './components/ProductDetail.vue';
import BlogDetail from './components/BlogDetail.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/blog', component: Blog },
  { path: '/blog/:id', component: BlogDetail },
  { path: '/shop', component: Shop },
  { path: '/product/:id', component: ProductDetail },
  { path: '/services', component: Services },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/prescription', component: Prescription },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;