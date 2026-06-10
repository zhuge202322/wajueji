import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";

const prisma = new PrismaClient();

const fallbackCategories = [
  ["Used Excavators", "used-excavators", "/images/crawler-excavator.jpg"],
  ["New Excavators", "new-excavators", "/images/hero-excavator.jpg"],
  ["Excavator Spare Parts", "excavator-spare-parts", "/images/excavator-bucket.jpg"],
  ["Buckets & Attachments", "buckets-attachments", "/images/parts-bucket.jpg"]
];

const fallbackProducts = [
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
];

const legacyDemoProductSlugs = [
  "md220lc-used-crawler-excavator",
  "compact-6-ton-new-excavator",
  "excavator-bucket-replacement",
  "aaaa"
];

const legacyDemoCategorySlugs = [
  "used-excavators",
  "new-excavators",
  "excavator-spare-parts",
  "buckets-attachments"
];

const posts = [
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
];

const media = [
  ["company_phone", "公司电话", "86-13647375320", "text"],
  ["company_email", "公司邮箱", "sales@maredigger.com", "text"],
  ["company_address", "公司地址", "Room 420, No. 28 Xiaotang Road Community, Quantang Subdistrict, Changsha County, Hunan, China", "text"],
  ["whatsapp", "WhatsApp", "86-13647375320", "text"],
  ["social_fb", "Facebook 链接", "", "text"],
  ["social_ins", "Instagram 链接", "", "text"],
  ["social_ws", "WhatsApp 社媒链接", "", "text"],
  ["social_tk", "TikTok 链接", "", "text"],
  ["site_logo", "网站 Logo", "/logo.png", "image"],
  ["hero_image", "首页主图", "/images/hero-excavator.jpg", "image"]
];

async function loadReferenceData() {
  try {
    const file = await readFile(
      new URL("./reference-products.json", import.meta.url),
      "utf8"
    );
    return JSON.parse(file);
  } catch {
    return {
      categories: fallbackCategories.map(([name, slug, imageUrl], index) => ({
        name,
        slug,
        imageUrl,
        sortOrder: index
      })),
      products: fallbackProducts.map((product, index) => ({
        ...product,
        categorySlugs: [product.category],
        primaryCategorySlug: product.category,
        price: "Contact for quote",
        minOrder: "1 Unit",
        sortOrder: index
      }))
    };
  }
}

async function main() {
  const referenceData = await loadReferenceData();
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin12345";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash }
  });

  await prisma.product.deleteMany({
    where: { slug: { in: legacyDemoProductSlugs } }
  });

  for (const item of referenceData.categories) {
    await prisma.category.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        imageUrl: item.imageUrl,
        sortOrder: item.sortOrder || 0
      },
      create: {
        name: item.name,
        slug: item.slug,
        imageUrl: item.imageUrl,
        sortOrder: item.sortOrder || 0
      }
    });
  }

  for (const slug of legacyDemoCategorySlugs) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { products: true } } }
    });
    if (category && category._count.products === 0) {
      await prisma.category.delete({ where: { slug } });
    }
  }

  for (const item of referenceData.products) {
    const categorySlugs = item.categorySlugs?.length
      ? item.categorySlugs
      : [item.primaryCategorySlug || item.category].filter(Boolean);
    const categories = await prisma.category.findMany({
      where: { slug: { in: categorySlugs } }
    });
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        shortDescription: item.shortDescription,
        description: item.description,
        specs: item.specs,
        featured: Boolean(item.featured),
        sortOrder: item.sortOrder || 0,
        categories: categories.length
          ? { set: categories.map((category) => ({ id: category.id })) }
          : undefined
      },
      create: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: item.description,
        specs: item.specs,
        featured: Boolean(item.featured),
        sortOrder: item.sortOrder || 0,
        categories: categories.length
          ? { connect: categories.map((category) => ({ id: category.id })) }
          : undefined
      }
    });

    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    });
    const productImages = [
      ...(item.galleryImages?.length ? item.galleryImages : [item.image]),
      ...(item.detailImages || [])
    ].filter(Boolean);
    const uniqueProductImages = [...new Set(productImages)];
    await prisma.productImage.createMany({
      data: uniqueProductImages.map((src, index) => ({
        productId: product.id,
        src,
        alt: item.name,
        sortOrder: index
      }))
    });

    await prisma.productSku.deleteMany({
      where: { productId: product.id }
    });
    const skuImages = (item.galleryImages?.length ? item.galleryImages : [item.image]).filter(Boolean);
    await prisma.productSku.create({
      data: {
        productId: product.id,
        name: item.name,
        image: skuImages[0] || item.image,
        price: item.price || "Contact for quote",
        size: item.minOrder || "1 Unit",
        sortOrder: 0,
        images: {
          create: [...new Set(skuImages)].map((src, index) => ({
            src,
            alt: item.name,
            sortOrder: index
          }))
        }
      }
    });
  }

  for (const item of posts) {
    await prisma.post.upsert({
      where: { slug: item.slug },
      update: item,
      create: item
    });
  }

  for (const [key, label, url, kind] of media) {
    await prisma.siteMedia.upsert({
      where: { key },
      update: { label, url, kind },
      create: { key, label, url, kind }
    });
  }

  console.log(`Admin user ready: ${username} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
