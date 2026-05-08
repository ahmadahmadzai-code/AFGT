import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, Eyebrow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { CTA } from "@/components/sections/cta";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected projects from AFG Tech across automotive, healthcare, sports, and nonprofit.",
};

export default async function PortfolioIndex() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <>
      <Section pad="lg" className="overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <Container>
          <Eyebrow>Portfolio</Eyebrow>
          <h1 className="mt-6 max-w-4xl font-display text-display-lg text-balance">
            <span className="glow-text">Selected work,</span>{" "}
            <span className="gradient-text">measured in outcomes.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200/85">
            A snapshot of platforms we've shipped recently. Every case study
            includes the metric we were hired to move and what happened after
            launch.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/portfolio/${p.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-all duration-300 hover:border-mint/30"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
                </div>
                <div className="p-7">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge tone="mint">{p.industry}</Badge>
                    <span className="font-mono uppercase tracking-[0.18em] text-ink-300/70">
                      {p.year}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-200/75">
                    {p.summary}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-mint">
                    Read case study
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
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
