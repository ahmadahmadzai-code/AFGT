import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section, Eyebrow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate, readingTime } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering, product, and industry essays from the AFG Tech team.",
};

export default async function BlogIndex() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <>
      <Section pad="lg" className="overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <Container>
          <Eyebrow>Writing</Eyebrow>
          <h1 className="mt-6 max-w-4xl font-display text-display-lg text-balance">
            <span className="glow-text">Notes from the build.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200/85">
            Essays from our engineers and product partners on shipping
            production software, leading platform teams, and the industries
            we know best.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          {posts.length === 0 ? (
            <p className="text-ink-200/70">No posts yet — check back soon.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-all duration-300 hover:border-mint/30"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-7">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {p.tags.slice(0, 2).map((t) => (
                        <Badge key={t} tone="neutral">{t}</Badge>
                      ))}
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold text-white">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-200/70">
                      {p.excerpt}
                    </p>
                    <div className="mt-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-300/70">
                      <span>{formatDate(p.publishedAt)}</span>
                      <span className="h-1 w-1 rounded-full bg-mint/50" />
                      <span>{readingTime(p.body)} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
