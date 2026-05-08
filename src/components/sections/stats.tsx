"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const stats = [
  { value: "16", label: "Years shipping software", helper: "Founded 2009 in Grapevine, TX" },
  { value: "180+", label: "Platforms launched", helper: "Across web, mobile, data, & AI" },
  { value: "98%", label: "Client retention", helper: "Multi-year engagements are the norm" },
  { value: "4", label: "Industries we know cold", helper: "Automotive, healthcare, sports, nonprofit" },
];

export function Stats() {
  return (
    <section className="border-y border-white/[0.05] bg-ink-900/30">
      <Container>
        <div className="grid gap-px bg-white/[0.06] md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-ink-950 p-8 md:p-10"
            >
              <div className="font-display text-5xl font-semibold tracking-tight text-mint md:text-6xl">
                {s.value}
              </div>
              <div className="mt-3 text-sm font-medium text-white">{s.label}</div>
              <div className="mt-1 text-xs text-ink-300/70">{s.helper}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
