import { motion } from "framer-motion";
import { UtensilsCrossed, Wifi, BedDouble, Lock, WashingMachine, ChefHat } from "lucide-react";
import SectionHeading from "./SectionHeading";

const REASONS = [
  {
    icon: BedDouble,
    title: "2, 3 & 4 Sharing Rooms",
    description: "Choose AC or Non-AC rooms to suit your budget.",
  },
  {
    icon: UtensilsCrossed,
    title: "Complimentary Meals",
    description: "Homestyle food three times a day, included for everyone staying with us.",
  },
  {
    icon: ChefHat,
    title: "Self-Cooking Kitchen",
    description: "A kitchen is available if you prefer to cook your own meals.",
  },
  {
    icon: WashingMachine,
    title: "Laundry",
    description: "Washing machines are provided for residents.",
  },
  {
    icon: Wifi,
    title: "High-Speed Wi-Fi",
    description: "Wi-Fi access throughout the building.",
  },
  {
    icon: Lock,
    title: "Individual Lockers",
    description: "Every resident gets a lockable locker for their belongings.",
  },
];

export default function WhyChoose() {
  return (
    <section className="section container-page">
      <SectionHeading
        eyebrow="Why AMARA"
        title="Why Choose AMARA Ladies PG"
        description="Everything you need for a comfortable stay, included in your rent."
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
