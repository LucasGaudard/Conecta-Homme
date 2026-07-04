# Conecta Homme

## PWA

O Conecta Homme pode ser instalado na tela inicial em Android, iOS e desktop. A implementacao usa manifest, icones proprios e service worker conservador para assets estaticos, sem cache de paginas autenticadas ou APIs privadas.

Conecta Homme Ã© um sistema web de gestÃ£o condominial criado para centralizar a rotina de administraÃ§Ã£o, portaria e moradores em uma experiÃªncia moderna, responsiva e segura.

O produto cobre desde o controle de unidades e moradores atÃ© visitantes, QR Code, encomendas, relatÃ³rios, notificaÃ§Ãµes, auditoria e exportaÃ§Ã£o administrativa de dados.

## Destaques

- Interface premium com experiÃªncia responsiva para desktop, tablet e mobile.
- AutenticaÃ§Ã£o real com sessÃµes seguras em cookie httpOnly.
- Perfis separados para Administrador, Portaria e Morador.
- Dashboards com indicadores reais do banco.
- Fluxos completos de visitantes, QR Code e controle de acesso.
- Controle de encomendas com notificaÃ§Ãµes ao morador.
- RelatÃ³rios administrativos com filtros, grÃ¡ficos e exportaÃ§Ã£o CSV.
- Central de notificaÃ§Ãµes persistidas.
- ConfiguraÃ§Ãµes de conta e do condomÃ­nio.
- Auditoria administrativa de aÃ§Ãµes importantes.

## Perfis

### Admin

- Gerencia unidades e moradores.
- Consulta encomendas e relatÃ³rios.
- Configura dados do condomÃ­nio.
- Acompanha auditoria e exporta dados administrativos.

### Portaria

- Busca unidades rapidamente.
- Consulta status de presenÃ§a.
- Registra entrada e saÃ­da manual.
- Valida QR Code.
- Cadastra e entrega encomendas.

### Morador

- Acompanha dados da prÃ³pria unidade.
- Atualiza status da residÃªncia.
- Autoriza visitantes.
- Gera QR Code permanente e temporÃ¡rio.
- Consulta encomendas, acessos e notificaÃ§Ãµes.
- Atualiza dados da conta.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Componentes no estilo shadcn/ui
- Prisma ORM
- PostgreSQL
- Server Actions
- Route Handlers
- bcrypt
- Cookies httpOnly
- Recharts
- qrcode.react

## MÃ³dulos Principais

- Login e proteÃ§Ã£o por perfil.
- Dashboard Admin, Portaria e Morador.
- GestÃ£o de unidades.
- GestÃ£o de moradores vinculados.
- Visitantes e autorizaÃ§Ãµes.
- QR Code permanente e temporÃ¡rio.
- ValidaÃ§Ã£o de QR pela portaria.
- Controle de acessos.
- Controle de encomendas.
- NotificaÃ§Ãµes.
- ConfiguraÃ§Ãµes da conta.
- ConfiguraÃ§Ãµes do condomÃ­nio.
- Auditoria.
- RelatÃ³rios e exportaÃ§Ã£o CSV.

## Estrutura

```text
app/          Rotas, layouts e Route Handlers
components/   Componentes reutilizÃ¡veis e mÃ³dulos de interface
lib/          Auth, Prisma, queries, actions, validaÃ§Ãµes e utilitÃ¡rios
prisma/       Schema, migrations e seed
docs/         Guias operacionais
```

## ExecuÃ§Ã£o Local

Configure as variÃ¡veis de ambiente local a partir do arquivo de exemplo do projeto e use um banco PostgreSQL compatÃ­vel.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

AplicaÃ§Ã£o local:

```text
http://localhost:3000
```

## Qualidade

Antes de publicar ou apresentar:

```bash
npm run lint
npm run build
```

Checklist manual completo:

```text
docs/TESTING.md
```

Guia de deploy:

```text
docs/DEPLOY.md
```

## Roadmap

### V1.2

- ExportaÃ§Ã£o XLSX e PDF.
- Melhorias de busca global.
- PreferÃªncias de notificaÃ§Ã£o.
- Upload real de avatar e logo.
- Mais filtros analÃ­ticos para relatÃ³rios.
- Melhorias de acessibilidade com testes automatizados.

### V2.0

- Modelo multi-condomÃ­nio.
- Arquitetura SaaS com isolamento por tenant.
- Planos, assinatura e gestÃ£o comercial.
- Painel master para operadores da plataforma.
- Convites e onboarding automatizado de condomÃ­nios.
- APIs externas para integraÃ§Ãµes com portaria remota e dispositivos.

## Status

Conecta Homme V1.1 estÃ¡ preparado para validaÃ§Ã£o final, deploy e apresentaÃ§Ã£o em portfÃ³lio.
