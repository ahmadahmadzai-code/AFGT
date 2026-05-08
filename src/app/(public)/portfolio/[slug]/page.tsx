import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section, Eyebrow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { CTA } from "@/components/sections/cta";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project || !project.published) notFound();

  return (
    <>
      <Section pad="lg" className="overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <Container>
          <Eyebrow>Case study</Eyebrow>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge tone="mint">{project.industry}</Badge>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-300/70">
              {project.year}
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-display-lg text-balance">
            <span className="glow-text">{project.title}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200/85">
            {project.summary}
          </p>
        </Container>
      </Section>

      <Section pad="sm">
        <Container width="lg">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container width="md">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-8">
              <article
                className="prose-invert-mint"
                dangerouslySetInnerHTML={{ __html: project.body }}
              />
            </div>
            <aside className="md:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.025] p-7">
                {project.technologies.length > 0 ? (
                  <>
                    <h3 className="font-display text-lg font-semibold text-white">
                      Technologies
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.map((t) => (
                        <Badge key={t} tone="neutral">{t}</Badge>
                      ))}
                    </div>
                  </>
                ) : null}
                <h3 className="mt-7 font-display text-lg font-semibold text-white">
                  Industry
                </h3>
                <p className="mt-2 text-sm text-ink-200/75">{project.industry}</p>
                <h3 className="mt-7 font-display text-lg font-semibold text-white">
                  Year
                </h3>
                <p className="mt-2 font-mono text-sm text-ink-200/75">
                  {project.year}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {project.gallery.length > 0 ? (
        <Section pad="sm">
          <Container width="lg">
            <div className="grid gap-5 md:grid-cols-2">
              {project.gallery.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                >
                  <Image
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <CTA />
    </>
  );
}
