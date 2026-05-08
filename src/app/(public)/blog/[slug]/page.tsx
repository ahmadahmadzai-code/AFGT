import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section, Eyebrow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { CTA } from "@/components/sections/cta";
import { prisma } from "@/lib/prisma";
import { formatDate, readingTime } from "@/lib/utils";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post || post.status !== "PUBLISHED") return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { name: true } } },
  });
  if (!post || post.status !== "PUBLISHED") notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Person", name: post.author.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Section pad="lg" className="overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <Container width="md">
          <Eyebrow>Article</Eyebrow>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {post.tags.map((t) => (
              <Badge key={t} tone="neutral">{t}</Badge>
            ))}
          </div>
          <h1 className="mt-5 font-display text-display-lg text-balance glow-text">
            {post.title}
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200/85">
            {post.excerpt}
          </p>
          <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-300/70">
            <span>{post.author.name}</span>
            <span className="h-1 w-1 rounded-full bg-mint/50" />
            <span>{formatDate(post.publishedAt)}</span>
            <span className="h-1 w-1 rounded-full bg-mint/50" />
            <span>{readingTime(post.body)} min read</span>
          </div>
        </Container>
      </Section>

      <Section pad="sm">
        <Container width="md">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container width="sm">
          <article
            className="prose-invert-mint prose-lg"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </Container>
      </Section>

      <CTA />
    </>
  );
}
