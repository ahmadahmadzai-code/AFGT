"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Two-week immersion. We meet your operators, audit your stack, and translate ambiguity into a one-page outcome plan.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Architecture, design system, and a clickable prototype. Stakeholders sign off on the experience before we write production code.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Weekly demos, paired engineering, automated tests, observability from sprint one. You see progress every Friday.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "Production parity environments, blue/green deploys, on-call rotation. We ship without drama and stay on through stabilization.",
  },
  {
    number: "05",
    title: "Operate",
    description:
      "Quarterly OKRs, incident reviews, roadmap. We measure ourselves on the metric that mattered when we said yes to the work.",
  },
];

export function Process() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title={<>A five-step rhythm we've run 180+ times.</>}
          description="No discovery theater. No status reports nobody reads. A predictable cadence with clear artifacts at every checkpoint."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] md:grid-cols-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative flex flex-col bg-ink-950 p-7"
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-mint">
                Step {step.number}
              </span>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-200/70">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
