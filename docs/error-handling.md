# Tratamento de erros em Server Actions

Use `handleActionError` para converter erros inesperados em mensagens seguras para o usuario e registrar contexto detalhado no servidor.

Padrao recomendado:

```ts
try {
  // Operacoes de banco, auditoria e efeitos de servidor.
} catch (error) {
  redirectWithMessage(path, {
    error: handleActionError(error, {
      context: {
        action: "nomeDaAction",
        condominiumId,
        module: "MODULO",
        role: user.role,
        userId: user.id,
      },
      fallbackMessage: "Nao foi possivel concluir a operacao.",
      prisma: {
        unique: {
          email: "Ja existe um usuario com este e-mail.",
        },
      },
    }),
  });
}

redirectWithMessage(successPath, {
  success: "Operacao concluida com sucesso.",
});
```

Regras:

- deixe `redirect()` e `notFound()` fora de `try/catch` quando forem parte do fluxo esperado;
- se uma excecao interna do Next cair no helper, ela sera relancada e nao virara erro de negocio;
- mensagens de Zod continuam vindo das validacoes atuais;
- erros Prisma conhecidos sao mapeados para mensagens amigaveis;
- detalhes sensiveis ficam somente no log sanitizado do servidor;
- nao envie senha, token, hash, secret, `DATABASE_URL` ou chaves de API em `context.metadata`.

Codigos Prisma tratados hoje:

- `P2002`: registro duplicado, com mensagem especifica por campo quando configurada;
- `P2025`: registro nao encontrado;
- `P2022`: incompatibilidade entre codigo e banco/migration ausente;
- demais codigos: mensagem generica segura, com codigo/metadados no log do servidor.

Modulos ja migrados:

- `lib/porters/actions.ts`;
- `lib/packages/actions.ts`;
- `lib/account/actions.ts`.
