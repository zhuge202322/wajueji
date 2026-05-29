import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Send } from "lucide-react";
import { categories, company, navItems } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src="/logo.png" alt="Maredigger" width={170} height={88} />
          <p>{company.tagline}</p>
          <div className="footer-contact">
            <span>
              <Phone size={16} aria-hidden="true" />
              {company.phone}
            </span>
            <span>
              <MapPin size={16} aria-hidden="true" />
              {company.address}
            </span>
          </div>
        </div>
        <div>
          <h2>Pages</h2>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Products</h2>
          <ul>
            {categories.slice(1, 7).map((item) => (
              <li key={item.name}>
                <Link href="/products">{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Inquiry</h2>
          <p>
            Send machine model, parts list or target port. Our export team will
            prepare a practical quotation.
          </p>
          <Link className="footer-cta" href="/contact-us">
            <Send size={16} aria-hidden="true" />
            Send Inquiry
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© 2026 Maredigger. Excavator and spare parts supplier.</span>
        </div>
      </div>
    </footer>
  );
}
