import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getSiteCategories, getSiteProducts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products | Maredigger",
  description:
    "Browse Maredigger excavators, second-hand excavators, buckets, hydraulic parts, engine parts and undercarriage spare parts."
};

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const requestedCategory = Array.isArray(params?.category)
    ? params.category[0]
    : params?.category;
  const [categories, products] = await Promise.all([
    getSiteCategories(),
    getSiteProducts()
  ]);
  const activeCategory = categories.some(
    (category) => category.slug && category.slug === requestedCategory
  )
    ? requestedCategory || ""
    : "";
  const activeCategoryName =
    categories.find((category) => category.slug === activeCategory)?.name ||
    "All Products";
  const visibleProducts = activeCategory
    ? products.filter((product) => product.categorySlugs.includes(activeCategory))
    : products;

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <p className="eyebrow">Product center</p>
          <h1>Excavators and spare parts online</h1>
          <p>
            Machines and parts are organized for quick B2B comparison, quotation
            and export packing confirmation.
          </p>
        </div>
      </section>

      <section className="section section--catalog">
        <div className="container catalog-layout">
          <aside className="catalog-sidebar">
            <h2>All Products</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    className={
                      category.slug === activeCategory
                        ? "catalog-sidebar__link catalog-sidebar__link--active"
                        : "catalog-sidebar__link"
                    }
                    href={
                      category.slug
                        ? {
                            pathname: "/products",
                            query: { category: category.slug }
                          }
                        : "/products"
                    }
                  >
                    {category.name}
                    <span>({category.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="catalog-main">
            <div className="catalog-tools">
              <div>
                <h2>{activeCategoryName}</h2>
                <p>
                  {activeCategory
                    ? `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} in this category.`
                    : "Updated product scope for excavator and parts buyers."}
                </p>
              </div>
              <form>
                <Search size={16} aria-hidden="true" />
                <input aria-label="Search catalog" placeholder="Search model or part" />
              </form>
            </div>
            {visibleProducts.length ? (
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard product={product} key={product.name} />
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <h3>No products in this category yet.</h3>
                <p>
                  Send your target model or part number and the export team will
                  confirm availability.
                </p>
              </div>
            )}
            <div className="catalog-note">
              <h3>Need a specific machine or part number?</h3>
              <p>
                Send the brand, model, year, photos or part number. Maredigger
                will confirm compatibility and prepare an export quotation.
              </p>
              <Link className="inline-action" href="/contact-us">
                Send Requirements
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
