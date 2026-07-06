# Changelog

## V2.0 - Plataforma Multi-Condominio

Principais entregas:

- Base SaaS multi-condominio com `SUPER_ADMIN` global e tenants isolados.
- Model `Condominium` com status `ACTIVE`, `INACTIVE` e `SUSPENDED`.
- Sessao com `userId`, `role` e `condominiumId`.
- Protecoes de servidor para Super Admin, usuarios tenant e roles por condominio.
- Painel Super Admin com CRUD de condominios e auditoria global.
- Isolamento por `condominiumId` para usuarios, unidades, visitantes, autorizacoes, acessos, QR Codes, encomendas, notificacoes, auditoria, espacos e reservas.
- QR permanente e temporario tenant-scoped, impedindo validacao cruzada entre portarias.
- Encomendas, notificacoes, relatorios, auditoria e exports isolados por tenant.
- Reservas de espacos com constraint PostgreSQL contra sobreposicao por condominio e espaco.
- Configuracoes do condominio migradas da tela administrativa para o proprio model `Condominium`; `CondominiumSettings` permanece apenas como legado de compatibilidade.
- Hardening de conta e actions criticas para validar usuario, tenant e `condominiumId` no servidor.
- Checklist manual V2.0 para QA multi-condominio.

## V1.1 - Release Premium

Principais melhorias:

- Polimento visual completo da interface.
- Responsividade para desktop, tablet e mobile.
- Sidebar responsiva.
- UX premium com skeletons, loading states, toasts e microinterações.
- Componentes reutilizáveis de carregamento e submit.
- Tabelas inteligentes com paginação, ordenação, busca debounce e filtros.
- Dashboards premium para Admin, Portaria e Morador com dados reais do Prisma.
- Central de notificações persistidas.
- Sino de notificações no Header.
- Configurações da conta para usuário logado.
- Configurações administrativas do condomínio.
- Auditoria de ações importantes.
- Exportação CSV para relatórios, encomendas e auditoria.
- Melhorias de acessibilidade e navegação por teclado.
- Documentação revisada para release e portfólio.

## V1.0 - Base Funcional

Principais entregas:

- Login real com sessão em cookie httpOnly.
- Middleware de proteção.
- Autenticação por perfil.
- Roles Admin, Portaria e Morador.
- Dashboard Admin.
- Dashboard Portaria.
- Dashboard Morador.
- Gestão de unidades.
- Gestão de moradores.
- Visitantes e autorizações.
- QR Code permanente do morador.
- QR Code temporário para visitante.
- Validação de QR Code pela portaria.
- Controle de acesso.
- Controle de encomendas.
- Relatórios administrativos.
- Prisma ORM com PostgreSQL.
- Documentação inicial de teste e deploy.
