# Conecta Homme

Sistema web full stack de gestao de condominio para administracao, portaria e moradores. O projeto centraliza unidades, moradores, visitantes, encomendas, QR Code, controle de acesso e relatorios.

## Arquitetura

- Aplicacao unica em Next.js App Router.
- Server Components para leitura de dados.
- Server Actions e Route Handlers para operacoes sensiveis.
- Middleware de protecao por perfil.
- Prisma Client acessando PostgreSQL.
- Deploy recomendado: Vercel + Neon PostgreSQL.
- Nao existe backend separado.

## Tecnologias

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Prisma
- PostgreSQL Neon
- Zod
- React Hook Form
- TanStack Query
- React Table
- Recharts
- Lucide Icons
- bcrypt
- qrcode.react
- Cookies httpOnly

## Funcionalidades

- Autenticacao real com email ou username.
- Senhas criptografadas com bcrypt.
- Sessao em cookie httpOnly.
- Protecao por perfil via middleware.
- Dashboard administrativo.
- Gestao de unidades e moradores.
- Painel da portaria.
- Registro manual de acessos.
- Area do morador isolada por unidade.
- Visitantes e autorizacoes.
- QR Code permanente do morador.
- QR Code temporario para visitante.
- Validacao de QR Code pela portaria.
- Encomendas para portaria, morador e admin.
- Relatorios administrativos com filtros, tabelas e graficos.

## Perfis do Sistema

### Admin

- Acessa `/admin`.
- Gerencia unidades e moradores.
- Visualiza encomendas.
- Visualiza relatorios.

### Portaria

- Acessa `/portaria`.
- Busca unidades.
- Visualiza status de presenca.
- Registra entrada e saida manual.
- Valida QR Code.
- Cadastra e entrega encomendas.

### Morador

- Acessa `/morador`.
- Visualiza apenas a propria unidade.
- Altera status da residencia.
- Cadastra visitantes.
- Gera QR Code.
- Consulta encomendas e acessos.
- Atualiza configuracoes permitidas.

## Estrutura do Projeto

```text
app/                 Rotas App Router
components/          Componentes de UI e modulos
lib/                 Auth, Prisma, queries, actions e validacoes
prisma/              Schema, migrations e seed
docs/                Documentacao operacional
```

## Variaveis de Ambiente

Crie `.env` a partir de `.env.example`.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="https://your-production-domain.vercel.app"
```

Nunca versione valores reais. O arquivo `.env` ja esta no `.gitignore`.

## Como Rodar Localmente

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Banco Neon

1. Crie um projeto no Neon.
2. Crie ou selecione um database PostgreSQL.
3. Copie a connection string.
4. Configure `DATABASE_URL` no `.env` local e na Vercel.
5. Use SSL conforme a connection string fornecida pelo Neon.

## Migrations

Desenvolvimento:

```bash
npm run prisma:migrate -- --name nome_da_migration
```

Producao:

```bash
npm run prisma:deploy
```

## Seed

```bash
npm run prisma:seed
```

O seed cria usuarios de teste e uma unidade inicial.

## Deploy na Vercel

1. Suba o projeto para um repositorio GitHub.
2. Importe o repositorio na Vercel.
3. Configure as variaveis:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. Rode as migrations de producao:

```bash
npm run prisma:deploy
```

5. Rode seed se for ambiente de teste/homologacao:

```bash
npm run prisma:seed
```

6. Publique o projeto.

Detalhes completos em `docs/DEPLOY.md`.

## Comandos Principais

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:studio
npm run prisma:seed
```

## Credenciais de Teste

Admin:

```text
admin@conectahomme.com
admin123
```

Portaria:

```text
portaria@conectahomme.com
portaria123
```

Morador:

```text
morador@conectahomme.com
morador123
```

ou:

```text
a201
morador123
```

## Status Atual

Projeto preparado para publicacao em Vercel com banco PostgreSQL Neon. Antes de producao real, troque credenciais de teste, configure `AUTH_SECRET` forte e execute a checklist manual em `docs/TESTING.md`.
