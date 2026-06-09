import { prisma } from './prisma';
import { formatCategory, formatProduct, formatPost } from './cms-format';
import { getCurrentLocale } from './locale';

export type Locale = 'en' | 'fr' | 'es' | 'ar';

const productSummarySelect = {
  id: true,
  name: true,
  slug: true,
  featured: true,
  sortOrder: true,
  nameFr: true,
  nameEs: true,
  nameAr: true,
  shortDescription: true,
  shortDescriptionFr: true,
  shortDescriptionEs: true,
  shortDescriptionAr: true,
  specs: true,
  specsFr: true,
  specsEs: true,
  specsAr: true,
  images: {
    orderBy: { sortOrder: 'asc' as const },
    take: 1,
    select: {
      id: true,
      src: true,
      alt: true,
    },
  },
  categories: {
    select: {
      id: true,
      name: true,
      slug: true,
      nameFr: true,
      nameEs: true,
      nameAr: true,
    },
  },
  skus: {
    orderBy: { sortOrder: 'asc' as const },
    take: 1,
    select: {
      id: true,
      name: true,
      nameFr: true,
      nameEs: true,
      nameAr: true,
      image: true,
      price: true,
      size: true,
    },
  },
} as const;

async function resolveLocale(locale?: Locale): Promise<Locale> {
  if (locale) return locale;
  return getCurrentLocale();
}

export async function getCategoriesData(locale?: Locale) {
  const loc = await resolveLocale(locale);
  const cats = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { products: true } } },
  });
  return cats.map((c) => formatCategory(c, loc));
}

export async function getProductsData(locale?: Locale) {
  const loc = await resolveLocale(locale);
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    select: productSummarySelect,
  });
  return products.map((p) => formatProduct(p, loc));
}

export async function getProductsPageData({
  categorySlug,
  page = 1,
  pageSize = 6,
  locale,
}: {
  categorySlug?: string;
  page?: number;
  pageSize?: number;
  locale?: Locale;
}) {
  const loc = await resolveLocale(locale);
  const where = categorySlug
    ? { categories: { some: { slug: categorySlug } } }
    : undefined;
  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const products = await prisma.product.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    select: productSummarySelect,
  });

  return {
    products: products.map((p) => formatProduct(p, loc)),
    total,
    currentPage,
    totalPages,
  };
}

export async function getFeaturedProductsData(limit = 8, locale?: Locale) {
  const loc = await resolveLocale(locale);
  // 先找设为热门的
  let products = await prisma.product.findMany({
    where: { featured: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    take: limit,
    select: productSummarySelect,
  });

  // 如果后台一个热门也没设，默认拿前 8 个
  if (products.length === 0) {
    products = await prisma.product.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      take: limit,
      select: productSummarySelect,
    });
  }
  return products.map((p) => formatProduct(p, loc));
}

export async function getProductBySlug(slug: string, locale?: Locale) {
  const loc = await resolveLocale(locale);
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      categories: true,
      skus: { include: { images: { orderBy: { sortOrder: 'asc' } } } },
    },
  });
  return product ? formatProduct(product, loc) : null;
}

export async function getPostsData(limit?: number, locale?: Locale) {
  const loc = await resolveLocale(locale);
  const posts = await prisma.post.findMany({
    orderBy: { date: 'desc' },
    take: limit,
  });
  return posts.map((p) => formatPost(p, loc));
}

export async function getPostBySlug(slug: string, locale?: Locale) {
  const loc = await resolveLocale(locale);
  const post = await prisma.post.findUnique({ where: { slug } });
  return post ? formatPost(post, loc) : null;
}
