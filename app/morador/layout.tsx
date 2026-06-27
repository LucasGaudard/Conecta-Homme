import { AppShell } from "@/components/layout/app-shell";
import { residentNavigation } from "@/lib/navigation";

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navigation={residentNavigation} profile="RESIDENT" title="Morador">
      {children}
    </AppShell>
  );
}
