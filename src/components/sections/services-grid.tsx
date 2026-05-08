import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Service } from "@prisma/client";

interface ServicesGridProps {
  services: Pick<Service, "id" | "slug" | "title" | "icon" | "shortDesc">[];
}

function ServiceIcon({ name }: { name: string }) {
  const lib = Icons as unknown as Record<string, Icons.LucideIcon | undefined>;
  const Icon = lib[name] ?? Icons.Box;
  return <Icon className="h-5 w-5" aria-hidden />;
}

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title={<>Senior engineering, end-to-end.</>}
          description="We pair product designers with senior engineers to plan, build, and operate software that holds up. No offshore handoffs. No template themes."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/services/${s.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition-all duration-300 hover:border-mint/30 hover:bg-white/[0.04]"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-mint/0 via-transparent to-mint/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-mint/10" />
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
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
