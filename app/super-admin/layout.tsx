import { AppShell } from "@/components/layout/app-shell";
import { superAdminNavigation } from "@/lib/navigation";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      navigation={superAdminNavigation}
      profile="SUPER_ADMIN"
      title="Super Admin"
    >
      {children}
    </AppShell>
  );
}
