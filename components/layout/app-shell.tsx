import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth/current-user";
import type { NavigationItem } from "@/lib/navigation";

type AppShellProps = {
  children: React.ReactNode;
  navigation: NavigationItem[];
  profile: "ADMIN" | "PORTER" | "RESIDENT";
  title: string;
};

export async function AppShell({ children, navigation, profile, title }: AppShellProps) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar navigation={navigation} profile={profile} user={user} />
      <div className="min-h-screen lg:pl-72">
        <Header title={title} profile={profile} user={user} />
        <main className="px-4 py-7 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
