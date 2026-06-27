import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { NavigationItem } from "@/lib/navigation";

type AppShellProps = {
  children: React.ReactNode;
  navigation: NavigationItem[];
  profile: "ADMIN" | "PORTER" | "RESIDENT";
  title: string;
};

export function AppShell({ children, navigation, profile, title }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar navigation={navigation} profile={profile} />
      <div className="min-h-screen lg:pl-72">
        <Header title={title} profile={profile} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
