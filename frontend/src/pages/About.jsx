import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap, Building2, Bus, ShieldCheck } from "lucide-react";
import SectionHeading from "../components/home/SectionHeading";
import {
  HOUSE_RULES,
  SAFETY_FEATURES,
  NEARBY_COLLEGES,
  NEARBY_IT_PARKS,
  NEARBY_TRANSPORT,
} from "../constants/content";

function ListCard({ icon: Icon, title, items }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-ink">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-ink/70 flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function About() {
  return (
    <div className="pb-10">
      <section className="bg-secondary/30 py-16">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">
              About AMARA Ladies PG
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mb-4">
              A Safe, Trusted Home Away From Home
            </h1>
            <p className="text-ink/70 mb-6 leading-relaxed">
              AMARA Ladies PG has been offering premium accommodation to students and working
              women in Chennai. With 24/7 security, home-style food and a warm community, we've
              built a reputation as a trusted, parent-approved living space for over 60 residents
              across our property.
            </p>
            <div className="flex flex-wrap gap-6">
              {["6+ Years", "60+ Residents", "4.8★ Rating"].map((stat) => (
                <div key={stat} className="flex items-center gap-2 text-sm font-medium text-ink/80">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {stat}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl2 overflow-hidden shadow-cardHover aspect-[4/3]"
          >
            <img
              src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80"
              alt="AMARA Ladies PG property"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      <div className="container-page py-16 space-y-16">
        <div>
          <SectionHeading eyebrow="Guidelines" title="House Rules" center={false} />
          <div className="card p-6">
            <ul className="space-y-3">
              {HOUSE_RULES.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-sm text-ink/70">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="Safety Standards"
            title="Women's Security Measures"
            center={false}
          />
          <div className="grid sm:grid-cols-2 gap-5">
            {SAFETY_FEATURES.map((feature) => (
              <div key={feature.title} className="card p-5 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-ink text-sm mb-1">{feature.title}</p>
                  <p className="text-sm text-ink/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Location" title="What's Nearby" center={false} />
          <div className="grid sm:grid-cols-3 gap-6">
            <ListCard icon={GraduationCap} title="Nearby Colleges" items={NEARBY_COLLEGES} />
            <ListCard icon={Building2} title="Nearby IT Parks" items={NEARBY_IT_PARKS} />
            <ListCard icon={Bus} title="Transportation" items={NEARBY_TRANSPORT} />
          </div>
        </div>
      </div>
    </div>
  );
}
