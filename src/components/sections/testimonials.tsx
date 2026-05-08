import { Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Testimonial } from "@prisma/client";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;
  return (
    <Section className="border-t border-white/[0.05] bg-ink-900/20">
      <Container>
        <SectionHeading
          eyebrow="What clients say"
          title={<>The work speaks. So do the people who shipped it.</>}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-8"
            >
              <Quote className="h-7 w-7 text-mint/60" aria-hidden />
              <blockquote className="mt-5 flex-1 text-pretty text-base leading-relaxed text-ink-100">
                "{t.quote}"
              </blockquote>
              <div className="mt-7 flex items-center gap-1 text-mint">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <figcaption className="mt-4 border-t border-white/5 pt-4">
                <div className="text-sm font-semibold text-white">{t.author}</div>
                <div className="text-xs text-ink-300/70">
                  {t.role} · {t.company}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
