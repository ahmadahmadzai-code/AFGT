import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { CTA } from "@/components/sections/cta";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description:
    "AFG Tech is a software development agency in Grapevine, TX building production-grade platforms since 2009.",
};

const values = [
  {
    title: "Outcomes over output",
    body: "We define success in your metric — not story points shipped. Every engagement starts with the number we're trying to move.",
  },
  {
    title: "Senior-only delivery",
    body: "No junior pyramid. The people who design your platform are the people who write the code and answer the pager.",
  },
  {
    title: "Domain knowledge that compounds",
    body: "Sixteen years deep in four industries means we don't bill you to learn your vocabulary.",
  },
  {
    title: "Production parity from day one",
    body: "Observability, CI/CD, and security baked in before the second sprint ends. Software that survives its launch.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section pad="lg" className="overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <Container>
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-6 max-w-4xl font-display text-display-lg text-balance">
            <span className="glow-text">A studio of senior engineers</span>{" "}
            <span className="gradient-text">in {siteConfig.location}.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200/85">
            AFG Tech was founded in 2009 to do one thing exceptionally well:
            ship software that works in production, on day one, and on day
            one-thousand. We've grown into a senior-only studio of engineers,
            designers, and product partners — based in the DFW Metroplex,
            shipping for clients across the country.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="What we believe"
            title={<>Four ideas that shape every engagement.</>}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-8"
              >
                <h3 className="font-display text-xl font-semibold text-white">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-200/75">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-white/[0.05] bg-ink-900/20">
        <Container width="md">
          <SectionHeading
            eyebrow="Where we are"
            title={<>Grapevine, Texas. DFW. Remote-first across the US.</>}
            description="Our home is in Grapevine, in the heart of the DFW Metroplex. We work in person when it serves the project and remote-first when it doesn't. Most clients see us weekly — on-site, on Zoom, or both."
          />
        </Container>
      </Section>

      <CTA />
    </>
  );
}
