# Checklist Manual - Conecta Homme

## V2.0 - QA Multi-Condominio

Use esta checklist antes de promover a V2.0. Prepare pelo menos dois condominios ativos, A e B, com usuarios separados:

- SUPER_ADMIN global com `condominiumId` nulo.
- Admin A, Portaria A e Morador A vinculados ao Condominio A.
- Admin B, Portaria B e Morador B vinculados ao Condominio B.
- Unidade `A-101` cadastrada nos dois condominios para confirmar que a unicidade e as buscas sao tenant-scoped.

### Super Admin

- Entrar como SUPER_ADMIN e confirmar redirecionamento para `/super-admin`.
- Criar, editar, suspender, inativar e reativar condominios.
- Confirmar que logs globais de plataforma aparecem no contexto do Super Admin.
- Confirmar que SUPER_ADMIN nao acessa `/admin`, `/portaria` ou `/morador`.

### Isolamento Admin A/Admin B

- Entrar como Admin A e cadastrar unidade `A-101`.
- Entrar como Admin B e cadastrar tambem unidade `A-101`.
- Confirmar que Admin A nao visualiza unidades, moradores, encomendas, reservas, auditoria, notificacoes ou relatorios do Condominio B.
- Confirmar o mesmo isolamento no sentido B para A.

### Configuracoes do Condominio

- Como Admin A, acessar `/admin/condominio` e alterar nome, telefone, e-mail, endereco, horario da portaria e `logoUrl`.
- Como Admin B, acessar `/admin/condominio` e confirmar que os dados de B nao foram alterados.
- Alterar configuracoes de B e confirmar que A permanece inalterado.
- Confirmar que nenhum formulario envia ou depende de `condominiumId` vindo do cliente.

### QR Code e Codigos Curtos

- Como Morador A, gerar QR permanente.
- Como Portaria A, validar o QR de A com sucesso.
- Como Portaria B, tentar validar o QR de A e confirmar recusa sem revelar dados de A.
- Repetir o teste com QR temporario de visitante.

### Encomendas

- Como Portaria A, registrar encomenda para unidade de A.
- Confirmar que Morador A e Admin A visualizam a encomenda.
- Confirmar que Portaria B, Morador B e Admin B nao visualizam a encomenda de A.
- Marcar entrega em A e confirmar que B continua sem acesso.

### Reservas

- Como Admin A e Admin B, criar espacos de lazer independentes.
- Como Morador A, solicitar reserva em A.
- Confirmar que Admin A visualiza/aprova/recusa/cancela apenas reservas de A.
- Confirmar que Admin B e Portaria B nao visualizam reservas de A.
- Testar reserva aprovada sobreposta no mesmo espaco e condominio, esperando bloqueio.
- Testar horarios iguais em condominios diferentes, esperando independencia.

### Relatorios, Auditoria e Exports

- Gerar dados em A e B para acessos, encomendas, visitantes, reservas e auditoria.
- Como Admin A, conferir `/admin/relatorios`, `/admin/auditoria` e `/admin/encomendas`.
- Exportar relatorios, encomendas e auditoria em A.
- Abrir os CSVs e confirmar que contem somente dados de A.
- Repetir como Admin B e confirmar isolamento.

### Bloqueio de Condominio

- Como SUPER_ADMIN, suspender o Condominio A.
- Confirmar que Admin A, Portaria A e Morador A sao redirecionados para `/condominio-bloqueado`.
- Confirmar que usuarios de B continuam operando normalmente.

### PWA e Cache

- Confirmar que paginas autenticadas nao sao servidas por cache offline.
- Confirmar que `/api`, `/admin`, `/portaria`, `/morador` e `/login` sempre buscam da rede.

### Validacao Automatizada

- `npx prisma format` passando.
- `npm run prisma:generate` passando.
- `npm run lint` passando.
- `npm run build` passando.

## V1.1 - Checklist Manual

Use esta lista antes de deploy, demonstração ou entrega. Execute os testes com usuários de homologação criados para o ambiente, sem registrar credenciais em documentação pública.

## 1. Login e Sessão

- Acesse `/login`.
- Entre como Admin.
- Confirme redirecionamento para `/admin`.
- Saia e repita como Portaria.
- Saia e repita como Morador.
- Teste logout e tentativa de acesso a rota protegida.

## 2. Permissões por Perfil

- Logado como Admin, tente acessar rotas de Portaria e Morador.
- Logado como Portaria, tente acessar rotas de Admin e Morador.
- Logado como Morador, tente acessar rotas de Admin e Portaria.
- Deslogado, tente acessar `/admin`, `/portaria` e `/morador`.

## 3. Admin

- Acesse `/admin`.
- Verifique cards, gráficos, alertas e atividades recentes.
- Acesse `/admin/unidades`.
- Busque, ordene, filtre e pagine unidades.
- Cadastre uma unidade.
- Edite responsável, telefone, e-mail, status e presença.
- Inative uma unidade e confirme que moradores vinculados são inativados.

## 4. Portaria

- Acesse `/portaria`.
- Busque unidade por bloco, apartamento, responsável, telefone e e-mail.
- Verifique status da unidade e presença.
- Registre entrada manual.
- Registre saída manual.
- Confirme os registros em últimos acessos.

## 5. Morador

- Acesse `/morador`.
- Altere status da residência.
- Confira cards, atalhos e atividades recentes.
- Acesse `/morador/acessos` e confirme histórico da unidade.

## 6. Visitantes

- Como Morador, acesse `/morador/visitantes`.
- Cadastre visitante com nome, telefone, data e horários.
- Gere QR Code temporário para visitante ativo.
- Cancele autorização e confirme mudança de status.

## 7. QR Code

- Como Morador, acesse `/morador/qrcode`.
- Gere QR Code permanente.
- Como Portaria, acesse `/portaria/validar-qr`.
- Valide token de morador.
- Valide token de visitante.
- Teste token inválido.
- Registre entrada e saída via QR.

## 8. Encomendas

- Como Portaria, acesse `/portaria/encomendas`.
- Busque unidade.
- Cadastre encomenda com transportadora, código e descrição.
- Confirme notificação ao morador.
- Marque encomenda como entregue.
- Como Morador, acesse `/morador/encomendas`.
- Como Admin, acesse `/admin/encomendas`, filtre e confira a tabela.

## 9. Notificações

- Verifique sino no Header em Admin, Portaria e Morador.
- Acesse `/admin/notificacoes`.
- Acesse `/portaria/notificacoes`.
- Acesse `/morador/notificacoes`.
- Filtre por tipo e status.
- Marque uma notificação como lida.
- Marque todas como lidas.

## 10. Configurações

- Acesse configurações da conta em cada perfil.
- Atualize nome, telefone e e-mail em ambiente de teste.
- Teste alteração de senha com valor válido.
- Como Admin, acesse `/admin/condominio`.
- Atualize nome do condomínio, contato, endereço, horário da portaria e URL de logo.

## 11. Auditoria

- Execute ações auditadas: unidade, condomínio, encomenda, acesso, QR e conta.
- Acesse `/admin/auditoria`.
- Filtre por usuário, perfil, ação, módulo e período.
- Verifique data, usuário, descrição e entidade afetada.

## 12. Relatórios

- Acesse `/admin/relatorios`.
- Filtre por período.
- Filtre acessos por tipo e método.
- Filtre encomendas por status.
- Filtre visitantes por status.
- Confira cards, gráficos e tabelas.

## 13. Exportação CSV

- Em `/admin/relatorios`, aplique filtros e exporte CSV.
- Em `/admin/encomendas`, aplique filtros e exporte CSV.
- Em `/admin/auditoria`, aplique filtros e exporte CSV.
- Abra os arquivos e confirme que respeitam os filtros.
- Confirme que dados sensíveis não aparecem na exportação.

## 14. Responsividade e UX

- Teste Admin, Portaria e Morador em desktop.
- Teste tablet.
- Teste mobile.
- Confira menu responsivo, tabelas mobile, skeletons, toasts e estados vazios.

## 15. Checklist Final

- `npm run lint` passando.
- `npm run build` passando.
- `.env` não versionado.
- Nenhuma credencial real em arquivos versionados.
- Migrations aplicadas no ambiente de teste.
- Fluxos principais validados.
