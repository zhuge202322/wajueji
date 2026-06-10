import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { CooperativePartner } from "@/components/CooperativePartner";
import { HomeHeroCarousel } from "@/components/HomeHeroCarousel";
import {
  company,
  stats,
  strengths,
  serviceHighlights
} from "@/lib/site-data";
import { getSiteFeaturedProducts, getSiteNews } from "@/lib/content";

export const dynamic = "force-dynamic";

const productSeries = [
  {
    name: "Excavator",
    image: "https://lingjuimg.com/wp-content/uploads/YUYI/2025/12/home_products_serices_test1.webp",
    href: "/products?category=excavator",
    featured: true
  },
  {
    name: "Roller",
    image: "https://lingjuimg.com/wp-content/uploads/YUYI/2026/01/used-roller-category@1x-1.webp",
    href: "/products?category=roller"
  },
  {
    name: "Loader",
    image: "https://lingjuimg.com/wp-content/uploads/YUYI/2025/12/home_products_serices_test2.webp",
    href: "/products?category=loader"
  },
  {
    name: "Bulldozer",
    image: "https://lingjuimg.com/wp-content/uploads/YUYI/2025/12/home_products_serices_test4.webp",
    href: "/products?category=bulldozer"
  },
  {
    name: "Grader",
    image: "https://lingjuimg.com/wp-content/uploads/YUYI/2025/12/home_products_serices_test3.webp",
    href: "/products?category=grader"
  },
  {
    name: "Forklift",
    image: "https://lingjuimg.com/wp-content/uploads/YUYI/2026/01/%E5%9B%BE%E5%B1%82-0@1x-1.webp",
    href: "/products?category=forklift"
  },
  {
    name: "Crane",
    image: "https://lingjuimg.com/wp-content/uploads/YUYI/2025/12/home_products_serices_test7.webp",
    href: "/products?category=crane"
  }
];

const newsImages = [
  "/images/crawler-excavator.jpg",
  "/images/hero-excavator.jpg",
  "/images/excavator-bucket.jpg"
];

export default async function Home() {
  const [customerProducts, news] = await Promise.all([
    getSiteFeaturedProducts(4),
    getSiteNews()
  ]);
  const advantageItems = [...strengths, ...serviceHighlights].slice(0, 5);

  return (
    <>
      <HomeHeroCarousel />

      <section className="yuyi-section products-series">
        <div className="container">
          <YuyiSectionHeading
            title="Products"
            highlight="Series"
            text="New excavators, used excavators, second-hand excavators and excavator spare parts are organized for quick B2B sourcing."
            href="/products"
          />
          <div className="series-layout">
            <Link className="series-card series-card--featured" href={productSeries[0].href}>
              <span className="series-card__title">{productSeries[0].name}</span>
              <Image
                src={productSeries[0].image}
                alt={productSeries[0].name}
                fill
                sizes="(min-width: 1000px) 30vw, 100vw"
              />
            </Link>
            <div className="series-grid">
              {productSeries.slice(1).map((item) => (
                <Link className="series-card" href={item.href} key={item.name}>
                  <span className="series-card__title">{item.name}</span>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1000px) 22vw, 100vw"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="second-hand-strip container">
        <div className="second-hand-strip__inner">
          <div>
            <h2>Second Hand Machinery Supplier</h2>
            <p>We have different categories of products to meet all your needs.</p>
          </div>
          <YuYiButton href="/contact-us">Contact Us</YuYiButton>
        </div>
      </section>

      <section className="customers-like">
        <div className="container">
          <YuyiCenteredHeading
            title="Customers"
            highlight="Like"
            text="Our team supports buyers before, during and after the order, from machine confirmation to export packing."
            href="/products"
          />
          <div className="customers-grid">
            {customerProducts.map((product) => (
              <article className="customer-card" key={product.slug}>
                <Link className="customer-card__media" href={`/products/${product.slug}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1000px) 25vw, 100vw"
                  />
                </Link>
                <h3>
                  <Link href={`/products/${product.slug}`}>{product.name}</Link>
                </h3>
                <div className="customer-card__meta">
                  <p>
                    Price:<strong> {product.price || "Contact for quote"}</strong>
                  </p>
                  <p>
                    Min Order:<strong> {product.minOrder || "1 Unit"}</strong>
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="slider-dots" aria-hidden="true">
            <span className="is-active" />
            <span />
            <span />
          </div>
        </div>
      </section>

      <CooperativePartner />

      <section className="about-yuyi">
        <div className="container">
          <YuyiCenteredHeading
            title="About"
            highlight={company.name}
            text={company.intro}
          />
          <div className="about-overlap">
            <div className="about-overlap__image">
              <Image
                src="/images/crawler-excavator.jpg"
                alt="Maredigger machinery export"
                fill
                sizes="(min-width: 900px) 58vw, 100vw"
              />
              <div className="about-play" aria-hidden="true" />
            </div>
            <div className="about-overlap__panel">
              <Image
                className="about-overlap__watermark"
                src="/logo.png"
                alt=""
                width={220}
                height={110}
              />
              <h2>{company.name}</h2>
              <p>{company.intro}</p>
              <ul>
                {stats.slice(0, 3).map((item) => (
                  <li key={item.label}>
                    <strong>{item.value.replace("+", "")}</strong>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
              <YuYiButton href="/about-us">View More</YuYiButton>
            </div>
          </div>
        </div>
      </section>

      <section className="our-advantages">
        <div className="our-advantages__bg">
          <Image src="/images/hero-excavator.jpg" alt="" fill sizes="100vw" />
        </div>
        <div className="container">
          <YuyiCenteredHeading
            title="Our"
            highlight="Advantages"
            text="Reliable supply, practical technical confirmation and export service for machinery buyers around the world."
            href="/about-us"
          />
          <div className="advantages-board">
            {advantageItems.map((item) => {
              const Icon = item.icon;
              return (
                <article className="advantage-item" key={item.title}>
                  <div>
                    <Icon size={46} aria-hidden="true" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="follow-news">
        <div className="container">
          <YuyiSectionHeading
            title="Follow Our"
            highlight="News"
            text="Company news and industry news"
            href="/news"
          />
          <div className="follow-news__grid">
            {news.slice(0, 3).map((item, index) => (
              <article className="follow-news-card" key={item.title}>
                <div className="follow-news-card__media">
                  <Image
                    src={newsImages[index % newsImages.length]}
                    alt={item.title}
                    fill
                    sizes="(min-width: 900px) 33vw, 100vw"
                  />
                </div>
                <div className="follow-news-card__body">
                  <time dateTime={item.date}>{item.date}</time>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <Link href="/news">
                    <span>View More</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function YuYiButton({
  children,
  href
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link className="yuyi-button" href={href}>
      <span>{children}</span>
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}

function YuyiSectionHeading({
  title,
  highlight,
  text,
  href,
  actionText = "View More"
}: {
  title: string;
  highlight: string;
  text: string;
  href?: string;
  actionText?: string;
}) {
  return (
    <div className="yuyi-heading yuyi-heading--split">
      <div>
        <h2>
          {title} <span>{highlight}</span>
        </h2>
        <p>{text}</p>
      </div>
      {href && <YuYiButton href={href}>{actionText}</YuYiButton>}
    </div>
  );
}

function YuyiCenteredHeading({
  title,
  highlight,
  text,
  href,
  actionText = "View More",
  linkOnly
}: {
  title: string;
  highlight: string;
  text: string;
  href?: string;
  actionText?: string;
  linkOnly?: boolean;
}) {
  return (
    <div className="yuyi-heading yuyi-heading--center">
      <h2>
        {title} <span>{highlight}</span>
      </h2>
      <p>{text}</p>
      {href &&
        (linkOnly ? (
          <Link className="yuyi-text-link" href={href}>
            {actionText}
          </Link>
        ) : (
          <YuYiButton href={href}>{actionText}</YuYiButton>
        ))}
    </div>
  );
}
