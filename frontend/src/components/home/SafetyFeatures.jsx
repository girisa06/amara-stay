import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { SAFETY_FEATURES } from "../../constants/content";
import SectionHeading from "./SectionHeading";

export default function SafetyFeatures() {
  return (
    <section className="section container-page">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl2 overflow-hidden shadow-cardHover"
        >
          <img
            src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80"
            alt="Secure PG premises"
            className="w-full h-full object-cover aspect-[4/3]"
          />
        </motion.div>

        <div>
          <SectionHeading
            eyebrow="Your Safety, Our Priority"
            title="Built for Women's Security"
            center={false}
          />
          <div className="space-y-5">
            {SAFETY_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex gap-4"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink mb-1">{feature.title}</h3>
                  <p className="text-sm text-ink/60">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
