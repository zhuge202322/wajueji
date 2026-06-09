import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getSiteCategories, getSiteProductPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products | Maredigger",
  description:
    "Browse Maredigger excavators, second-hand excavators, buckets, hydraulic parts, engine parts and undercarriage spare parts."
};

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
    page?: string | string[];
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const requestedCategory = Array.isArray(params?.category)
    ? params.category[0]
    : params?.category;
  const requestedPage = Array.isArray(params?.page)
    ? params.page[0]
    : params?.page;
  const categories = await getSiteCategories();
  const activeCategory = categories.some(
    (category) => category.slug && category.slug === requestedCategory
  )
    ? requestedCategory || ""
    : "";
  const activeCategoryName =
    categories.find((category) => category.slug === activeCategory)?.name ||
    "All Products";
  const pageSize = 6;
  const parsedPage = Number.parseInt(requestedPage || "1", 10);
  const requestedPageNumber = Number.isFinite(parsedPage) ? parsedPage : 1;
  const productPage = await getSiteProductPage({
    categorySlug: activeCategory || undefined,
    page: requestedPageNumber,
    pageSize
  });
  const { products: pageProducts, total: visibleProductCount, totalPages } = productPage;
  const currentPage = productPage.currentPage;
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, visibleProductCount);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const pageHref = (page: number) => ({
    pathname: "/products",
    query: {
      ...(activeCategory ? { category: activeCategory } : {}),
      ...(page > 1 ? { page } : {})
    }
  });

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
                    ? `${visibleProductCount} product${visibleProductCount === 1 ? "" : "s"} in this category.`
                    : "Updated product scope for excavator and parts buyers."}
                  {visibleProductCount > 0 &&
                    ` Showing ${pageStart + 1}-${pageEnd} of ${visibleProductCount}.`}
                </p>
              </div>
              <form>
                <Search size={16} aria-hidden="true" />
                <input aria-label="Search catalog" placeholder="Search model or part" />
              </form>
            </div>
            {visibleProductCount ? (
              <>
                <div className="product-grid">
                  {pageProducts.map((product) => (
                    <ProductCard product={product} key={product.name} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <nav className="catalog-pagination" aria-label="Product pages">
                    {currentPage > 1 ? (
                      <Link href={pageHref(currentPage - 1)}>
                        <ArrowLeft size={15} aria-hidden="true" />
                        Prev
                      </Link>
                    ) : (
                      <span className="is-disabled">
                        <ArrowLeft size={15} aria-hidden="true" />
                        Prev
                      </span>
                    )}
                    {pageNumbers.map((page) => (
                      <Link
                        className={page === currentPage ? "is-active" : ""}
                        href={pageHref(page)}
                        key={page}
                      >
                        {page}
                      </Link>
                    ))}
                    {currentPage < totalPages ? (
                      <Link href={pageHref(currentPage + 1)}>
                        Next
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    ) : (
                      <span className="is-disabled">
                        Next
                        <ArrowRight size={15} aria-hidden="true" />
                      </span>
                    )}
                  </nav>
                )}
              </>
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
