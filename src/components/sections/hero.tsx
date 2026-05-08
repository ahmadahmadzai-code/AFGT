"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 bg-grid opacity-70" aria-hidden />
      <div
        className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-mint/[0.08] blur-3xl"
        aria-hidden
      />

      <Container>
        <div className="relative pb-24 pt-20 md:pb-32 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow>
              <Sparkles className="h-3 w-3" /> Software studio · DFW · Since 2009
            </Eyebrow>
          </motion.div>

          <motion.h1
            className="mt-7 max-w-5xl font-display text-display-xl text-balance"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="glow-text">We build software</span>{" "}
            <span className="gradient-text">that drives outcomes</span>{" "}
            <span className="glow-text">— not invoices.</span>
          </motion.h1>

          <motion.p
            className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200/85"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            AFG Tech is a software development agency in Grapevine, TX. For
            sixteen years we've shipped production platforms for automotive,
            healthcare, sports, and nonprofit teams who measure success in
            outcomes, not deliverables.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/contact">
              <Button size="lg" variant="primary">
                Start a project <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline">
                See our work
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-300/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <span>Automotive</span>
            <span className="h-1 w-1 rounded-full bg-mint/50" />
            <span>Healthcare</span>
            <span className="h-1 w-1 rounded-full bg-mint/50" />
            <span>Sports</span>
            <span className="h-1 w-1 rounded-full bg-mint/50" />
            <span>Nonprofit</span>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
