import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { AMENITIES } from "../../constants/content";
import SectionHeading from "./SectionHeading";

export default function Amenities() {
  return (
    <section className="section bg-secondary/20">
      <div className="container-page">
        <SectionHeading eyebrow="Facilities" title="What's Included" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {AMENITIES.map((amenity, index) => {
            const Icon = Icons[amenity.icon] || Icons.Sparkles;
            return (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="card flex flex-col items-center text-center gap-3 p-6"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-ink">{amenity.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
