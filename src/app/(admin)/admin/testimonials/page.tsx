import { AdminShell } from "@/components/layout/admin-shell";
import { TestimonialsManager } from "@/features/admin/tables/testimonials-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return (
    <AdminShell title="Testimonials" description="What clients say. Featured ones rotate on the homepage.">
      <TestimonialsManager initial={testimonials} />
    </AdminShell>
  );
}
