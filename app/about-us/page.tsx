import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { company, serviceHighlights, stats, strengths } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About us | Maredigger",
  description:
    "Learn about Maredigger, a China excavator supplier and excavator spare parts exporter serving global B2B customers."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__split">
          <div>
            <p className="eyebrow">About us</p>
            <h1>Maredigger builds practical supply routes for excavator buyers</h1>
            <p>{company.intro}</p>
          </div>
          <div className="page-hero__image">
            <Image
              src="/images/crawler-excavator.jpg"
              alt="Crawler excavator prepared for machinery export"
              fill
              sizes="(min-width: 960px) 40vw, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="stat-band stat-band--light">
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
        <div className="container split-layout">
          <div>
            <p className="eyebrow">What we supply</p>
            <h2>Machines, parts and export support in one conversation</h2>
            <p>
              The company focuses on excavators and excavator parts, including
              hydraulic parts, engine parts, undercarriage parts, buckets,
              tracks, filters, pumps and cylinders. Buyers can combine machine
              sourcing with spare parts procurement to save communication time.
            </p>
            <Link className="inline-action" href="/products">
              View Product Range
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

      <section className="section section--muted">
        <div className="container service-grid">
          {serviceHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article className="service-item" key={item.title}>
                <Icon size={26} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
