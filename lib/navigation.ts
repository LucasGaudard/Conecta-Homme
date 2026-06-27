import {
  BarChart3,
  Boxes,
  Building2,
  Home,
  Package,
  QrCode,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Unidades", href: "/admin/unidades", icon: Building2 },
  { title: "Moradores", href: "/admin/unidades", icon: Users },
  { title: "Relatorios", href: "/admin", icon: BarChart3 },
  { title: "Condominio", href: "/admin/unidades", icon: Building2 },
];

export const porterNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/portaria", icon: Home },
  { title: "Visitantes", href: "/portaria", icon: Users },
  { title: "Encomendas", href: "/portaria", icon: Package },
  { title: "QR Code", href: "/portaria", icon: QrCode },
];

export const residentNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/morador", icon: Home },
  { title: "Acessos", href: "/morador", icon: ShieldCheck },
  { title: "Encomendas", href: "/morador", icon: Package },
  { title: "Servicos", href: "/morador", icon: Boxes },
];
