"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Building2, DollarSign, Loader2, AlertCircle } from "lucide-react";
import type { ContactSubmission, SubmissionStatus } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";

interface Props { initial: ContactSubmission[] }

const tones: Record<SubmissionStatus, "mint" | "warning" | "neutral"> = {
  NEW: "mint",
  CONTACTED: "warning",
  CLOSED: "neutral",
};

export function SubmissionsInbox({ initial }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<ContactSubmission | null>(null);
  const [status, setStatus] = useState<SubmissionStatus>("NEW");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const open = (s: ContactSubmission) => {
    setActive(s);
    setStatus(s.status);
    setNotes(s.notes ?? "");
    setError("");
  };
  const close = () => setActive(null);

  const save = async () => {
    if (!active) return;
    setSaving(true);
    setError("");
    try {
      await api.patch(`/api/admin/submissions/${active.id}`, { status, notes });
      router.refresh();
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-[0.18em] text-ink-300/70">
            <tr>
              <th className="px-5 py-3">From</th>
              <th className="px-5 py-3">Company</th>
              <th className="px-5 py-3">Budget</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {initial.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-ink-300/70">Inbox is empty.</td></tr>
            ) : (
              initial.map((s) => (
                <tr key={s.id} onClick={() => open(s)} className="cursor-pointer border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03]">
                  <td className="px-5 py-3">
                    <div className="font-medium text-white">{s.name}</div>
                    <div className="text-xs text-ink-300/70">{s.email}</div>
                  </td>
                  <td className="px-5 py-3 text-ink-100">{s.company ?? "—"}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-200">{s.budget ?? "—"}</td>
                  <td className="px-5 py-3"><Badge tone={tones[s.status]}>{s.status}</Badge></td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-300/70">{formatDate(s.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <Drawer open={!!active} onClose={close} title={active ? `${active.name}` : ""}>
        {active ? (
          <div className="space-y-6">
            <div className="space-y-2 rounded-xl border border-white/10 bg-ink-900/40 p-4 text-sm">
              <div className="flex items-center gap-2 text-ink-100">
                <Mail className="h-4 w-4 text-mint" />
                <a href={`mailto:${active.email}`} className="hover:text-mint">{active.email}</a>
              </div>
              {active.company ? (
                <div className="flex items-center gap-2 text-ink-100">
                  <Building2 className="h-4 w-4 text-mint" /> {active.company}
                </div>
              ) : null}
              {active.budget ? (
                <div className="flex items-center gap-2 text-ink-100">
                  <DollarSign className="h-4 w-4 text-mint" /> {active.budget}
                </div>
              ) : null}
              <div className="font-mono text-xs text-ink-300/70">Received {formatDate(active.createdAt)}</div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-300/70">Message</h3>
              <p className="whitespace-pre-wrap rounded-xl border border-white/10 bg-ink-900/40 p-4 text-sm text-ink-100">{active.message}</p>
            </div>

            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value as SubmissionStatus)}>
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="CLOSED">CLOSED</option>
              </Select>
            </Field>
            <Field label="Internal notes" hint="Visible only to admins">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} />
            </Field>

            {error ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none" /><span>{error}</span>
              </div>
            ) : null}

            <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-5">
              <Button variant="secondary" onClick={close}>Close</Button>
              <Button onClick={save} loading={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save changes
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
