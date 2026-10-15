import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "../components/home/SectionHeading";
import { HOUSE_RULES, AMENITIES, GALLERY, IMAGES } from "../constants/content";

export default function About() {
  const [active, setActive] = useState(null);

  return (
    <div className="pb-10">
      <section className="bg-secondary/30 py-16">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">
              About AMARA Ladies PG
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mb-4">
              A Comfortable Home Away From Home
            </h1>
            <p className="text-ink/70 leading-relaxed">
              AMARA Ladies PG offers 2, 3 and 4 sharing rooms (AC and Non-AC) with three times
              complimentary homestyle food, a kitchen for self-cooking, washing machines,
              high-speed Wi-Fi throughout the building and individual lockable lockers.
            </p>
          </motion.div>
          <div className="flex justify-center">
            <img
              src={IMAGES.building}
              alt="AMARA Ladies PG building"
              className="rounded-xl2 shadow-cardHover max-w-sm w-full"
            />
          </div>
        </div>
      </section>

      <div className="container-page py-16 space-y-16">
        <div>
          <SectionHeading eyebrow="Facilities" title="What's Included" center={false} />
          <div className="card p-6">
            <ul className="grid sm:grid-cols-2 gap-3">
              {AMENITIES.map((a) => (
                <li key={a.name} className="flex items-center gap-3 text-sm text-ink/70">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  {a.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Guidelines" title="House Rules" center={false} />
          <div className="card p-6">
            <ul className="space-y-3">
              {HOUSE_RULES.map((rule, i) => (
                <li key={rule} className="flex items-start gap-3 text-sm text-ink/70">
                  <span className="font-semibold text-primary">{i + 1}.</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Gallery" title="Take a Look Inside" center={false} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GALLERY.map((g) => (
              <button
                key={g.src}
                onClick={() => setActive(g)}
                className="card overflow-hidden text-left"
              >
                <img src={g.src} alt={g.caption} className="w-full aspect-[4/3] object-cover" />
                <p className="px-3 py-2 text-xs text-ink/70">{g.caption}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <img
            src={active.src}
            alt={active.caption}
            className="max-h-[90vh] max-w-[92vw] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
