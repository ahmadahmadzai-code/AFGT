import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Industries } from "@/components/sections/industries";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 60;

export default async function HomePage() {
  const [services, industries, testimonials] = await Promise.all([
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 6,
      select: { id: true, slug: true, title: true, icon: true, shortDesc: true },
    }),
    prisma.industry.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
  ]);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    foundingDate: String(siteConfig.founded),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Grapevine",
      addressRegion: "TX",
      addressCountry: "US",
    },
    knowsAbout: siteConfig.industries,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Hero />
      <Stats />
      <ServicesGrid services={services} />
      <Industries industries={industries} />
      <Process />
      <Testimonials testimonials={testimonials} />
      <CTA />
    </>
  );
}
