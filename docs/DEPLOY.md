# Deploy - Conecta Homme

Este guia resume a publicacao segura do Conecta Homme em um ambiente Next.js com PostgreSQL gerenciado.

## 1. Pre-requisitos

- Repositorio versionado sem arquivos `.env`.
- Banco PostgreSQL provisionado.
- Variaveis de ambiente configuradas no provedor de hospedagem.
- Migrations revisadas.
- `npm run lint` e `npm run build` passando localmente.

## 2. Variaveis de Ambiente

Configure as variaveis exigidas pelo projeto diretamente no provedor de hospedagem e no ambiente local privado.

Boas praticas:

- Nunca versionar valores reais.
- Usar secrets diferentes por ambiente.
- Rotacionar secrets antes de producao.
- Restringir acesso ao painel do banco e da hospedagem.

Consulte `.env.example` apenas como referencia de nomes esperados pelo projeto.

## 3. Banco de Dados

Use PostgreSQL gerenciado com SSL habilitado quando recomendado pelo provedor.

Fluxo recomendado:

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
```

Use seed apenas em homologacao, demonstracao controlada ou ambiente inicial de teste.

```bash
npm run prisma:seed
```

Em producao real, revise usuarios de seed imediatamente ou crie usuarios por processo operacional seguro.

## 4. Build

Com variaveis configuradas:

```bash
npm run lint
npm run build
```

O build deve compilar rotas, validar TypeScript e gerar traces sem erro.

## 5. Publicacao

No provedor de hospedagem:

- Framework: Next.js.
- Install command: `npm install`.
- Build command: `npm run build`.
- Configure as variaveis de ambiente no painel seguro do provedor.
- Aplique migrations antes de liberar acesso real.

## 6. Validacao Pos-Deploy

Teste os fluxos abaixo em ambiente publicado:

- Login e logout.
- Bloqueio por perfil.
- Dashboard Admin.
- Painel da Portaria.
- Dashboard Morador.
- Unidades e moradores.
- Visitantes.
- QR Code.
- Encomendas.
- Notificacoes.
- Configuracoes da conta.
- Configuracoes do condominio.
- Auditoria.
- Relatorios.
- Exportacao CSV.

Checklist detalhado:

```text
docs/TESTING.md
```

## 7. Seguranca

- Confirme que `.env` nao foi versionado.
- Confirme que secrets reais nao aparecem em README, docs ou logs.
- Use HTTPS.
- Use banco com SSL.
- Limite acesso a variaveis e painel de producao.
- Evite seed em producao aberta.
- Troque credenciais temporarias antes de demonstracoes publicas.

## 8. Troubleshooting

### Falha de conexao com banco

- Verifique se a variavel do banco foi cadastrada no ambiente correto.
- Confirme usuario, host, database e parametros de SSL no painel privado.
- Rode migrations novamente se o schema estiver incompleto.

### Falha de sessao em producao

- Verifique se o secret de autenticacao esta configurado.
- Confirme HTTPS e cookies no ambiente publicado.

### Prisma Client

Rode:

```bash
npm run prisma:generate
```

### Migration pendente

Rode:

```bash
npm run prisma:deploy
```

### Build falhando

Rode localmente:

```bash
npm run lint
npm run build
```

Corrija erros antes de publicar novamente.

## 9. Status de Release

O projeto esta pronto para deploy quando:

- Lint passou.
- Build passou.
- Migrations foram aplicadas.
- Checklist manual foi executado.
- Nenhuma credencial real esta versionada.
