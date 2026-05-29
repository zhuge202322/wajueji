import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import { categories, products } from "@/lib/site-data";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Products | Maredigger",
  description:
    "Browse Maredigger excavators, second-hand excavators, buckets, hydraulic parts, engine parts and undercarriage spare parts."
};

export default function ProductsPage() {
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
                  <Link href="/products">
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
                <h2>Recommended supply list</h2>
                <p>Updated product scope for excavator and parts buyers.</p>
              </div>
              <form>
                <Search size={16} aria-hidden="true" />
                <input aria-label="Search catalog" placeholder="Search model or part" />
              </form>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard product={product} key={product.name} />
              ))}
            </div>
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
