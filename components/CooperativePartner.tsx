"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const partnerBrands = [
  {
    src: "/reference/yuyi/brand-cat.webp",
    alt: "Caterpillar"
  },
  {
    src: "/reference/yuyi/brand-komatsu.webp",
    alt: "Komatsu"
  },
  {
    src: "/reference/yuyi/brand-hitachi.webp",
    alt: "Hitachi"
  },
  {
    src: "/reference/yuyi/brand-volvo.webp",
    alt: "Volvo"
  },
  {
    src: "/reference/yuyi/brand-sany.webp",
    alt: "Sany"
  },
  {
    src: "/reference/yuyi/brand-xcmg.webp",
    alt: "XCMG"
  },
  {
    src: "/reference/yuyi/brand-doosan.webp",
    alt: "Doosan"
  },
  {
    src: "/reference/yuyi/brand-hyundai.webp",
    alt: "Hyundai"
  },
  {
    src: "/reference/yuyi/brand-kobelco.webp",
    alt: "Kobelco"
  },
  {
    src: "/reference/yuyi/brand-kubota.webp",
    alt: "Kubota"
  }
];

function getPartnerPageSize() {
  if (typeof window === "undefined") {
    return 8;
  }

  if (window.innerWidth <= 425) {
    return 1;
  }

  if (window.innerWidth <= 768) {
    return 2;
  }

  return 8;
}

export function CooperativePartner() {
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [activePage, setActivePage] = useState(0);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  const pageCount = Math.max(1, Math.ceil(partnerBrands.length / itemsPerPage));
  const visibleBrands = useMemo(() => {
    const start = activePage * itemsPerPage;
    return partnerBrands.slice(start, start + itemsPerPage);
  }, [activePage, itemsPerPage]);

  const goToPage = useCallback((index: number) => {
    setActivePage((index + pageCount) % pageCount);
  }, [pageCount]);

  const nextPage = useCallback(() => {
    setActivePage((current) => (current + 1) % pageCount);
  }, [pageCount]);

  useEffect(() => {
    const syncPageSize = () => {
      const nextSize = getPartnerPageSize();
      setItemsPerPage(nextSize);
      setActivePage((current) =>
        Math.min(current, Math.max(0, Math.ceil(partnerBrands.length / nextSize) - 1))
      );
    };

    syncPageSize();
    window.addEventListener("resize", syncPageSize);
    return () => window.removeEventListener("resize", syncPageSize);
  }, []);

  useEffect(() => {
    if (paused || pageCount <= 1) {
      return;
    }

    const timer = window.setInterval(nextPage, 3000);
    return () => window.clearInterval(timer);
  }, [nextPage, pageCount, paused]);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        return;
      }

      gsap.from(".cooperative-partner__earth", {
        autoAlpha: 0,
        x: -54,
        duration: 0.85,
        ease: "power3.out"
      });
      gsap.from(".cooperative-partner__metric", {
        autoAlpha: 0,
        y: 28,
        duration: 0.75,
        ease: "power3.out",
        delay: 0.12
      });
      gsap.to(".cooperative-partner__earth img", {
        y: -10,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
      gsap.fromTo(
        ".cooperative-partner__number",
        { textContent: 0 },
        {
          textContent: 15,
          duration: 1.2,
          ease: "power2.out",
          snap: { textContent: 1 }
        }
      );
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = gsap.utils.toArray<HTMLElement>(".brand-logo-card");

      if (reduceMotion) {
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.48,
          ease: "power2.out",
          stagger: 0.055
        }
      );
    },
    { dependencies: [activePage, itemsPerPage], revertOnUpdate: true, scope: rootRef }
  );

  return (
    <section
      className="cooperative-partner"
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container cooperative-partner__inner">
        <div className="cooperative-partner__top">
          <div className="cooperative-partner__title">
            <h2>
              Cooperative <span>Partner</span>
            </h2>
            <p>
              We have a professional team to provide you with pre-sale, in-sale, and
              after-sale services to solve your worries.
            </p>
          </div>
          <Link className="cooperative-partner__link" href="/contact-us">
            Contact Us Now &gt;&gt;
          </Link>
        </div>

        <div className="cooperative-partner__content">
          <div className="cooperative-partner__earth" aria-hidden="true">
            <Image
              src="/reference/yuyi/partner-earth.webp"
              alt=""
              width={540}
              height={510}
              sizes="(min-width: 900px) 37vw, 100vw"
              unoptimized
            />
          </div>

          <div className="cooperative-partner__right">
            <div className="cooperative-partner__metric">
              <strong className="cooperative-partner__number">15</strong>
              <p>
                <span>Brand Choice</span>
              </p>
            </div>

            <div className="partner-brand-window">
              <div className="brand-board" aria-live="polite">
                {visibleBrands.map((brand) => (
                  <div className="brand-logo-card" key={brand.src}>
                    <span>
                      <Image
                        src={brand.src}
                        alt={brand.alt}
                        fill
                        sizes="(min-width: 900px) 14vw, 46vw"
                        unoptimized
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="line-dots" aria-label="Brand carousel pagination">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  className={activePage === index ? "is-active" : ""}
                  type="button"
                  aria-label={`Show brand page ${index + 1}`}
                  aria-pressed={activePage === index}
                  onClick={() => goToPage(index)}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
