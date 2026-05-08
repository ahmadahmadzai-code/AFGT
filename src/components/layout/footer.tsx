import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/5 bg-ink-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent" />
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/10 ring-1 ring-mint/30">
                <span className="font-display text-sm font-bold text-mint">AF</span>
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                AFG Tech
              </span>
            </Link>
            <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-ink-200/70">
              {siteConfig.description}
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-mint/80">
              Grapevine, TX · DFW Metroplex · Est. {siteConfig.founded}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-ink-300/70">
              Company
            </p>
            <ul className="space-y-2.5 text-sm text-ink-100">
              <li><Link href="/about" className="hover:text-mint">About</Link></li>
              <li><Link href="/services" className="hover:text-mint">Services</Link></li>
              <li><Link href="/portfolio" className="hover:text-mint">Portfolio</Link></li>
              <li><Link href="/blog" className="hover:text-mint">Blog</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-ink-300/70">
              Industries
            </p>
            <ul className="space-y-2.5 text-sm text-ink-100">
              {siteConfig.industries.map((i) => (
                <li key={i}>
                  <Link href="/services" className="hover:text-mint">
                    {i}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-ink-300/70">
              Contact
            </p>
            <ul className="space-y-2.5 text-sm text-ink-100">
              <li><Link href="/contact" className="hover:text-mint">Start a project</Link></li>
              <li>
                <a href="mailto:hello@afgtech.com" className="hover:text-mint">
                  hello@afgtech.com
                </a>
              </li>
              <li className="font-mono text-xs text-ink-300/80">Grapevine, TX 76051</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/5 py-6 text-xs text-ink-300/70 md:flex-row md:items-center">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.18em]">
            Built with Next.js · Hosted on Vercel
          </p>
        </div>
      </Container>
    </footer>
  );
}
