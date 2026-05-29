"use client";

import { FormEvent, useRef, useState } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function prepareInquiry() {
    if (formRef.current?.reportValidity()) {
      setSent(true);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    prepareInquiry();
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
      <div className="form-row">
        <label>
          Name
          <input required name="name" placeholder="Your name" />
        </label>
        <label>
          Company
          <input name="company" placeholder="Company name" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Phone or WhatsApp
          <input required name="phone" placeholder="+1 000 000 0000" />
        </label>
        <label>
          Target Port
          <input name="port" placeholder="e.g. Jebel Ali, Mombasa" />
        </label>
      </div>
      <label>
        Product Request
        <textarea
          required
          name="message"
          rows={6}
          placeholder="Machine model, year, working hours, parts list or quantity"
        />
      </label>
      <button type="button" onClick={prepareInquiry}>
        <Send size={17} aria-hidden="true" />
        Send Inquiry
      </button>
      {sent && (
        <p className="form-note">
          Thank you. Your inquiry has been prepared for the export team.
        </p>
      )}
    </form>
  );
}
