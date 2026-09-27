import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

const CATEGORIES = [
  {
    type: "single",
    label: "Single Sharing",
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    startingAt: "₹12,000/mo",
  },
  {
    type: "double",
    label: "Double Sharing",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    startingAt: "₹9,000/mo",
  },
  {
    type: "triple",
    label: "Triple Sharing",
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    startingAt: "₹7,500/mo",
  },
  {
    type: "four",
    label: "Four Sharing",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    startingAt: "₹6,000/mo",
  },
];

export default function RoomCategories() {
  return (
    <section className="section container-page">
      <SectionHeading
        eyebrow="Room Categories"
        title="A Room For Every Need"
        description="From private single rooms to budget-friendly shared spaces — find your fit."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat, index) => (
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
                <h3 className="font-semibold text-ink mb-1">{cat.label}</h3>
                <p className="text-sm text-primary font-medium mb-3">Starting {cat.startingAt}</p>
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
