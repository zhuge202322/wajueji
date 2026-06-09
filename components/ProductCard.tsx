import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

type ProductCardProps = {
  product: {
    name: string;
    slug: string;
    category: string;
    image: string;
    badge: string;
    specs: string[];
    price?: string;
    minOrder?: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const detailHref = `/products/${product.slug}`;

  return (
    <article className="product-card">
      <Link className="product-card__media" href={detailHref}>
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 960px) 30vw, 100vw" />
        <span>{product.badge}</span>
      </Link>
      <div className="product-card__body">
        <p>{product.category}</p>
        <h3>
          <Link href={detailHref}>{product.name}</Link>
        </h3>
        <div className="product-card__trade">
          <strong>{product.price || "Contact for quote"}</strong>
          <span>Min Order: {product.minOrder || "1 Unit"}</span>
        </div>
        <ul>
          {product.specs.slice(0, 3).map((spec) => (
            <li key={spec}>
              <CheckCircle2 size={15} aria-hidden="true" />
              {spec}
            </li>
          ))}
        </ul>
        <Link href={detailHref}>
          View Details
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
