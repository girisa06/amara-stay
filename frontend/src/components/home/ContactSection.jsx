import { Link } from "react-router-dom";
import { Phone, MessageCircle, Mail } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { CONTACT } from "../../constants/content";

export default function ContactSection() {
  return (
    <section className="section bg-primary text-white">
      <div className="container-page">
        <SectionHeading eyebrow="Get In Touch" title="Have Questions? Call Us" center={false} />
        <p className="text-white/70 mb-6 max-w-md">
          Call or WhatsApp us, or send an enquiry and we will get back to you.
        </p>
        <div className="flex flex-wrap gap-4">
          {CONTACT.phones.map((p) => (
            <a key={p} href={`tel:+91${p}`} className="btn-light !text-primary px-5 py-3">
              <Phone className="h-4 w-4" /> {p}
            </a>
          ))}
          <a
            href={`https://wa.me/${CONTACT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-success text-white px-5 py-3 hover:bg-success/90"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <Link
            to="/enquiry"
            className="btn bg-white/10 text-white border border-white/30 px-5 py-3 hover:bg-white/20"
          >
            <Mail className="h-4 w-4" /> Send Enquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
