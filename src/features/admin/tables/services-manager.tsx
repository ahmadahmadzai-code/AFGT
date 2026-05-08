"use client";

import { useState } from "react";
import { Plus, Edit3 } from "lucide-react";
import type { Service } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/drawer";
import { ServiceForm } from "@/features/admin/editors/service-form";

interface Props { initial: Service[] }

export function ServicesManager({ initial }: Props) {
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> New service
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-[0.18em] text-ink-300/70">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initial.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-ink-300/70">No services yet.</td></tr>
            ) : (
              initial.map((s) => (
                <tr key={s.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-mono text-xs text-ink-300/70">{s.order}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-white">{s.title}</div>
                    <div className="text-xs text-ink-300/70">{s.shortDesc}</div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-200">/{s.slug}</td>
                  <td className="px-5 py-3">{s.published ? <Badge tone="mint">Published</Badge> : <Badge tone="neutral">Hidden</Badge>}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing(s)}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-mint hover:bg-mint/10"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <Drawer open={creating} onClose={() => setCreating(false)} title="New service" width="xl">
        <ServiceForm onClose={() => setCreating(false)} />
      </Drawer>
      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing ? `Edit · ${editing.title}` : ""} width="xl">
        {editing ? <ServiceForm initial={editing} onClose={() => setEditing(null)} /> : null}
      </Drawer>
    </>
  );
}
