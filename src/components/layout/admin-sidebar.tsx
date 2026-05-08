"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Quote,
  Newspaper,
  Inbox,
  Image as ImageIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { label: "Posts", href: "/admin/posts", icon: Newspaper },
  { label: "Inbox", href: "/admin/submissions", icon: Inbox },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/[0.06] px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/10 ring-1 ring-mint/30">
          <span className="font-display text-sm font-bold text-mint">AF</span>
        </span>
        <div className="leading-tight">
          <div className="font-display text-sm font-semibold text-white">AFG Tech</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mint/80">
            CMS · admin
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-mint/10 text-mint ring-1 ring-mint/20"
                  : "text-ink-200 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-200 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
