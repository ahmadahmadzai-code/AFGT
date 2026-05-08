import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as Icons from "lucide-react";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, Eyebrow } from "@/components/ui/section";
import { CTA } from "@/components/sections/cta";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: service.shortDesc,
  };
}

function ServiceIcon({ name }: { name: string }) {
  const lib = Icons as unknown as Record<string, Icons.LucideIcon | undefined>;
  const Icon = lib[name] ?? Icons.Box;
  return <Icon className="h-6 w-6" aria-hidden />;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service || !service.published) notFound();

  return (
    <>
      <Section pad="lg" className="overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <Container>
          <Eyebrow>Service</Eyebrow>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/10 text-mint ring-1 ring-mint/20">
              <ServiceIcon name={service.icon} />
            </div>
            <h1 className="font-display text-display-lg text-balance">
              <span className="glow-text">{service.title}</span>
            </h1>
          </div>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200/85">
            {service.shortDesc}
          </p>
        </Container>
      </Section>

      <Section>
        <Container width="md">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-8">
              <article
                className="prose-invert-mint"
                dangerouslySetInnerHTML={{ __html: service.body }}
              />
            </div>
            <aside className="md:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.025] p-7">
                <h3 className="font-display text-lg font-semibold text-white">
                  What's included
                </h3>
                <ul className="mt-5 space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-100">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-mint" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <CTA />
    </>
  );
}
