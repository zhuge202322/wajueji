import {
  categories as fallbackCategories,
  news as fallbackNews,
  products as fallbackProducts
} from "@/lib/site-data";
import { getCategoriesData, getPostsData, getProductsData } from "@/lib/cms";
import { slugify } from "@/lib/slug";

export type SiteCategory = {
  name: string;
  slug: string;
  count: number;
};

export type SiteProduct = (typeof fallbackProducts)[number] & {
  categorySlug: string;
  categorySlugs: string[];
  categories: SiteCategory[];
};

type SiteNewsItem = (typeof fallbackNews)[number];

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function compactSpecs(...values: string[]) {
  const lines = values
    .flatMap((value) => stripHtml(value).split(/\n|\.|;|,/))
    .map((value) => value.trim())
    .filter(Boolean);

  return lines.slice(0, 3);
}

export async function getSiteProducts(): Promise<SiteProduct[]> {
  try {
    const cmsProducts = await getProductsData("en");
    if (!cmsProducts.length) return getFallbackProducts();

    return cmsProducts.map((product: any, index: number) => {
      const fallback = fallbackProducts[index % fallbackProducts.length];
      const categories = (product.categories || [])
        .map((category: any) => ({
          name: stripHtml(category.name || ""),
          slug: category.slug || slugify(category.name || "")
        }))
        .filter((category: SiteCategory) => category.name && category.slug);
      const fallbackCategory = {
        name: fallback.category,
        slug: slugify(fallback.category),
        count: 0
      };
      const primaryCategory = categories[0] || fallbackCategory;
      const specs = compactSpecs(
        product.specs || "",
        product.short_description || "",
        product.description || ""
      );

      return {
        name: stripHtml(product.name || fallback.name),
        category: primaryCategory.name,
        categorySlug: primaryCategory.slug,
        categorySlugs: categories.length
          ? categories.map((category: SiteCategory) => category.slug)
          : [fallbackCategory.slug],
        categories: categories.length ? categories : [fallbackCategory],
        image: product.images?.[0]?.src || fallback.image,
        badge: product.featured ? "Featured" : primaryCategory.name,
        specs: specs.length ? specs : fallback.specs
      };
    });
  } catch {
    return getFallbackProducts();
  }
}

export async function getSiteCategories(): Promise<SiteCategory[]> {
  try {
    const cmsCategories = await getCategoriesData("en");
    if (!cmsCategories.length) return getFallbackCategories();

    const total = cmsCategories.reduce(
      (sum: number, category: any) => sum + Number(category.count || 0),
      0
    );

    return [
      { name: "All Products", slug: "", count: total || cmsCategories.length },
      ...cmsCategories.map((category: any) => ({
        name: stripHtml(category.name || ""),
        slug: category.slug || slugify(category.name || ""),
        count: Number(category.count || 0)
      }))
    ];
  } catch {
    return getFallbackCategories();
  }
}

export async function getSiteNews(): Promise<SiteNewsItem[]> {
  try {
    const cmsPosts = await getPostsData(12, "en");
    if (!cmsPosts.length) return fallbackNews;

    return cmsPosts.map((post: any) => ({
      title: stripHtml(post.title?.rendered || ""),
      date: String(post.date || new Date().toISOString()).slice(0, 10),
      category: "News",
      excerpt: stripHtml(post.excerpt?.rendered || post.content?.rendered || "")
    }));
  } catch {
    return fallbackNews;
  }
}

function getFallbackCategories(): SiteCategory[] {
  return fallbackCategories.map((category) => ({
    ...category,
    slug: category.name === "All Products" ? "" : slugify(category.name)
  }));
}

function getFallbackProducts(): SiteProduct[] {
  return fallbackProducts.map((product) => {
    const categorySlug = slugify(product.category);

    return {
      ...product,
      categorySlug,
      categorySlugs: [categorySlug],
      categories: [
        {
          name: product.category,
          slug: categorySlug,
          count: 0
        }
      ]
    };
  });
}
