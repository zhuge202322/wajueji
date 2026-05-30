import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  PackageCheck
} from "lucide-react";
import { getSiteProductDetail } from "@/lib/content";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getSiteProductDetail(slug);

  if (!product) {
    return {
      title: "Product Not Found | Maredigger"
    };
  }

  return {
    title: `${product.name} | Maredigger`,
    description:
      product.specs.join(", ") ||
      `Details, specifications and export inquiry information for ${product.name}.`
  };
}

export default async function ProductDetailPage({
  params
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getSiteProductDetail(slug);

  if (!product) notFound();

  const mainImage = product.images[0]?.src || product.image;

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <Link className="product-detail__back" href="/products">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Products
          </Link>
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          {product.shortDescriptionHtml ? (
            <div
              className="product-detail__lead"
              dangerouslySetInnerHTML={{ __html: product.shortDescriptionHtml }}
            />
          ) : (
            <p>
              Product details and export quotation information for global B2B
              buyers.
            </p>
          )}
        </div>
      </section>

      <section className="section product-detail">
        <div className="container product-detail__layout">
          <div className="product-detail__media">
            <div className="product-detail__main-image">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(min-width: 960px) 52vw, 100vw"
                priority
              />
              <span>{product.badge}</span>
            </div>
            {product.images.length > 1 && (
              <div className="product-detail__thumbs">
                {product.images.slice(0, 6).map((image) => (
                  <div className="product-detail__thumb" key={image.src}>
                    <Image
                      src={image.src}
                      alt={image.alt || product.name}
                      fill
                      sizes="120px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="product-detail__summary">
            <div>
              <span>Category</span>
              <strong>{product.category}</strong>
            </div>
            <div>
              <span>Export Support</span>
              <strong>Model check, packing and quotation</strong>
            </div>
            <ul>
              {product.specs.map((spec) => (
                <li key={spec}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  {spec}
                </li>
              ))}
            </ul>
            <Link className="product-detail__cta" href="/contact-us">
              Get Best Price
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section section--muted product-detail-content">
        <div className="container product-detail-content__grid">
          <div className="product-detail-content__main">
            <RichSection
              title="Product Details"
              html={product.descriptionHtml}
              fallback="Send product model, jobsite condition or target port for details and availability."
            />
            <RichSection
              title="Specifications & Packaging"
              html={product.specsHtml}
              fallback={product.specs.join(". ")}
            />
            <RichSection
              title="Documents & Certificates"
              html={product.formulaHtml}
              fallback="MSDS, COA, inspection or packing documents can be prepared according to order requirements."
            />
          </div>

          <aside className="product-detail-content__side">
            {(product.specsPdf || product.formulaPdf) && (
              <div className="product-detail-card">
                <h2>Downloads</h2>
                {product.specsPdf && (
                  <DownloadLink href={product.specsPdf} label="Specifications PDF" />
                )}
                {product.formulaPdf && (
                  <DownloadLink href={product.formulaPdf} label="Document PDF" />
                )}
              </div>
            )}

            {product.skus.length > 0 && (
              <div className="product-detail-card">
                <h2>Available Variants</h2>
                <div className="product-detail-skus">
                  {product.skus.map((sku) => (
                    <div className="product-detail-sku" key={sku.id}>
                      <div className="product-detail-sku__image">
                        {sku.image ? (
                          <Image
                            src={sku.image}
                            alt={sku.name}
                            fill
                            sizes="80px"
                          />
                        ) : (
                          <PackageCheck size={22} aria-hidden="true" />
                        )}
                      </div>
                      <div>
                        <strong>{sku.name}</strong>
                        {sku.size && <span>{sku.size}</span>}
                        {sku.price && <em>{sku.price}</em>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="product-detail-card">
              <h2>Inquiry Checklist</h2>
              <ul>
                <li>Machine model or part number</li>
                <li>Quantity and target delivery port</li>
                <li>Photos, dimensions or working condition</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function RichSection({
  title,
  html,
  fallback
}: {
  title: string;
  html: string;
  fallback: string;
}) {
  return (
    <article className="product-detail-rich">
      <h2>{title}</h2>
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p>{fallback}</p>
      )}
    </article>
  );
}

function DownloadLink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="product-detail-download" href={href} target="_blank">
      <FileText size={17} aria-hidden="true" />
      {label}
      <Download size={15} aria-hidden="true" />
    </Link>
  );
}
