import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, description, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={center ? "text-center max-w-2xl mx-auto mb-12" : "max-w-2xl mb-12"}
    >
      {eyebrow && (
        <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mb-3">{title}</h2>
      {description && <p className="text-ink/60">{description}</p>}
    </motion.div>
  );
}
