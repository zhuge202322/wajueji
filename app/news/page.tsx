import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { news } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "News | Maredigger",
  description:
    "Maredigger news and buying notes for used excavators, excavator spare parts and construction machinery export."
};

export default function NewsPage() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <p className="eyebrow">News</p>
          <h1>Excavator export notes and parts buying guides</h1>
          <p>
            Practical updates for importers comparing used excavators,
            replacement parts and shipment preparation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container news-list">
          {news.map((item) => (
            <article className="news-row" key={item.title}>
              <div>
                <span>{item.category}</span>
                <time dateTime={item.date}>
                  <CalendarDays size={16} aria-hidden="true" />
                  {item.date}
                </time>
              </div>
              <h2>{item.title}</h2>
              <p>{item.excerpt}</p>
              <Link href="/contact-us">
                Ask About This Topic
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
