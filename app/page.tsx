import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, PhoneCall } from "lucide-react";
import {
  company,
  news,
  processSteps,
  productGroups,
  products,
  stats,
  strengths
} from "@/lib/site-data";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  return (
    <>
      <section className="hero">
        <Image
          className="hero__image"
          src="/images/hero-excavator.jpg"
          alt="Crawler excavator working at an earthwork site"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero__shade" />
        <div className="container hero__content">
          <p className="eyebrow">China excavator export supplier</p>
          <h1>Maredigger</h1>
          <p>
            New excavators, used excavators and excavator spare parts for global
            importers, contractors and machinery dealers.
          </p>
          <div className="hero__actions">
            <Link className="primary-action" href="/products">
              <ArrowRight size={18} aria-hidden="true" />
              View Products
            </Link>
            <Link className="secondary-action" href="/contact-us">
              <PhoneCall size={18} aria-hidden="true" />
              Request Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="stat-band" aria-label="Maredigger quick facts">
        <div className="container stat-grid">
          {stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Recommended products</p>
            <h2>Excavators and parts prepared for B2B export</h2>
            <Link href="/products">
              All Products
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="product-grid product-grid--home">
            {products.slice(0, 4).map((product) => (
              <ProductCard product={product} key={product.name} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container category-grid">
          {productGroups.map((group) => (
            <article className="category-panel" key={group.name}>
              <div>
                <Image src={group.image} alt={group.name} fill sizes="(min-width: 960px) 33vw, 100vw" />
              </div>
              <h3>{group.name}</h3>
              <p>{group.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container split-layout">
          <div>
            <p className="eyebrow">About Maredigger</p>
            <h2>Reliable machinery and spare parts from China</h2>
            <p>{company.intro}</p>
            <Link className="inline-action" href="/about-us">
              Company Profile
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="strength-grid">
            {strengths.map((item) => {
              const Icon = item.icon;
              return (
                <article className="strength-item" key={item.title}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container process">
          <div>
            <p className="eyebrow">Export workflow</p>
            <h2>From inquiry to loading plan</h2>
          </div>
          <ol>
            {processSteps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
          <Link className="primary-action" href="/contact-us">
            <ClipboardCheck size={18} aria-hidden="true" />
            Start Inquiry
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">News</p>
            <h2>Market notes for equipment buyers</h2>
            <Link href="/news">
              More News
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="news-grid">
            {news.map((item) => (
              <article className="news-card" key={item.title}>
                <span>{item.category}</span>
                <time dateTime={item.date}>{item.date}</time>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
