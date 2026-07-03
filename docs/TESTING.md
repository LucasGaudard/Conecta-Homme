# Checklist Manual - Conecta Homme V1.1

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
