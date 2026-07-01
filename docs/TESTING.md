# Checklist Manual - Conecta Homme V1.1

Use esta lista antes de deploy, demonstracao ou entrega. Execute os testes com usuarios de homologacao criados para o ambiente, sem registrar credenciais em documentacao publica.

## 1. Login e Sessao

- Acesse `/login`.
- Entre como Admin.
- Confirme redirecionamento para `/admin`.
- Saia e repita como Portaria.
- Saia e repita como Morador.
- Teste logout e tentativa de acesso a rota protegida.

## 2. Permissoes por Perfil

- Logado como Admin, tente acessar rotas de Portaria e Morador.
- Logado como Portaria, tente acessar rotas de Admin e Morador.
- Logado como Morador, tente acessar rotas de Admin e Portaria.
- Deslogado, tente acessar `/admin`, `/portaria` e `/morador`.

## 3. Admin

- Acesse `/admin`.
- Verifique cards, graficos, alertas e atividades recentes.
- Acesse `/admin/unidades`.
- Busque, ordene, filtre e pagine unidades.
- Cadastre uma unidade.
- Edite responsavel, telefone, e-mail, status e presenca.
- Inative uma unidade e confirme que moradores vinculados sao inativados.

## 4. Portaria

- Acesse `/portaria`.
- Busque unidade por bloco, apartamento, responsavel, telefone e e-mail.
- Verifique status da unidade e presenca.
- Registre entrada manual.
- Registre saida manual.
- Confirme os registros em ultimos acessos.

## 5. Morador

- Acesse `/morador`.
- Altere status da residencia.
- Confira cards, atalhos e atividades recentes.
- Acesse `/morador/acessos` e confirme historico da unidade.

## 6. Visitantes

- Como Morador, acesse `/morador/visitantes`.
- Cadastre visitante com nome, telefone, data e horarios.
- Gere QR Code temporario para visitante ativo.
- Cancele autorizacao e confirme mudanca de status.

## 7. QR Code

- Como Morador, acesse `/morador/qrcode`.
- Gere QR Code permanente.
- Como Portaria, acesse `/portaria/validar-qr`.
- Valide token de morador.
- Valide token de visitante.
- Teste token invalido.
- Registre entrada e saida via QR.

## 8. Encomendas

- Como Portaria, acesse `/portaria/encomendas`.
- Busque unidade.
- Cadastre encomenda com transportadora, codigo e descricao.
- Confirme notificacao ao morador.
- Marque encomenda como entregue.
- Como Morador, acesse `/morador/encomendas`.
- Como Admin, acesse `/admin/encomendas`, filtre e confira a tabela.

## 9. Notificacoes

- Verifique sino no Header em Admin, Portaria e Morador.
- Acesse `/admin/notificacoes`.
- Acesse `/portaria/notificacoes`.
- Acesse `/morador/notificacoes`.
- Filtre por tipo e status.
- Marque uma notificacao como lida.
- Marque todas como lidas.

## 10. Configuracoes

- Acesse configuracoes da conta em cada perfil.
- Atualize nome, telefone e e-mail em ambiente de teste.
- Teste alteracao de senha com valor valido.
- Como Admin, acesse `/admin/condominio`.
- Atualize nome do condominio, contato, endereco, horario da portaria e URL de logo.

## 11. Auditoria

- Execute acoes auditadas: unidade, condominio, encomenda, acesso, QR e conta.
- Acesse `/admin/auditoria`.
- Filtre por usuario, perfil, acao, modulo e periodo.
- Verifique data, usuario, descricao e entidade afetada.

## 12. Relatorios

- Acesse `/admin/relatorios`.
- Filtre por periodo.
- Filtre acessos por tipo e metodo.
- Filtre encomendas por status.
- Filtre visitantes por status.
- Confira cards, graficos e tabelas.

## 13. Exportacao CSV

- Em `/admin/relatorios`, aplique filtros e exporte CSV.
- Em `/admin/encomendas`, aplique filtros e exporte CSV.
- Em `/admin/auditoria`, aplique filtros e exporte CSV.
- Abra os arquivos e confirme que respeitam os filtros.
- Confirme que dados sensiveis nao aparecem na exportacao.

## 14. Responsividade e UX

- Teste Admin, Portaria e Morador em desktop.
- Teste tablet.
- Teste mobile.
- Confira menu responsivo, tabelas mobile, skeletons, toasts e estados vazios.

## 15. Checklist Final

- `npm run lint` passando.
- `npm run build` passando.
- `.env` nao versionado.
- Nenhuma credencial real em arquivos versionados.
- Migrations aplicadas no ambiente de teste.
- Fluxos principais validados.
