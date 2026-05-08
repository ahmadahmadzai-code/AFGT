import * as Icons from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Industry } from "@prisma/client";

interface IndustriesProps {
  industries: Industry[];
}

function IndustryIcon({ name }: { name: string }) {
  const lib = Icons as unknown as Record<string, Icons.LucideIcon | undefined>;
  const Icon = lib[name] ?? Icons.Briefcase;
  return <Icon className="h-6 w-6" aria-hidden />;
}

export function Industries({ industries }: IndustriesProps) {
  return (
    <Section className="border-t border-white/[0.05] bg-ink-900/20">
      <Container>
        <div className="grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionHeading
              eyebrow="Industries"
              title={<>Domain knowledge that compounds.</>}
              description="Sixteen years deep in four industries — every engagement starts with vocabulary, regulations, and operating rhythms we already know."
            />
          </div>
          <div className="hidden md:col-span-5 md:block" />
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {industries.map((i) => (
            <div
              key={i.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/40 p-7 transition-colors duration-300 hover:border-mint/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/10 text-mint ring-1 ring-mint/20">
                <IndustryIcon name={i.icon} />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                {i.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-200/70">
                {i.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
