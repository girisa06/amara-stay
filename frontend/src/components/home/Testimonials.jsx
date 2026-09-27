import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../../constants/content";
import SectionHeading from "./SectionHeading";

export default function Testimonials() {
  return (
    <section className="section bg-secondary/20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Residents Say"
          description="Real experiences from students and professionals who call AMARA Stay home."
        />
        <div className="grid sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="card p-6"
            >
              <Quote className="h-6 w-6 text-primary/40 mb-3" />
              <p className="text-ink/80 mb-4 leading-relaxed">"{t.review}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink text-sm">{t.name}</p>
                  <p className="text-xs text-ink/50">{t.role}</p>
                </div>
                <div className="flex text-warning">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
