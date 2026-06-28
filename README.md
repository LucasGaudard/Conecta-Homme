# Conecta Homme

Sistema web de gestao de condominio com foco em moradores, portaria, visitantes, encomendas, QR Code, controle de acesso e relatorios administrativos.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Prisma
- PostgreSQL
- Zod
- React Hook Form
- TanStack Query
- React Table
- Recharts
- Lucide Icons
- bcrypt
- Cookies httpOnly para sessao

## Perfis

- `ADMIN`: administracao, unidades, encomendas e relatorios.
- `PORTER`: painel da portaria, validacao de QR Code, acessos e encomendas.
- `RESIDENT`: area do morador, visitantes, encomendas, acessos, configuracoes e QR Code.

## Funcionalidades Implementadas

- Login real com email ou username.
- Senhas criptografadas com bcrypt.
- Sessao segura em cookie httpOnly.
- Middleware de protecao por perfil.
- Dashboard administrativo com dados reais.
- Gestao de unidades e moradores.
- Painel da portaria com busca de unidade e registro manual de acessos.
- Area do morador isolada por unidade.
- QR Code permanente para morador e temporario para visitante.
- Validacao de QR Code pela portaria.
- Modulo de encomendas para portaria, morador e admin.
- Relatorios administrativos com filtros, tabelas e graficos.

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

## Variaveis de Ambiente

Crie um arquivo `.env` baseado em `.env.example`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/conecta_homme?schema=public"
AUTH_SECRET="troque-este-segredo"
```

Em producao, `AUTH_SECRET` deve ser forte e obrigatorio.

## Comandos

Instalar dependencias:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar Prisma Client:

```bash
npm run prisma:generate
```

Rodar migration:

```bash
npm run prisma:migrate -- --name init
```

Rodar seed:

```bash
npm run prisma:seed
```

Build:

```bash
npm run build
```

Prisma Studio:

```bash
npm run prisma:studio
```

## Status Atual

Projeto em fase funcional interna, com modulos principais implementados e checklist manual documentado em `docs/TESTING.md`. Ainda nao ha deploy, exportacao de relatorios, modulo completo de comunicados ou testes automatizados abrangentes.
