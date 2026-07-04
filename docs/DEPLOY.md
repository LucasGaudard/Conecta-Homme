# Deploy - Conecta Homme

## PWA

O Conecta Homme possui manifest, icones e service worker para instalacao como aplicativo. O service worker usa cache apenas para assets estaticos e nao deve cachear paginas autenticadas, rotas privadas ou APIs.

Para validar:

- Android: abra o site publicado no Chrome, faca login se necessario, toque no menu do navegador e escolha "Instalar app" ou "Adicionar a tela inicial". Depois abra pelo icone instalado e confirme que a exibicao esta em modo standalone.
- iPhone: abra no Safari, toque em compartilhar e escolha "Adicionar a Tela de Inicio". Depois abra pelo icone criado e confirme que login, logout e navegacao continuam funcionando.
- Desktop: abra no Chrome ou Edge, use o icone de instalacao na barra de endereco ou o menu do navegador, instale o app e confirme abertura em janela propria.

Em todos os dispositivos, valide que dados autenticados continuam vindo da rede e que logout/login nao reaproveitam dados antigos de outro usuario.

Este guia resume a publicaÃ§Ã£o segura do Conecta Homme em um ambiente Next.js com PostgreSQL gerenciado.

## 1. PrÃ©-requisitos

- RepositÃ³rio versionado sem arquivos `.env`.
- Banco PostgreSQL provisionado.
- VariÃ¡veis de ambiente configuradas no provedor de hospedagem.
- Migrations revisadas.
- `npm run lint` e `npm run build` passando localmente.

## 2. VariÃ¡veis de Ambiente

Configure as variÃ¡veis exigidas pelo projeto diretamente no provedor de hospedagem e no ambiente local privado.

Boas prÃ¡ticas:

- Nunca versionar valores reais.
- Usar secrets diferentes por ambiente.
- Rotacionar secrets antes de produÃ§Ã£o.
- Restringir acesso ao painel do banco e da hospedagem.

Consulte `.env.example` apenas como referÃªncia de nomes esperados pelo projeto.

## 3. Banco de Dados

Use PostgreSQL gerenciado com SSL habilitado quando recomendado pelo provedor.

Fluxo recomendado:

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
```

Use seed apenas em homologaÃ§Ã£o, demonstraÃ§Ã£o controlada ou ambiente inicial de teste.

```bash
npm run prisma:seed
```

Em produÃ§Ã£o real, revise usuÃ¡rios de seed imediatamente ou crie usuÃ¡rios por processo operacional seguro.

## 4. Build

Com variÃ¡veis configuradas:

```bash
npm run lint
npm run build
```

O build deve compilar rotas, validar TypeScript e gerar traces sem erro.

## 5. PublicaÃ§Ã£o

No provedor de hospedagem:

- Framework: Next.js.
- Install command: `npm install`.
- Build command: `npm run build`.
- Configure as variÃ¡veis de ambiente no painel seguro do provedor.
- Aplique migrations antes de liberar acesso real.

## 6. ValidaÃ§Ã£o PÃ³s-Deploy

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
- NotificaÃ§Ãµes.
- ConfiguraÃ§Ãµes da conta.
- ConfiguraÃ§Ãµes do condomÃ­nio.
- Auditoria.
- RelatÃ³rios.
- ExportaÃ§Ã£o CSV.

Checklist detalhado:

```text
docs/TESTING.md
```

## 7. SeguranÃ§a

- Confirme que `.env` nÃ£o foi versionado.
- Confirme que secrets reais nÃ£o aparecem em README, docs ou logs.
- Use HTTPS.
- Use banco com SSL.
- Limite acesso a variÃ¡veis e painel de produÃ§Ã£o.
- Evite seed em produÃ§Ã£o aberta.
- Troque credenciais temporÃ¡rias antes de demonstraÃ§Ãµes pÃºblicas.

## 8. Troubleshooting

### Falha de conexÃ£o com banco

- Verifique se a variÃ¡vel do banco foi cadastrada no ambiente correto.
- Confirme usuÃ¡rio, host, database e parÃ¢metros de SSL no painel privado.
- Rode migrations novamente se o schema estiver incompleto.

### Falha de sessÃ£o em produÃ§Ã£o

- Verifique se o secret de autenticaÃ§Ã£o estÃ¡ configurado.
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

O projeto estÃ¡ pronto para deploy quando:

- Lint passou.
- Build passou.
- Migrations foram aplicadas.
- Checklist manual foi executado.
- Nenhuma credencial real estÃ¡ versionada.
