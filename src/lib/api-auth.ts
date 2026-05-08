import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { Role } from "@prisma/client";

export interface AuthedSession {
  user: { id: string; email: string; name: string; role: Role };
}

export async function requireAdminApi(): Promise<
  | { ok: true; session: AuthedSession }
  | { ok: false; response: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return {
    ok: true,
    session: {
      user: {
        id: session.user.id,
        email: session.user.email ?? "",
        name: session.user.name ?? "",
        role: session.user.role,
      },
    },
  };
}
