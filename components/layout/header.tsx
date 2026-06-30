import { ChevronRight, LogOut } from "lucide-react";
import { AvatarInitial } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  profile: "ADMIN" | "PORTER" | "RESIDENT";
  title: string;
  user?: {
    email?: string | null;
    name?: string | null;
  } | null;
};

const profileLabels = {
  ADMIN: "Admin",
  PORTER: "Portaria",
  RESIDENT: "Morador",
};

export function Header({ profile, title, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>{profileLabels[profile]}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-slate-600">{title}</span>
          </div>
          <h1 className="truncate text-xl font-semibold tracking-normal text-navy-950">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm sm:flex">
            <AvatarInitial
              name={user?.name}
              className="h-8 w-8 border-slate-200 bg-navy-950 text-xs text-white"
            />
            <div className="max-w-48 pr-2 text-right">
              <p className="text-sm font-medium text-navy-950">
                {user?.name ?? "Usuario"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email ?? profileLabels[profile]}
              </p>
            </div>
          </div>
          <form action="/api/auth/logout" method="post">
            <Button variant="outline" size="sm" type="submit">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
