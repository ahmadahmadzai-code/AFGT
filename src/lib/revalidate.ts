import { revalidatePath } from "next/cache";

export function revalidatePublicPaths(paths: string[]): void {
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      // no-op: revalidatePath is best-effort during local dev / build
    }
  }
}
