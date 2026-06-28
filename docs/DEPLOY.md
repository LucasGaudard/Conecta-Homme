# Deploy em Producao - Conecta Homme

Este guia prepara o Conecta Homme para Vercel + Neon PostgreSQL.

## 1. Criar Projeto no Neon

1. Acesse o painel do Neon.
2. Crie um novo projeto PostgreSQL.
3. Crie ou selecione o database que sera usado pelo Conecta Homme.
4. Copie a connection string do banco.
5. Garanta que a URL usa SSL quando indicado pelo Neon.

Exemplo de formato:

```text
postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

Nunca commite a URL real.

## 2. Configurar Variaveis Locais

Crie `.env` a partir de `.env.example`.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Gere um `AUTH_SECRET` longo e aleatorio.

## 3. Validar Localmente

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run lint
npm run build
```

## 4. Criar Projeto na Vercel

1. Suba o projeto para o GitHub.
2. No painel da Vercel, clique em `Add New Project`.
3. Importe o repositorio.
4. Framework: Next.js.
5. Build command: `npm run build`.
6. Install command: `npm install`.

## 5. Configurar Variaveis na Vercel

Adicione em Project Settings > Environment Variables:

```text
DATABASE_URL
AUTH_SECRET
NEXT_PUBLIC_APP_URL
```

Use valores diferentes por ambiente quando necessario:

- Production
- Preview
- Development

## 6. Executar Build

A Vercel executa:

```bash
npm install
npm run build
```

O projeto usa Prisma Client; se necessario, rode manualmente:

```bash
npm run prisma:generate
```

## 7. Executar Migrations em Producao

Use o comando de deploy de migrations:

```bash
npm run prisma:deploy
```

Esse comando usa `prisma migrate deploy` e aplica migrations existentes sem criar novas migrations.

## 8. Executar Seed Opcional

Use seed apenas em ambiente de teste, homologacao ou primeira validacao controlada:

```bash
npm run prisma:seed
```

Em producao real, troque ou remova credenciais de teste depois da validacao.

## 9. Testar Login

Teste:

- Admin
- Portaria
- Morador
- Logout
- Bloqueio por perfil

## 10. Testar Admin

1. Acesse `/admin`.
2. Confira dashboard.
3. Acesse `/admin/unidades`.
4. Acesse `/admin/encomendas`.
5. Acesse `/admin/relatorios`.

## 11. Testar Portaria

1. Acesse `/portaria`.
2. Busque uma unidade.
3. Registre entrada e saida manual.
4. Acesse `/portaria/encomendas`.

## 12. Testar Morador

1. Acesse `/morador`.
2. Altere status da residencia.
3. Acesse visitantes, encomendas, acessos e configuracoes.

## 13. Testar QR Code

1. Como morador, acesse `/morador/qrcode`.
2. Gere QR Code permanente.
3. Gere QR Code temporario para visitante.
4. Como portaria, acesse `/portaria/validar-qr`.
5. Valide token e registre entrada/saida.

## 14. Testar Encomendas

1. Como portaria, cadastre encomenda.
2. Marque como entregue.
3. Como morador, confira `/morador/encomendas`.
4. Como admin, confira `/admin/encomendas`.

## 15. Testar Relatorios

1. Como admin, acesse `/admin/relatorios`.
2. Filtre por periodo.
3. Filtre acessos por tipo e metodo.
4. Filtre encomendas por status.
5. Filtre visitantes por status.
6. Confira cards, graficos e tabelas.

## Problemas Comuns

### DATABASE_URL invalida

Sintomas:

- Prisma nao conecta.
- Build ou rota server-side falha ao consultar banco.

Verifique:

- Usuario, senha, host e database.
- Parametros de SSL.
- Se a variavel foi configurada no ambiente correto da Vercel.

### AUTH_SECRET ausente

Em producao, `AUTH_SECRET` e obrigatorio. Configure um valor longo e aleatorio na Vercel.

### Migration pendente

Se o banco nao tem tabelas ou colunas esperadas:

```bash
npm run prisma:deploy
```

### Build falhando

Rode localmente:

```bash
npm run lint
npm run build
```

Confira tambem se `DATABASE_URL` e `AUTH_SECRET` existem no ambiente de build.

### Erro Prisma Client

Rode:

```bash
npm run prisma:generate
```

Na Vercel, confira se dependencias foram instaladas corretamente.

### Seed duplicado

O seed usa `upsert` para usuarios principais, mas deve ser usado com cuidado em producao real. Prefira rodar em homologacao ou trocar credenciais imediatamente.

## Checklist Final

- `.env` nao versionado.
- Variaveis configuradas na Vercel.
- Migrations aplicadas.
- Build passando.
- Login testado.
- Perfis testados.
- QR Code testado.
- Encomendas testadas.
- Relatorios testados.
