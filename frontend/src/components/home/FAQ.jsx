import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../../constants/content";
import SectionHeading from "./SectionHeading";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section container-page">
      <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
      <div className="max-w-2xl mx-auto space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="card overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-medium text-ink">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-primary flex-shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-ink/60">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
