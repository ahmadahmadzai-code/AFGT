import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, Eyebrow } from "@/components/ui/section";
import { CTA } from "@/components/sections/cta";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web, mobile, cloud, data & AI, design, and managed engineering services from AFG Tech.",
};

function ServiceIcon({ name }: { name: string }) {
  const lib = Icons as unknown as Record<string, Icons.LucideIcon | undefined>;
  const Icon = lib[name] ?? Icons.Box;
  return <Icon className="h-5 w-5" aria-hidden />;
}

export default async function ServicesIndex() {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <Section pad="lg" className="overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <Container>
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-6 max-w-4xl font-display text-display-lg text-balance">
            <span className="glow-text">Senior-only delivery,</span>{" "}
            <span className="gradient-text">across the stack.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200/85">
            Whether you need a single platform shipped or an embedded squad to
            partner with for years, the work is led by engineers who've been
            doing this since 2009.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition-all duration-300 hover:border-mint/30 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint/10 text-mint ring-1 ring-mint/20">
                  <ServiceIcon name={s.icon} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-200/75">
                  {s.shortDesc}
                </p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-mint">
                  Learn more
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CTA />
    </>
  );
}
