# Conecta Homme

Conecta Homme é um sistema web de gestão condominial criado para centralizar a rotina de administração, portaria e moradores em uma experiência moderna, responsiva e segura.

O produto cobre desde o controle de unidades e moradores até visitantes, QR Code, encomendas, relatórios, notificações, auditoria e exportação administrativa de dados.

## Destaques

- Interface premium com experiência responsiva para desktop, tablet e mobile.
- Autenticação real com sessões seguras em cookie httpOnly.
- Perfis separados para Administrador, Portaria e Morador.
- Dashboards com indicadores reais do banco.
- Fluxos completos de visitantes, QR Code e controle de acesso.
- Controle de encomendas com notificações ao morador.
- Relatórios administrativos com filtros, gráficos e exportação CSV.
- Central de notificações persistidas.
- Configurações de conta e do condomínio.
- Auditoria administrativa de ações importantes.

## Perfis

### Admin

- Gerencia unidades e moradores.
- Consulta encomendas e relatórios.
- Configura dados do condomínio.
- Acompanha auditoria e exporta dados administrativos.

### Portaria

- Busca unidades rapidamente.
- Consulta status de presença.
- Registra entrada e saída manual.
- Valida QR Code.
- Cadastra e entrega encomendas.

### Morador

- Acompanha dados da própria unidade.
- Atualiza status da residência.
- Autoriza visitantes.
- Gera QR Code permanente e temporário.
- Consulta encomendas, acessos e notificações.
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

## Módulos Principais

- Login e proteção por perfil.
- Dashboard Admin, Portaria e Morador.
- Gestão de unidades.
- Gestão de moradores vinculados.
- Visitantes e autorizações.
- QR Code permanente e temporário.
- Validação de QR pela portaria.
- Controle de acessos.
- Controle de encomendas.
- Notificações.
- Configurações da conta.
- Configurações do condomínio.
- Auditoria.
- Relatórios e exportação CSV.

## Estrutura

```text
app/          Rotas, layouts e Route Handlers
components/   Componentes reutilizáveis e módulos de interface
lib/          Auth, Prisma, queries, actions, validações e utilitários
prisma/       Schema, migrations e seed
docs/         Guias operacionais
```

## Execução Local

Configure as variáveis de ambiente local a partir do arquivo de exemplo do projeto e use um banco PostgreSQL compatível.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Aplicação local:

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

- Exportação XLSX e PDF.
- Melhorias de busca global.
- Preferências de notificação.
- Upload real de avatar e logo.
- Mais filtros analíticos para relatórios.
- Melhorias de acessibilidade com testes automatizados.

### V2.0

- Modelo multi-condomínio.
- Arquitetura SaaS com isolamento por tenant.
- Planos, assinatura e gestão comercial.
- Painel master para operadores da plataforma.
- Convites e onboarding automatizado de condomínios.
- APIs externas para integrações com portaria remota e dispositivos.

## Status

Conecta Homme V1.1 está preparado para validação final, deploy e apresentação em portfólio.
