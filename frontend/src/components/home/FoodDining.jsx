import { motion } from "framer-motion";
import { UtensilsCrossed, Leaf, Clock3, ChefHat } from "lucide-react";
import SectionHeading from "./SectionHeading";

const HIGHLIGHTS = [
  { icon: Leaf, text: "Fresh, home-style vegetarian and non-vegetarian meals" },
  { icon: Clock3, text: "Fixed meal timings with flexibility for shift workers" },
  { icon: ChefHat, text: "Hygienic kitchen with weekly menu rotation" },
  { icon: UtensilsCrossed, text: "Special diet plans available on request" },
];

export default function FoodDining() {
  return (
    <section className="section bg-secondary/20">
      <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading
            eyebrow="Food & Dining"
            title="Meals That Feel Like Home"
            center={false}
          />
          <div className="grid sm:grid-cols-2 gap-5">
            {HIGHLIGHTS.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex gap-3 items-start"
              >
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <p className="text-sm text-ink/70">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl2 overflow-hidden shadow-cardHover"
        >
          <img
            src="https://images.unsplash.com/photo-1540518614846-7a939ddd6e11?auto=format&fit=crop&w=1200&q=80"
            alt="Dining area at AMARA Ladies PG"
            className="w-full h-full object-cover aspect-[4/3]"
          />
        </motion.div>
      </div>
    </section>
  );
}
