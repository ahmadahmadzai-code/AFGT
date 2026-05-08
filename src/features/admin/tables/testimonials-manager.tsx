"use client";

import { useState } from "react";
import { Plus, Edit3, Star } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/drawer";
import { TestimonialForm } from "@/features/admin/editors/testimonial-form";

interface Props { initial: Testimonial[] }

export function TestimonialsManager({ initial }: Props) {
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> New testimonial
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {initial.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3 p-12 text-center text-ink-300/70">
            No testimonials yet.
          </Card>
        ) : (
          initial.map((t) => (
            <Card key={t.id} className="flex flex-col p-6">
              <div className="flex items-center gap-1 text-mint">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-100">"{t.quote}"</p>
              <div className="mt-4 border-t border-white/5 pt-4">
                <div className="text-sm font-semibold text-white">{t.author}</div>
                <div className="text-xs text-ink-300/70">{t.role} · {t.company}</div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                {t.featured ? <Badge tone="mint">Featured</Badge> : <Badge tone="neutral">Standard</Badge>}
                <button
                  type="button"
                  onClick={() => setEditing(t)}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-mint hover:bg-mint/10"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Drawer open={creating} onClose={() => setCreating(false)} title="New testimonial">
        <TestimonialForm onClose={() => setCreating(false)} />
      </Drawer>
      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing ? `Edit · ${editing.author}` : ""}>
        {editing ? <TestimonialForm initial={editing} onClose={() => setEditing(null)} /> : null}
      </Drawer>
    </>
  );
}
