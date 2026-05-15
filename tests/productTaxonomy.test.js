import test from 'node:test';
import assert from 'node:assert/strict';

import productsData from '../src/data/products.json' with { type: 'json' };
import {
  SHOP_CATEGORIES,
  buildShopHref,
  enrichProductsWithSubcategory,
  filterProducts,
} from '../src/utils/productTaxonomy.js';

test('buildShopHref includes category and subcategory query params', () => {
  assert.equal(
    buildShopHref('Hô hấp', 'Viêm mũi dị ứng'),
    '/shop?category=H%C3%B4%20h%E1%BA%A5p&subcategory=Vi%C3%AAm%20m%C5%A9i%20d%E1%BB%8B%20%E1%BB%A9ng',
  );
});

test('enrichProductsWithSubcategory assigns expected subcategories', () => {
  const enriched = enrichProductsWithSubcategory(productsData);

  assert.equal(
    enriched.find((product) => product.productId === '00049347')?.subcategory,
    'Lợi khuẩn đường ruột',
  );
  assert.equal(
    enriched.find((product) => product.productId === '00041206')?.subcategory,
    'Viêm mũi dị ứng',
  );
});

test('filterProducts narrows by category and subcategory', () => {
  const enriched = enrichProductsWithSubcategory(productsData);
  const filtered = filterProducts(enriched, {
    category: 'Hô hấp',
    subcategory: 'Viêm mũi dị ứng',
  });

  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((product) => product.category === 'Hô hấp'));
  assert.ok(filtered.every((product) => product.subcategory === 'Viêm mũi dị ứng'));
});

test('shop categories stay aligned with primary menu categories', () => {
  assert.deepEqual(SHOP_CATEGORIES, [
    'Tất cả',
    'Thực phẩm chức năng',
    'Tiêu hóa',
    'Hô hấp',
    'Khớp xương',
    'Mẹ & Bé',
    'Chăm sóc da',
    'Đề kháng',
  ]);
});
