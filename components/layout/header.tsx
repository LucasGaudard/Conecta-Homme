import { ChevronRight, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { AvatarInitial } from "@/components/ui/avatar";
import { SubmitButton } from "@/components/ui/submit-button";
import { getNotificationHeaderData } from "@/lib/notifications/queries";

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

export async function Header({ profile, title, user }: HeaderProps) {
  const notificationData = await getNotificationHeaderData(profile);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-14 items-center justify-between gap-3 px-4 py-2.5 sm:min-h-16 sm:px-6 sm:py-3 lg:px-8">
        <div className="min-w-0">
          <div className="mb-0.5 hidden items-center gap-1.5 text-xs font-medium text-slate-500 sm:flex">
            <span>{profileLabels[profile]}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-slate-600">{title}</span>
          </div>
          <h1 className="truncate text-base font-semibold tracking-normal text-navy-950 sm:text-xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell
            latest={notificationData.latest}
            route={notificationData.route}
            unreadCount={notificationData.unreadCount}
          />
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
            <SubmitButton variant="outline" size="sm" pendingLabel="Saindo...">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </SubmitButton>
          </form>
        </div>
      </div>
    </header>
  );
}
