import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { PRICING } from "../../constants/content";

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function RoomCategories() {
  return (
    <section className="section container-page">
      <SectionHeading
        eyebrow="Room Categories"
        title="Rooms & Monthly Rent"
        description="Rent per bed per month. Food, Wi-Fi and laundry are included."
      />
      <div className="grid sm:grid-cols-3 gap-6">
        {PRICING.map((cat, index) => (
          <motion.div
            key={cat.type}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <Link
              to={`/rooms?room_type=${cat.type}`}
              className="card overflow-hidden group block hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-ink mb-3">{cat.label}</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink/60">Non-AC</span>
                  <span className="font-semibold text-primary">{fmt(cat.nonAc)}/mo</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-ink/60">AC</span>
                  <span className="font-semibold text-primary">{fmt(cat.ac)}/mo</span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-ink/70 group-hover:text-primary">
                  View Rooms <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
