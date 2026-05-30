import {
  categories as fallbackCategories,
  news as fallbackNews,
  products as fallbackProducts
} from "@/lib/site-data";
import {
  getCategoriesData,
  getPostsData,
  getProductBySlug,
  getProductsData
} from "@/lib/cms";
import { slugify } from "@/lib/slug";

export type SiteCategory = {
  name: string;
  slug: string;
  count: number;
};

export type SiteProduct = (typeof fallbackProducts)[number] & {
  slug: string;
  categorySlug: string;
  categorySlugs: string[];
  categories: SiteCategory[];
};

type SiteNewsItem = (typeof fallbackNews)[number];

export type SiteProductDetail = SiteProduct & {
  shortDescriptionHtml: string;
  descriptionHtml: string;
  specsHtml: string;
  formulaHtml: string;
  specsPdf?: string | null;
  formulaPdf?: string | null;
  images: {
    src: string;
    alt: string;
  }[];
  skus: {
    id: number;
    name: string;
    image: string;
    images: {
      src: string;
      alt: string;
    }[];
    price: string;
    size: string;
  }[];
};

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
        slug: product.slug || slugify(product.name || fallback.name),
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

export async function getSiteProductDetail(slug: string): Promise<SiteProductDetail | null> {
  try {
    const product = await getProductBySlug(slug, "en");
    if (!product) return getFallbackProductDetail(slug);

    const fallback = fallbackProducts[0];
    const categories = (product.categories || [])
      .map((category: any) => ({
        name: stripHtml(category.name || ""),
        slug: category.slug || slugify(category.name || ""),
        count: 0
      }))
      .filter((category: SiteCategory) => category.name && category.slug);
    const fallbackCategory = {
      name: fallback.category,
      slug: slugify(fallback.category),
      count: 0
    };
    const primaryCategory = categories[0] || fallbackCategory;
    const images = (product.images || [])
      .map((image: any) => ({
        src: image.src || "",
        alt: image.alt || stripHtml(product.name || "")
      }))
      .filter((image: { src: string }) => image.src);
    const specs = compactSpecs(
      product.specs || "",
      product.short_description || "",
      product.description || ""
    );

    return {
      name: stripHtml(product.name || ""),
      slug: product.slug || slug,
      category: primaryCategory.name,
      categorySlug: primaryCategory.slug,
      categorySlugs: categories.length
        ? categories.map((category: SiteCategory) => category.slug)
        : [fallbackCategory.slug],
      categories: categories.length ? categories : [fallbackCategory],
      image: images[0]?.src || fallback.image,
      badge: product.featured ? "Featured" : primaryCategory.name,
      specs: specs.length ? specs : fallback.specs,
      shortDescriptionHtml: product.short_description || "",
      descriptionHtml: product.description || "",
      specsHtml: product.specs || "",
      formulaHtml: product.formula || "",
      specsPdf: product.specsPdf,
      formulaPdf: product.formulaPdf,
      images: images.length
        ? images
        : [{ src: fallback.image, alt: stripHtml(product.name || fallback.name) }],
      skus: (product.skus || []).map((sku: any) => ({
        id: Number(sku.id),
        name: stripHtml(sku.name || ""),
        image: sku.image || sku.images?.[0]?.src || "",
        images: (sku.images || []).map((image: any) => ({
          src: image.src || "",
          alt: image.alt || stripHtml(sku.name || "")
        })),
        price: sku.price || "",
        size: sku.size || ""
      }))
    };
  } catch {
    return getFallbackProductDetail(slug);
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
    const slug = slugify(product.name);

    return {
      ...product,
      slug,
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

function getFallbackProductDetail(slug: string): SiteProductDetail | null {
  const product = getFallbackProducts().find((item) => item.slug === slug);
  if (!product) return null;

  return {
    ...product,
    shortDescriptionHtml: `<p>${product.specs.join(". ")}.</p>`,
    descriptionHtml: `<p>${product.name} is part of the Maredigger export supply range. Send your target model, photos, working conditions or part number for compatibility checking and quotation.</p>`,
    specsHtml: `<ul>${product.specs.map((spec) => `<li>${spec}</li>`).join("")}</ul>`,
    formulaHtml: "",
    specsPdf: null,
    formulaPdf: null,
    images: [{ src: product.image, alt: product.name }],
    skus: []
  };
}
