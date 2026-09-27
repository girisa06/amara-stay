import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function ContactSection() {
  return (
    <section className="section bg-primary text-white">
      <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <SectionHeading
            eyebrow="Get In Touch"
            title="Have Questions? We're Here to Help"
            center={false}
          />
          <p className="text-white/70 mb-6 max-w-md">
            Reach out to us directly or send an enquiry and our team will respond within a few
            hours.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+919000000000" className="btn-light !text-primary px-5 py-3">
              <Phone className="h-4 w-4" /> Call Owner
            </a>
            <a
              href="https://wa.me/919000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-success text-white px-5 py-3 hover:bg-success/90"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <Link to="/enquiry" className="btn bg-white/10 text-white border border-white/30 px-5 py-3 hover:bg-white/20">
              <Mail className="h-4 w-4" /> Send Enquiry
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 rounded-xl2 p-6 border border-white/20"
        >
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/90">
              12th Cross Street, Adyar, Chennai, Tamil Nadu 600020
            </p>
          </div>
          <div className="rounded-lg overflow-hidden aspect-video">
            <iframe
              title="AMARA Ladies PG Location"
              className="w-full h-full border-0"
              loading="lazy"
              src="https://maps.google.com/maps?q=Adyar%2C%20Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
