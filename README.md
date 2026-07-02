# Conecta Homme

Conecta Homme e um sistema web de gestao condominial criado para centralizar a rotina de administracao, portaria e moradores em uma experiencia moderna, responsiva e segura.

O produto cobre desde o controle de unidades e moradores ate visitantes, QR Code, encomendas, relatorios, notificacoes, auditoria e exportacao administrativa de dados.

## Destaques

- Interface premium com experiencia responsiva para desktop, tablet e mobile.
- Autenticacao real com sessoes seguras em cookie httpOnly.
- Perfis separados para Administrador, Portaria e Morador.
- Dashboards com indicadores reais do banco.
- Fluxos completos de visitantes, QR Code e controle de acesso.
- Controle de encomendas com notificacoes ao morador.
- Relatorios administrativos com filtros, graficos e exportacao CSV.
- Central de notificacoes persistidas.
- Configuracoes de conta e do condominio.
- Auditoria administrativa de acoes importantes.

## Perfis

### Admin

- Gerencia unidades e moradores.
- Consulta encomendas e relatorios.
- Configura dados do condominio.
- Acompanha auditoria e exporta dados administrativos.

### Portaria

- Busca unidades rapidamente.
- Consulta status de presenca.
- Registra entrada e saida manual.
- Valida QR Code.
- Cadastra e entrega encomendas.

### Morador

- Acompanha dados da propria unidade.
- Atualiza status da residencia.
- Autoriza visitantes.
- Gera QR Code permanente e temporario.
- Consulta encomendas, acessos e notificacoes.
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

## Modulos Principais

- Login e protecao por perfil.
- Dashboard Admin, Portaria e Morador.
- Gestao de unidades.
- Gestao de moradores vinculados.
- Visitantes e autorizacoes.
- QR Code permanente e temporario.
- Validacao de QR pela portaria.
- Controle de acessos.
- Controle de encomendas.
- Notificacoes.
- Configuracoes da conta.
- Configuracoes do condominio.
- Auditoria.
- Relatorios e exportacao CSV.

## Estrutura

```text
app/          Rotas, layouts e Route Handlers
components/   Componentes reutilizaveis e modulos de interface
lib/          Auth, Prisma, queries, actions, validacoes e utilitarios
prisma/       Schema, migrations e seed
docs/         Guias operacionais
```

## Execucao Local

Configure as variaveis de ambiente local a partir do arquivo de exemplo do projeto e use um banco PostgreSQL compativel.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Aplicacao local:

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

- Exportacao XLSX e PDF.
- Melhorias de busca global.
- Preferencias de notificacao.
- Upload real de avatar e logo.
- Mais filtros analiticos para relatorios.
- Melhorias de acessibilidade com testes automatizados.

### V2.0

- Modelo multi-condominio.
- Arquitetura SaaS com isolamento por tenant.
- Planos, assinatura e gestao comercial.
- Painel master para operadores da plataforma.
- Convites e onboarding automatizado de condominios.
- APIs externas para integracoes com portaria remota e dispositivos.

## Status

Conecta Homme V1.1 esta preparado para validacao final, deploy e apresentacao em portfolio.
