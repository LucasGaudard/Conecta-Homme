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
  { title: "Encomendas", href: "/admin/encomendas", icon: Package },
  { title: "Moradores", href: "/admin/unidades", icon: Users },
  { title: "Relatorios", href: "/admin/relatorios", icon: BarChart3 },
  { title: "Condominio", href: "/admin/unidades", icon: Building2 },
];

export const porterNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/portaria", icon: Home },
  { title: "Visitantes", href: "/portaria", icon: Users },
  { title: "Encomendas", href: "/portaria/encomendas", icon: Package },
  { title: "Validar QR Code", href: "/portaria/validar-qr", icon: QrCode },
];

export const residentNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/morador", icon: Home },
  { title: "Meu QR Code", href: "/morador/qrcode", icon: QrCode },
  { title: "Visitantes", href: "/morador/visitantes", icon: Users },
  { title: "Encomendas", href: "/morador/encomendas", icon: Package },
  { title: "Acessos", href: "/morador/acessos", icon: ShieldCheck },
  { title: "Configuracoes", href: "/morador/configuracoes", icon: Boxes },
];
