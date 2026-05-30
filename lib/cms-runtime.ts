import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

type CmsPrismaClient = PrismaClient;

const schemaStatements = [
  `PRAGMA foreign_keys = ON`,
  `CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "imageUrl" TEXT,
    "nameFr" TEXT NOT NULL DEFAULT '',
    "nameEs" TEXT NOT NULL DEFAULT '',
    "nameAr" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "nameFr" TEXT NOT NULL DEFAULT '',
    "nameEs" TEXT NOT NULL DEFAULT '',
    "nameAr" TEXT NOT NULL DEFAULT '',
    "shortDescriptionFr" TEXT NOT NULL DEFAULT '',
    "shortDescriptionEs" TEXT NOT NULL DEFAULT '',
    "shortDescriptionAr" TEXT NOT NULL DEFAULT '',
    "descriptionFr" TEXT NOT NULL DEFAULT '',
    "descriptionEs" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "specs" TEXT NOT NULL DEFAULT '',
    "specsFr" TEXT NOT NULL DEFAULT '',
    "specsEs" TEXT NOT NULL DEFAULT '',
    "specsAr" TEXT NOT NULL DEFAULT '',
    "specsPdf" TEXT,
    "formula" TEXT NOT NULL DEFAULT '',
    "formulaFr" TEXT NOT NULL DEFAULT '',
    "formulaEs" TEXT NOT NULL DEFAULT '',
    "formulaAr" TEXT NOT NULL DEFAULT '',
    "formulaPdf" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "ProductImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "ProductSku" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL DEFAULT '',
    "nameEs" TEXT NOT NULL DEFAULT '',
    "nameAr" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "price" TEXT NOT NULL DEFAULT '',
    "size" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductSku_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "ProductSkuImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skuId" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductSkuImage_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "ProductSku" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "featuredImage" TEXT,
    "authorName" TEXT NOT NULL DEFAULT 'Maredigger Team',
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "titleFr" TEXT NOT NULL DEFAULT '',
    "titleEs" TEXT NOT NULL DEFAULT '',
    "titleAr" TEXT NOT NULL DEFAULT '',
    "excerptFr" TEXT NOT NULL DEFAULT '',
    "excerptEs" TEXT NOT NULL DEFAULT '',
    "excerptAr" TEXT NOT NULL DEFAULT '',
    "contentFr" TEXT NOT NULL DEFAULT '',
    "contentEs" TEXT NOT NULL DEFAULT '',
    "contentAr" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "SiteMedia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL UNIQUE,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL DEFAULT '',
    "kind" TEXT NOT NULL DEFAULT 'text',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "PageView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "visitorId" TEXT,
    "path" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'direct',
    "referrer" TEXT,
    "device" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "_CategoryToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "_CategoryToProduct_AB_unique" ON "_CategoryToProduct"("A", "B")`,
  `CREATE INDEX IF NOT EXISTS "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B")`,
  `CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path")`,
  `CREATE INDEX IF NOT EXISTS "PageView_source_idx" ON "PageView"("source")`,
  `CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "PageView_visitorId_idx" ON "PageView"("visitorId")`
];

const seedCategories = [
  ["Used Excavators", "used-excavators", "/images/crawler-excavator.jpg"],
  ["New Excavators", "new-excavators", "/images/hero-excavator.jpg"],
  ["Excavator Spare Parts", "excavator-spare-parts", "/images/excavator-bucket.jpg"],
  ["Buckets & Attachments", "buckets-attachments", "/images/parts-bucket.jpg"]
] as const;

const seedProducts = [
  {
    name: "MD220LC Used Crawler Excavator",
    slug: "md220lc-used-crawler-excavator",
    category: "used-excavators",
    image: "/images/crawler-excavator.jpg",
    featured: true,
    shortDescription: "Inspected 22 ton class used crawler excavator prepared for export.",
    description:
      "Reliable second-hand crawler excavator for earthwork, construction and rental fleet buyers. Inspection photos, working video and loading plan can be prepared before shipment.",
    specs: "22 ton class<br />Hydraulic crawler<br />Export inspection available"
  },
  {
    name: "Compact 6 Ton New Excavator",
    slug: "compact-6-ton-new-excavator",
    category: "new-excavators",
    image: "/images/hero-excavator.jpg",
    featured: true,
    shortDescription: "Compact new excavator for construction, farms and municipal projects.",
    description:
      "Factory supply compact excavator with flexible cab or canopy options and practical delivery schedule for overseas distributors.",
    specs: "Low fuel consumption<br />Cab or canopy options<br />Quick delivery"
  },
  {
    name: "Excavator Bucket Replacement",
    slug: "excavator-bucket-replacement",
    category: "buckets-attachments",
    image: "/images/excavator-bucket.jpg",
    featured: true,
    shortDescription: "Standard and rock buckets with pins, teeth and fitment support.",
    description:
      "Bucket replacement and attachment sourcing for different excavator models. Provide model, pin size and application for compatibility checking.",
    specs: "Rock and standard buckets<br />Pins and teeth support<br />OEM fit check"
  }
] as const;

const seedPosts = [
  {
    title: "How to prepare a used excavator inquiry for faster export quotation",
    slug: "used-excavator-inquiry-guide",
    excerpt:
      "Model, working hours, bucket size, photos and target port help suppliers confirm machine availability and shipping plans quickly.",
    content:
      "A clear excavator inquiry should include model, year, working hours, serial plate photos, bucket size, inspection requirements and target port. These details help the export team prepare an accurate quotation and loading plan."
  },
  {
    title: "Excavator spare parts that importers often consolidate in one shipment",
    slug: "excavator-spare-parts-consolidation",
    excerpt:
      "Filters, pins, bushings, bucket teeth, seals and hydraulic repair kits are commonly shipped together to reduce logistics cost.",
    content:
      "Combining service parts with machines or mixed spare-part orders can lower logistics cost and reduce communication time. Share part numbers, machine model and quantity for matching support."
  }
] as const;

const seedMedia = [
  ["company_phone", "Company Phone", "86-13647375320", "text"],
  ["company_email", "Company Email", "sales@maredigger.com", "text"],
  [
    "company_address",
    "Company Address",
    "Room 420, No. 28 Xiaotang Road Community, Quantang Subdistrict, Changsha County, Hunan, China",
    "text"
  ],
  ["whatsapp", "WhatsApp", "86-13647375320", "text"],
  ["site_logo", "Site Logo", "/logo.png", "image"],
  ["hero_image", "Home Hero Image", "/images/hero-excavator.jpg", "image"]
] as const;

let ensurePromise: Promise<void> | null = null;

export function configureDatabaseUrl() {
  const configured = process.env.DATABASE_URL?.trim();
  const isVercel = Boolean(process.env.VERCEL);

  if (
    isVercel &&
    (!configured || configured === "file:./dev.db" || configured === "file:./prisma/dev.db")
  ) {
    process.env.DATABASE_URL = "file:/tmp/maredigger.db";
    return;
  }

  if (!configured) {
    process.env.DATABASE_URL = "file:./dev.db";
  }
}

export async function ensureCmsDatabase(prisma: CmsPrismaClient) {
  if (!process.env.DATABASE_URL?.startsWith("file:")) return;

  ensurePromise ??= initializeCmsDatabase(prisma).catch((error) => {
    ensurePromise = null;
    throw error;
  });

  await ensurePromise;
}

async function initializeCmsDatabase(prisma: CmsPrismaClient) {
  for (const statement of schemaStatements) {
    await prisma.$executeRawUnsafe(statement);
  }

  await seedCmsDatabase(prisma);
}

async function seedCmsDatabase(prisma: CmsPrismaClient) {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin12345";
  const admin = await prisma.adminUser.findUnique({ where: { username } });

  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({
      data: { username, passwordHash }
    });
  }

  for (const [name, slug, imageUrl] of seedCategories) {
    await prisma.category.upsert({
      where: { slug },
      update: { name, imageUrl },
      create: { name, slug, imageUrl }
    });
  }

  for (const item of seedProducts) {
    const exists = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (exists) continue;

    const category = await prisma.category.findUnique({ where: { slug: item.category } });
    await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: item.description,
        specs: item.specs,
        featured: item.featured,
        categories: category ? { connect: [{ id: category.id }] } : undefined,
        images: {
          create: [{ src: item.image, alt: item.name, sortOrder: 0 }]
        }
      }
    });
  }

  for (const item of seedPosts) {
    await prisma.post.upsert({
      where: { slug: item.slug },
      update: item,
      create: item
    });
  }

  for (const [key, label, url, kind] of seedMedia) {
    await prisma.siteMedia.upsert({
      where: { key },
      update: { label, url, kind },
      create: { key, label, url, kind }
    });
  }
}
