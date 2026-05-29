import type { Metadata } from "next";
import { MapPin, Phone, Send } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { company, processSteps } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact us | Maredigger",
  description:
    "Contact Maredigger for excavator, used excavator and excavator spare parts export quotation."
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <p className="eyebrow">Contact us</p>
          <h1>Send your excavator or parts inquiry</h1>
          <p>
            Share model, part number, target port and quantity. Maredigger will
            prepare a practical B2B export quotation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-details">
            <h2>Export inquiry desk</h2>
            <p>
              The team supports machine sourcing, spare parts matching, packing
              checks and shipment coordination for global buyers.
            </p>
            <a href={`tel:${company.phone}`}>
              <Phone size={18} aria-hidden="true" />
              {company.phone}
            </a>
            <span>
              <MapPin size={18} aria-hidden="true" />
              {company.address}
            </span>
            <div className="contact-steps">
              <h3>Inquiry checklist</h3>
              <ol>
                {processSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          <div>
            <div className="form-heading">
              <Send size={22} aria-hidden="true" />
              <h2>Request quotation</h2>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
