import { AppShell } from "@/components/layout/app-shell";
import { porterNavigation } from "@/lib/navigation";

export default function PorterLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navigation={porterNavigation} profile="PORTER" title="Portaria">
      {children}
    </AppShell>
  );
}
