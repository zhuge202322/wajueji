import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

type ProductCardProps = {
  product: {
    name: string;
    category: string;
    image: string;
    badge: string;
    specs: string[];
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 960px) 30vw, 100vw" />
        <span>{product.badge}</span>
      </div>
      <div className="product-card__body">
        <p>{product.category}</p>
        <h3>{product.name}</h3>
        <ul>
          {product.specs.map((spec) => (
            <li key={spec}>
              <CheckCircle2 size={15} aria-hidden="true" />
              {spec}
            </li>
          ))}
        </ul>
        <Link href="/contact-us">
          Get Best Price
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
