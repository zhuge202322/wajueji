"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useState } from "react";
import { ChevronDown, Globe2, Menu, Phone, Search, X } from "lucide-react";
import { company, navItems } from "@/lib/site-data";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <form className="search" onSubmit={handleSearch} role="search">
            <Search size={16} aria-hidden="true" />
            <input aria-label="Search products" placeholder="Excavator parts" />
            <button type="submit">Search</button>
          </form>
          <div className="utility-actions">
            <a className="utility-link" href={`tel:${company.phone}`}>
              <Phone size={16} aria-hidden="true" />
              <span>{company.phone}</span>
            </a>
            <span className="language">
              <Globe2 size={16} aria-hidden="true" />
              English
              <ChevronDown size={14} aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
      <div className="nav-shell">
        <div className="container nav-shell__inner">
          <Link className="brand" href="/" aria-label="Maredigger home">
            <Image
              src="/logo.png"
              alt="Maredigger"
              width={168}
              height={84}
              priority
            />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  className={active ? "nav-link nav-link--active" : "nav-link"}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link className="quote-button" href="/contact-us">
            <Phone size={17} aria-hidden="true" />
            Chat Now
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
