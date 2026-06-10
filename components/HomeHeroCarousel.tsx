"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const heroArrow = "/reference/yuyi/hero-arrow.webp";

const heroSlides = [
  {
    image: "/reference/yuyi/hero-1.webp",
    text: "We Offer A Selection Of High-Quality, Cost-Effective Used Construction Machinery, Making Your Investment More Valuable.",
    align: "center"
  },
  {
    image: "/reference/yuyi/hero-2.webp",
    text: "Professional construction machinery supplier.With over 15 years of experience, our professional export team is at your service.",
    align: "center"
  },
  {
    image: "/reference/yuyi/hero-3.webp",
    text: "We have an inventory of over 3,000 machines for you to choose from. Our professional team ensures all machines undergo rigorous maintenance.",
    align: "left"
  }
] as const;

export function HomeHeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  const goToSlide = useCallback((index: number) => {
    setActive((index + heroSlides.length) % heroSlides.length);
  }, []);

  const nextSlide = useCallback(() => {
    setActive((current) => (current + 1) % heroSlides.length);
  }, []);

  const previousSlide = useCallback(() => {
    setActive((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer = window.setInterval(nextSlide, 5200);
    return () => window.clearInterval(timer);
  }, [nextSlide, paused]);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = gsap.utils.toArray<HTMLElement>(".home-banner__item");
      const current = items[active];

      if (!current) {
        return;
      }

      gsap.set(items, { autoAlpha: 0, zIndex: 0 });
      gsap.set(current, { autoAlpha: 1, zIndex: 1 });

      if (reduceMotion) {
        return;
      }

      gsap.fromTo(
        current.querySelector(".home-banner__image"),
        { scale: 1.06 },
        { scale: 1, duration: 1.5, ease: "power2.out" }
      );
      gsap.fromTo(
        current.querySelectorAll(".home-banner__text, .home-banner__cta"),
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.08
        }
      );
    },
    { dependencies: [active], revertOnUpdate: true, scope: rootRef }
  );

  return (
    <section
      className="home-banner"
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="home-banner__viewport">
        {heroSlides.map((slide, index) => (
          <div
            className={`home-banner__item${active === index ? " is-active" : ""}`}
            data-index={index}
            key={slide.image}
          >
            <Image
              className="home-banner__image"
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              unoptimized
            />
            <div
              className={`home-banner__copy${
                slide.align === "left" ? " home-banner__copy--left" : ""
              }`}
            >
              <h1 className="home-banner__text">{slide.text}</h1>
              <Link className="home-banner__cta" href="/products">
                <span>View More</span>
                <Image src={heroArrow} alt="" width={65} height={42} unoptimized />
              </Link>
            </div>
          </div>
        ))}

        <button
          className="home-banner__arrow home-banner__arrow--prev"
          type="button"
          aria-label="Previous slide"
          onClick={previousSlide}
        >
          ‹
        </button>
        <button
          className="home-banner__arrow home-banner__arrow--next"
          type="button"
          aria-label="Next slide"
          onClick={nextSlide}
        >
          ›
        </button>

        <div className="home-banner__dots" aria-label="Hero carousel pagination">
          {heroSlides.map((slide, index) => (
            <button
              className={active === index ? "is-active" : ""}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={active === index}
              onClick={() => goToSlide(index)}
              key={slide.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
