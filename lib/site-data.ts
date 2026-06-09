import {
  Factory,
  Globe2,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wrench
} from "lucide-react";

export const company = {
  name: "Maredigger",
  tagline: "Excavator & Excavator Parts Supplier",
  phone: "86-13647375320",
  address:
    "Room 420, No. 28 Xiaotang Road Community, Quantang Subdistrict, Changsha County, Hunan, China",
  intro:
    "Maredigger is a professional excavator supplier and excavator parts exporter from China. We offer new excavators, used excavators, second-hand excavators and a full range of excavator spare parts for different brands. Our products include hydraulic parts, engine parts, undercarriage parts, buckets, tracks, filters, pumps, cylinders and other construction machinery parts. Maredigger serves global customers with reliable quality, competitive prices and efficient export service."
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About us", href: "/about-us" },
  { label: "News", href: "/news" },
  { label: "Contact us", href: "/contact-us" }
];

export const categories = [
  { name: "All Products", count: 195 },
  { name: "Excavator", count: 105 },
  { name: "Caterpillar", count: 50 },
  { name: "Loader", count: 33 },
  { name: "Bulldozer", count: 32 },
  { name: "Hitachi", count: 17 },
  { name: "Hyundai", count: 15 },
  { name: "Komatsu", count: 9 },
  { name: "Truck Trailer", count: 8 },
  { name: "Grader", count: 7 },
  { name: "Roller", count: 5 },
  { name: "Forklift", count: 5 }
];

export const productGroups = [
  {
    name: "Excavator",
    summary: "Used crawler excavators and brand categories prepared for export.",
    image: "/images/crawler-excavator.jpg"
  },
  {
    name: "Loader",
    summary: "Wheel loaders and front-end loaders for construction and earthwork.",
    image: "/images/hero-excavator.jpg"
  },
  {
    name: "Bulldozer",
    summary: "Crawler bulldozers and heavy machines for site preparation.",
    image: "/images/excavator-bucket.jpg"
  }
];

export const products = [
  {
    name: "MD220LC Used Crawler Excavator",
    category: "Used Excavators",
    image: "/images/crawler-excavator.jpg",
    badge: "Ready Stock",
    specs: ["22 ton class", "Hydraulic crawler", "Export inspection available"]
  },
  {
    name: "Compact 6 Ton New Excavator",
    category: "New Excavators",
    image: "/images/hero-excavator.jpg",
    badge: "Factory Supply",
    specs: ["Low fuel consumption", "Cab or canopy options", "Quick delivery"]
  },
  {
    name: "Long Reach Excavator Package",
    category: "Used Excavators",
    image: "/images/crawler-excavator.jpg",
    badge: "Custom Match",
    specs: ["River work", "Extended arm option", "Bucket matched to job"]
  },
  {
    name: "Excavator Bucket Replacement",
    category: "Buckets & Attachments",
    image: "/images/excavator-bucket.jpg",
    badge: "Wear Parts",
    specs: ["Rock and standard buckets", "Pins and teeth support", "OEM fit check"]
  },
  {
    name: "Bucket Coupler & Attachment Set",
    category: "Excavator Spare Parts",
    image: "/images/parts-bucket.jpg",
    badge: "Parts Supply",
    specs: ["Mixed parts shipment", "Model confirmation", "Packing list service"]
  },
  {
    name: "Service Parts Procurement Program",
    category: "Hydraulic Parts",
    image: "/images/excavator-bucket.jpg",
    badge: "Export Service",
    specs: ["Filters and seals", "Pumps and cylinders", "Consolidated delivery"]
  }
];

export const strengths = [
  {
    icon: ShieldCheck,
    title: "Inspection Before Shipment",
    text: "Machine condition checks, serial matching and clear photos before packing."
  },
  {
    icon: PackageCheck,
    title: "Parts Matching Support",
    text: "Confirm models, dimensions and part references before order placement."
  },
  {
    icon: Truck,
    title: "Export Packing",
    text: "Container loading, wooden case packing and shipping document coordination."
  },
  {
    icon: Globe2,
    title: "Global B2B Service",
    text: "Responsive quotations for importers, dealers, rental fleets and contractors."
  }
];

export const processSteps = [
  "Share machine model, year, working hours or part number.",
  "Receive quotation with photos, specifications and supply schedule.",
  "Confirm inspection, payment terms, packing and export documents.",
  "Ship by container, bulk cargo or express parts delivery."
];

export const stats = [
  { value: "48+", label: "product lines" },
  { value: "20+", label: "export markets" },
  { value: "72h", label: "quote response" },
  { value: "1-stop", label: "machine and parts" }
];

export const news = [
  {
    title: "How to prepare a used excavator inquiry for faster export quotation",
    date: "2026-05-12",
    category: "Buying Guide",
    excerpt:
      "Model, working hours, bucket size, photos and target port help suppliers confirm machine availability and shipping plans quickly."
  },
  {
    title: "Excavator spare parts that importers often consolidate in one shipment",
    date: "2026-04-28",
    category: "Parts",
    excerpt:
      "Filters, pins, bushings, bucket teeth, seals and hydraulic repair kits are commonly shipped together to reduce logistics cost."
  },
  {
    title: "What buyers should check before loading second-hand construction machinery",
    date: "2026-03-18",
    category: "Inspection",
    excerpt:
      "Condition photos, start-up video, oil leak check and loading measurements reduce uncertainty before container booking."
  }
];

export const serviceHighlights = [
  {
    icon: Factory,
    title: "China supply network",
    text: "Sourcing support for excavators and spare parts from multiple machinery hubs."
  },
  {
    icon: Wrench,
    title: "Technical confirmation",
    text: "Model compatibility and application details checked before final quote."
  }
];
