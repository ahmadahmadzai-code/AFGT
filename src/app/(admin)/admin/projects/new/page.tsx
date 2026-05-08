import { AdminShell } from "@/components/layout/admin-shell";
import { ProjectForm } from "@/features/admin/editors/project-form";

export default function NewProjectPage() {
  return (
    <AdminShell title="New project" description="Create a new portfolio case study.">
      <ProjectForm />
    </AdminShell>
  );
}
