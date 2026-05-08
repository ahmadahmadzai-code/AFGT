import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { ProjectForm } from "@/features/admin/editors/project-form";
import { prisma } from "@/lib/prisma";

interface PageProps { params: { id: string } }

export default async function EditProjectPage({ params }: PageProps) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();
  return (
    <AdminShell title={project.title} description={`Edit project · /${project.slug}`}>
      <ProjectForm initial={project} />
    </AdminShell>
  );
}
