export type NavigationIcon =
  | "audit"
  | "bell"
  | "building"
  | "chart"
  | "home"
  | "package"
  | "qrcode"
  | "settings"
  | "shield"
  | "users";

export type NavigationItem = {
  title: string;
  href: string;
  icon: NavigationIcon;
};

export const adminNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/admin", icon: "home" },
  { title: "Unidades", href: "/admin/unidades", icon: "building" },
  { title: "Encomendas", href: "/admin/encomendas", icon: "package" },
  { title: "Notificações", href: "/admin/notificacoes", icon: "bell" },
  { title: "Moradores", href: "/admin/unidades", icon: "users" },
  { title: "Relatórios", href: "/admin/relatorios", icon: "chart" },
  { title: "Auditoria", href: "/admin/auditoria", icon: "audit" },
  { title: "Configurações", href: "/admin/configuracoes", icon: "settings" },
  { title: "Condomínio", href: "/admin/condominio", icon: "building" },
];

export const porterNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/portaria", icon: "home" },
  { title: "Visitantes", href: "/portaria", icon: "users" },
  { title: "Encomendas", href: "/portaria/encomendas", icon: "package" },
  { title: "Notificações", href: "/portaria/notificacoes", icon: "bell" },
  { title: "Validar QR Code", href: "/portaria/validar-qr", icon: "qrcode" },
  { title: "Configurações", href: "/portaria/configuracoes", icon: "settings" },
];

export const residentNavigation: NavigationItem[] = [
  { title: "Dashboard", href: "/morador", icon: "home" },
  { title: "Meu QR Code", href: "/morador/qrcode", icon: "qrcode" },
  { title: "Visitantes", href: "/morador/visitantes", icon: "users" },
  { title: "Encomendas", href: "/morador/encomendas", icon: "package" },
  { title: "Acessos", href: "/morador/acessos", icon: "shield" },
  { title: "Notificações", href: "/morador/notificacoes", icon: "bell" },
  { title: "Configurações", href: "/morador/configuracoes", icon: "settings" },
];
