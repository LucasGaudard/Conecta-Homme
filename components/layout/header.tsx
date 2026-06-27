import Link from "next/link";
import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  profile: "ADMIN" | "PORTER" | "RESIDENT";
  title: string;
};

export function Header({ profile, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold text-navy-950">{title}</h1>
          <p className="text-sm text-slate-500">Perfil {profile}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Usuario">
            <UserCircle className="h-5 w-5" />
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">
              <LogOut className="h-4 w-4" />
              Sair
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
