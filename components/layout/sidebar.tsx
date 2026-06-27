import Link from "next/link";
import { Building2 } from "lucide-react";
import type { NavigationItem } from "@/lib/navigation";

type SidebarProps = {
  navigation: NavigationItem[];
  profile: "ADMIN" | "PORTER" | "RESIDENT";
};

export function Sidebar({ navigation, profile }: SidebarProps) {
  return (
    <aside className="border-b border-white/10 bg-navy-950 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:border-b-0">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 px-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-navy-950">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Conecta Homme</p>
            <p className="text-xs font-medium text-blue-100">{profile}</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible lg:py-5">
          {navigation.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex min-w-max items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-blue-50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
