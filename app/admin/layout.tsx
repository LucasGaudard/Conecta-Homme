import { AppShell } from "@/components/layout/app-shell";
import { adminNavigation } from "@/lib/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navigation={adminNavigation} profile="ADMIN" title="Administracao">
      {children}
    </AppShell>
  );
}
