import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, Eyebrow } from "@/components/ui/section";
import { ContactForm } from "@/features/contact/contact-form";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about the platform you're trying to ship. We'll come back with a plan within 48 hours.",
};

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <Section pad="lg" className="overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      <Container>
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-6 font-display text-display-lg text-balance">
              <span className="glow-text">Tell us what you're</span>{" "}
              <span className="gradient-text">trying to ship.</span>
            </h1>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-ink-200/85">
              Send us the outcome you need, the constraint you're stuck on,
              and the deadline staring at you. A real engineer reads every
              message and replies within a business day.
            </p>

            <ul className="mt-10 space-y-5 text-sm text-ink-100">
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint/10 text-mint ring-1 ring-mint/20">
                  <Mail className="h-4 w-4" />
                </span>
                <a
                  href={`mailto:${settings?.email ?? "hello@afgtech.com"}`}
                  className="hover:text-mint"
                >
                  {settings?.email ?? "hello@afgtech.com"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint/10 text-mint ring-1 ring-mint/20">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>{settings?.address ?? "Grapevine, TX 76051"}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint/10 text-mint ring-1 ring-mint/20">
                  <Clock className="h-4 w-4" />
                </span>
                <span>Mon – Fri · 9 AM to 6 PM CT</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur-xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
