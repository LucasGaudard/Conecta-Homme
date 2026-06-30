"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  layout?: "desktop" | "mobile";
  navigation: NavigationItem[];
};

function isActivePath(pathname: string, href: string) {
  if (href === "/admin" || href === "/portaria" || href === "/morador") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ layout = "desktop", navigation }: SidebarNavProps) {
  const pathname = usePathname();
  const activeIndex = navigation.findIndex((item) => isActivePath(pathname, item.href));

  return (
    <nav
      className={cn(
        "flex gap-2",
        layout === "mobile"
          ? "max-h-[55vh] flex-col overflow-y-auto px-4 pb-4"
          : "overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible lg:px-3 lg:py-4",
      )}
    >
      {navigation.map((item, index) => {
        const active = index === activeIndex;

        return (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "group flex min-w-max items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition duration-200 lg:min-w-0",
              layout === "mobile" && "min-w-0",
              active
                ? "bg-white text-navy-950 shadow-soft"
                : "text-blue-100 hover:bg-white/10 hover:text-white",
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                active
                  ? "bg-navy-50 text-navy-900"
                  : "bg-white/5 text-blue-100 group-hover:bg-white/10 group-hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4" />
            </span>
            <span className="truncate">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
