import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/current-user";

type HeaderProps = {
  profile: "ADMIN" | "PORTER" | "RESIDENT";
  title: string;
};

export async function Header({ profile, title }: HeaderProps) {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold text-navy-950">{title}</h1>
          <p className="text-sm text-slate-500">Perfil {profile}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-md px-2 py-1 text-right sm:flex">
            <UserCircle className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-navy-950">
                {user?.name ?? "Usuario"}
              </p>
              <p className="text-xs text-slate-500">{user?.email ?? profile}</p>
            </div>
          </div>
          <form action="/api/auth/logout" method="post">
            <Button variant="outline" size="sm" type="submit">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
