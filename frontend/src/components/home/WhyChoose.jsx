import { motion } from "framer-motion";
import { ShieldCheck, UtensilsCrossed, Wifi, HeartHandshake, MapPin, Clock } from "lucide-react";
import SectionHeading from "./SectionHeading";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Verified Safety",
    description: "CCTV surveillance, biometric entry, and round-the-clock security staff.",
  },
  {
    icon: UtensilsCrossed,
    title: "Home-Style Food",
    description: "Nutritious meals prepared fresh daily, with vegetarian and diet options.",
  },
  {
    icon: Wifi,
    title: "Modern Amenities",
    description: "High-speed WiFi, AC rooms, laundry and housekeeping included.",
  },
  {
    icon: HeartHandshake,
    title: "Parent-Friendly",
    description: "Transparent policies and regular updates that give parents peace of mind.",
  },
  {
    icon: MapPin,
    title: "Prime Location",
    description: "Minutes from top colleges, IT parks and public transport.",
  },
  {
    icon: Clock,
    title: "Flexible Stay",
    description: "Short and long-term stay options tailored to students and professionals.",
  },
];

export default function WhyChoose() {
  return (
    <section className="section container-page">
      <SectionHeading
        eyebrow="Why AMARA"
        title="Why Choose AMARA Ladies PG"
        description="Everything you need for a safe, comfortable and convenient stay, thoughtfully designed for women."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {REASONS.map((reason, index) => (
          <motion.div
            key={reason.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="card p-6 hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <reason.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-ink mb-2">{reason.title}</h3>
            <p className="text-sm text-ink/60">{reason.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
