import { ChevronDown, LogOut, Menu } from "lucide-react";
import { CondotechBrand } from "@/components/brand/condotech-brand";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AvatarInitial } from "@/components/ui/avatar";
import { SubmitButton } from "@/components/ui/submit-button";
import type { UserRole } from "@prisma/client";
import type { NavigationItem } from "@/lib/navigation";

type SidebarProps = {
  navigation: NavigationItem[];
  profile: UserRole;
  user?: {
    email?: string | null;
    name?: string | null;
  } | null;
};

const profileLabels = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrador",
  PORTER: "Portaria",
  RESIDENT: "Morador",
} satisfies Record<UserRole, string>;

export function Sidebar({ navigation, profile, user }: SidebarProps) {
  return (
    <aside className="bg-navy-950 text-white shadow-elevated lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:h-screen lg:w-72">
      <details className="group border-b border-white/10 lg:hidden">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:hidden [&::-webkit-details-marker]:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <CondotechBrand imageClassName="bg-white" showText={false} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">CONDOTECH</p>
              <p className="truncate text-xs text-blue-100">{profileLabels[profile]}</p>
            </div>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-blue-100 transition group-open:bg-white group-open:text-navy-950">
            <Menu className="h-5 w-5 group-open:hidden" />
            <ChevronDown className="hidden h-5 w-5 group-open:block" />
          </span>
        </summary>

        <div className="border-t border-white/10 pt-4">
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3">
              <AvatarInitial name={user?.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.name ?? "Usuário"}
                </p>
                <p className="truncate text-xs text-blue-100">
                  {user?.email ?? profileLabels[profile]}
                </p>
              </div>
            </div>
          </div>
          <SidebarNav layout="mobile" navigation={navigation} />
          <div className="border-t border-white/10 p-4">
            <form action="/api/auth/logout" method="post">
              <SubmitButton
                variant="ghost"
                className="h-11 w-full justify-start text-blue-100 hover:bg-white/10 hover:text-white"
                pendingLabel="Saindo..."
              >
                <LogOut className="h-4 w-4" />
                Sair
              </SubmitButton>
            </form>
          </div>
        </div>
      </details>

      <div className="hidden h-full min-h-0 flex-col lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <CondotechBrand imageClassName="bg-white" showText={false} />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-normal">
              CONDOTECH
            </p>
            <p className="text-xs font-medium text-blue-100">Gestão inteligente</p>
          </div>
        </div>

        <div className="border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3">
            <AvatarInitial name={user?.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user?.name ?? "Usuário"}
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
            <SubmitButton
              variant="ghost"
              className="w-full justify-start text-blue-100 hover:bg-white/10 hover:text-white"
              pendingLabel="Saindo..."
            >
              <LogOut className="h-4 w-4" />
              Sair
            </SubmitButton>
          </form>
        </div>
      </div>
    </aside>
  );
}
