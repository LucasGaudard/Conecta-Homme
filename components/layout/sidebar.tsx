import { Building2, LogOut } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AvatarInitial } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { NavigationItem } from "@/lib/navigation";

type SidebarProps = {
  navigation: NavigationItem[];
  profile: "ADMIN" | "PORTER" | "RESIDENT";
  user?: {
    email?: string | null;
    name?: string | null;
  } | null;
};

const profileLabels = {
  ADMIN: "Administrador",
  PORTER: "Portaria",
  RESIDENT: "Morador",
};

export function Sidebar({ navigation, profile, user }: SidebarProps) {
  return (
    <aside className="border-b border-white/10 bg-navy-950 text-white shadow-elevated lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:border-b-0">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-navy-950 shadow-soft">
            <Building2 className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-normal">
              Conecta Homme
            </p>
            <p className="text-xs font-medium text-blue-100">Gestao condominial</p>
          </div>
        </div>

        <div className="border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3">
            <AvatarInitial name={user?.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user?.name ?? "Usuario"}
              </p>
              <p className="truncate text-xs text-blue-100">
                {profileLabels[profile]}
              </p>
            </div>
          </div>
        </div>

        <SidebarNav navigation={navigation} />

        <div className="mt-auto hidden border-t border-white/10 p-4 lg:block">
          <form action="/api/auth/logout" method="post">
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-blue-100 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
