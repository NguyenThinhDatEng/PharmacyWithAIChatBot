export const SHOP_CATEGORIES = [
  'Tất cả',
  'Thực phẩm chức năng',
  'Tiêu hóa',
  'Hô hấp',
  'Khớp xương',
  'Mẹ & Bé',
  'Chăm sóc da',
  'Đề kháng',
];

const SUBCATEGORY_RULES = {
  'Thực phẩm chức năng': [
    { label: 'Chống lão hóa', keywords: ['chống lão hóa', 'spermidine'] },
    { label: 'Vitamin tổng hợp', keywords: ['daily vitamins', 'vitamin'] },
    { label: 'Hỗ trợ đường huyết', keywords: ['đường huyết', 'blood sugar'] },
    { label: 'DHA não bộ & mắt', keywords: ['dha', 'não bộ', 'mắt'] },
    { label: 'Hồng sâm - sâm', keywords: ['hồng sâm', 'ginseng', 'sâm'] },
    { label: 'Sức khỏe răng miệng', keywords: ['nhiệt miệng', 'tay chân miệng', 'răng miệng'] },
  ],
  'Tiêu hóa': [
    { label: 'Viêm đại tràng', keywords: ['viêm đại tràng', 'colon'] },
    { label: 'Dạ dày - acid dịch vị', keywords: ['acid dịch vị', 'dạ dày'] },
    { label: 'Enzyme tiêu hóa', keywords: ['enzyme', 'men tiêu hoá', 'men tiêu hóa'] },
    { label: 'Lợi khuẩn đường ruột', keywords: ['lợi khuẩn', 'bào tử lợi khuẩn', 'đường ruột'] },
    { label: 'Rối loạn tiêu hóa', keywords: ['rối loạn tiêu hóa', 'khó tiêu', 'đầy bụng', 'chướng bụng'] },
  ],
  'Hô hấp': [
    { label: 'Viêm mũi dị ứng', keywords: ['viêm mũi dị ứng', 'mày đay'] },
    { label: 'Hô hấp có đờm', keywords: ['có đờm', 'chất nhầy'] },
    { label: 'Viên ngậm họng', keywords: ['viên ngậm', 'strepsils', 'miệng, họng', 'đau họng'] },
    { label: 'Làm sạch đường thở', keywords: ['làm sạch đường thở'] },
    { label: 'Ho - viêm họng', keywords: ['viêm họng', 'giảm ho', 'trị ho'] },
  ],
  'Khớp xương': [
    { label: 'Đau nhức vai gáy', keywords: ['vai gáy'] },
    { label: 'Đau dây thần kinh', keywords: ['dây thần kinh'] },
    { label: 'Thoái hóa khớp gối', keywords: ['thoái hóa khớp gối', 'thoái hóa khớp'] },
    { label: 'Canxi & Vitamin D', keywords: ['calci', 'canxi', 'vitamin d', 'd3', 'loãng xương'] },
    { label: 'Cơ xương khớp', keywords: ['cơ xương khớp'] },
  ],
  'Mẹ & Bé': [
    { label: 'Vệ sinh cho bé gái', keywords: ['bé gái', 'vùng kín'] },
    { label: 'Phụ nữ sau sinh', keywords: ['sau sinh', 'sản phụ'] },
    { label: 'DHA cho mẹ bầu', keywords: ['dha'] },
    { label: 'Khoáng chất thai kỳ', keywords: ['khoáng chất'] },
    { label: 'Vitamin cho mẹ bầu', keywords: ['mẹ bầu', 'mang thai', 'phụ nữ có thai', 'chuẩn bị mang thai', 'vitamin'] },
  ],
  'Chăm sóc da': [
    { label: 'Da mụn - nhạy cảm', keywords: ['da mụn', 'nhạy cảm'] },
    { label: 'Giảm kích ứng da', keywords: ['kích ứng', 'mẩn đỏ', 'ngứa', 'dịu da'] },
    { label: 'Làm sạch da', keywords: ['làm sạch da', 'tẩy trang', 'kháng khuẩn'] },
    { label: 'Làm mềm da', keywords: ['làm mềm da', 'mềm da', 'nứt nẻ'] },
    { label: 'Cấp ẩm chuyên sâu', keywords: ['cấp ẩm', 'dưỡng ẩm', 'phục hồi da'] },
  ],
  'Đề kháng': [
    { label: 'Dự phòng tái phát', keywords: ['dự phòng tái phát'] },
    { label: 'Nhiễm khuẩn hô hấp', keywords: ['nhiễm khuẩn hô hấp', 'đường hô hấp', 'broncho-vaxom', 'viêm mũi dị ứng'] },
    { label: 'Canxi cho trẻ', keywords: ['canxi'] },
    { label: 'Suy nhược cơ thể', keywords: ['suy nhược', 'mệt mỏi', 'sút cân', 'chán ăn'] },
    { label: 'Vitamin C & B', keywords: ['vitamin c', 'vitamin b', 'enervon'] },
  ],
};

const CATEGORY_DEFAULT_SUBCATEGORY = Object.fromEntries(
  Object.entries(SUBCATEGORY_RULES).map(([category, rules]) => [category, rules[0]?.label ?? 'Khác']),
);

const searchableText = (product) =>
  [
    product.name,
    product.description,
    product.promotion,
    product.volume,
    product.specifications?.ingredients?.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

export function inferProductSubcategory(product) {
  if (product.subcategory) return product.subcategory;

  const rules = SUBCATEGORY_RULES[product.category];
  if (!rules?.length) return 'Khác';

  const haystack = searchableText(product);
  const matched = rules.find((rule) => rule.keywords.some((keyword) => haystack.includes(keyword.toLowerCase())));

  return matched?.label ?? CATEGORY_DEFAULT_SUBCATEGORY[product.category];
}

export function enrichProductsWithSubcategory(products) {
  return products.map((product) => ({
    ...product,
    subcategory: inferProductSubcategory(product),
  }));
}

export function filterProducts(products, { category = 'Tất cả', subcategory = '', searchTerm = '' } = {}) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    if (category && category !== 'Tất cả' && product.category !== category) return false;
    if (subcategory && product.subcategory !== subcategory) return false;
    if (normalizedSearch && !product.name.toLowerCase().includes(normalizedSearch)) return false;
    return true;
  });
}

export function buildShopHref(category, subcategory = '') {
  const params = [];
  if (category) params.push(`category=${encodeURIComponent(category)}`);
  if (subcategory) params.push(`subcategory=${encodeURIComponent(subcategory)}`);
  return `/shop?${params.join('&')}`;
}
