import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function CTA() {
  return (
    <Section pad="lg">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-mint/30 bg-gradient-to-br from-mint/[0.08] via-transparent to-transparent p-10 md:p-16">
          <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
          <div
            className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-mint/15 blur-3xl"
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mint">
              Let's build something
            </p>
            <h2 className="mt-4 font-display text-display-md text-balance text-white">
              You have a roadmap.{" "}
              <span className="gradient-text">Let's ship it.</span>
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-100/85">
              Tell us what you're trying to ship, the deadline you're staring
              at, and the constraint that's keeping you up. We'll come back
              with a plan within 48 hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg" variant="primary">
                  Start a project <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="mailto:hello@afgtech.com">
                <Button size="lg" variant="secondary">
                  hello@afgtech.com
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
