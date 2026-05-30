import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  ["Used Excavators", "used-excavators", "/images/crawler-excavator.jpg"],
  ["New Excavators", "new-excavators", "/images/hero-excavator.jpg"],
  ["Excavator Spare Parts", "excavator-spare-parts", "/images/excavator-bucket.jpg"],
  ["Buckets & Attachments", "buckets-attachments", "/images/parts-bucket.jpg"]
];

const products = [
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
  ["site_logo", "网站 Logo", "/logo.png", "image"],
  ["hero_image", "首页主图", "/images/hero-excavator.jpg", "image"]
];

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin12345";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash }
  });

  for (const [name, slug, imageUrl] of categories) {
    await prisma.category.upsert({
      where: { slug },
      update: { name, imageUrl },
      create: { name, slug, imageUrl }
    });
  }

  for (const item of products) {
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
