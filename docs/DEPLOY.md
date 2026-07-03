# Deploy - Conecta Homme

Este guia resume a publicação segura do Conecta Homme em um ambiente Next.js com PostgreSQL gerenciado.

## 1. Pré-requisitos

- Repositório versionado sem arquivos `.env`.
- Banco PostgreSQL provisionado.
- Variáveis de ambiente configuradas no provedor de hospedagem.
- Migrations revisadas.
- `npm run lint` e `npm run build` passando localmente.

## 2. Variáveis de Ambiente

Configure as variáveis exigidas pelo projeto diretamente no provedor de hospedagem e no ambiente local privado.

Boas práticas:

- Nunca versionar valores reais.
- Usar secrets diferentes por ambiente.
- Rotacionar secrets antes de produção.
- Restringir acesso ao painel do banco e da hospedagem.

Consulte `.env.example` apenas como referência de nomes esperados pelo projeto.

## 3. Banco de Dados

Use PostgreSQL gerenciado com SSL habilitado quando recomendado pelo provedor.

Fluxo recomendado:

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
```

Use seed apenas em homologação, demonstração controlada ou ambiente inicial de teste.

```bash
npm run prisma:seed
```

Em produção real, revise usuários de seed imediatamente ou crie usuários por processo operacional seguro.

## 4. Build

Com variáveis configuradas:

```bash
npm run lint
npm run build
```

O build deve compilar rotas, validar TypeScript e gerar traces sem erro.

## 5. Publicação

No provedor de hospedagem:

- Framework: Next.js.
- Install command: `npm install`.
- Build command: `npm run build`.
- Configure as variáveis de ambiente no painel seguro do provedor.
- Aplique migrations antes de liberar acesso real.

## 6. Validação Pós-Deploy

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
- Notificações.
- Configurações da conta.
- Configurações do condomínio.
- Auditoria.
- Relatórios.
- Exportação CSV.

Checklist detalhado:

```text
docs/TESTING.md
```

## 7. Segurança

- Confirme que `.env` não foi versionado.
- Confirme que secrets reais não aparecem em README, docs ou logs.
- Use HTTPS.
- Use banco com SSL.
- Limite acesso a variáveis e painel de produção.
- Evite seed em produção aberta.
- Troque credenciais temporárias antes de demonstrações públicas.

## 8. Troubleshooting

### Falha de conexão com banco

- Verifique se a variável do banco foi cadastrada no ambiente correto.
- Confirme usuário, host, database e parâmetros de SSL no painel privado.
- Rode migrations novamente se o schema estiver incompleto.

### Falha de sessão em produção

- Verifique se o secret de autenticação está configurado.
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

O projeto está pronto para deploy quando:

- Lint passou.
- Build passou.
- Migrations foram aplicadas.
- Checklist manual foi executado.
- Nenhuma credencial real está versionada.
