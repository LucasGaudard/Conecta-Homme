# Checklist Manual - Conecta Homme

Use esta lista antes de deploy ou entrega interna.

## 1. Login Admin

- Acesse `/login`.
- Entre com `admin@conectahomme.com` e `admin123`.
- Confirme redirecionamento para `/admin`.

## 2. Login Portaria

- Saia da conta atual.
- Entre com `portaria@conectahomme.com` e `portaria123`.
- Confirme redirecionamento para `/portaria`.

## 3. Login Morador

- Saia da conta atual.
- Entre com `morador@conectahomme.com` e `morador123`.
- Repita usando username `a201`.
- Confirme redirecionamento para `/morador`.

## 4. Bloqueio de Rotas por Perfil

- Logado como admin, tente acessar `/portaria` e `/morador`.
- Logado como portaria, tente acessar `/admin` e `/morador`.
- Logado como morador, tente acessar `/admin` e `/portaria`.
- Deslogado, tente acessar `/admin`, `/portaria` e `/morador`.

## 5. CRUD de Unidades

- Como admin, acesse `/admin/unidades`.
- Cadastre uma nova unidade em `/admin/unidades/nova`.
- Confirme criacao do morador inicial.
- Edite responsavel, telefone, email, status e presenca.
- Verifique que bloco e apartamento nao sao editados pelo formulario de edicao.

## 6. Inativacao de Unidade

- Em `/admin/unidades`, clique em inativar.
- Confirme que o modal avisa que moradores vinculados tambem serao inativados.
- Confirme a acao.
- Verifique status da unidade e dos moradores.

## 7. Busca da Portaria

- Como portaria, acesse `/portaria`.
- Busque por bloco, apartamento, responsavel, telefone e email.
- Confirme exibicao de status da unidade e status de presenca.
- Verifique estado vazio para busca sem resultado.

## 8. Registro Manual de Entrada/Saida

- Na busca da portaria, selecione uma unidade.
- Registre entrada manual.
- Registre saida manual.
- Confirme que aparecem em ultimos acessos.

## 9. Alteracao de Status do Morador

- Como morador, acesse `/morador`.
- Altere para `Estou em casa`.
- Altere para `Nao estou em casa`.
- Altere para `Nao quero receber visitas`.
- Como portaria, busque a unidade e confirme o status atualizado.

## 10. Cadastro de Visitante

- Como morador, acesse `/morador/visitantes`.
- Cadastre visitante com nome, telefone, data e horarios.
- Confirme que aparece em visitantes ativos.
- Cancele a autorizacao e confirme que aparece em cancelados.

## 11. Geracao de QR do Morador

- Como morador, acesse `/morador/qrcode`.
- Gere o QR Code permanente.
- Copie o token exibido.

## 12. Geracao de QR do Visitante

- Como morador, acesse `/morador/visitantes`.
- Gere QR Code para um visitante ativo.
- Confirme validade de 12 horas.
- Copie o token.

## 13. Validacao do QR pela Portaria

- Como portaria, acesse `/portaria/validar-qr`.
- Cole token de morador e valide.
- Cole token de visitante e valide.
- Teste token invalido.
- Teste token expirado quando houver.
- Confirme bloqueio para unidade inativa.

## 14. Cadastro de Encomenda

- Como portaria, acesse `/portaria/encomendas`.
- Busque a unidade.
- Cadastre encomenda com transportadora, codigo e descricao.
- Confirme feedback visual.

## 15. Entrega de Encomenda

- Ainda como portaria, informe quem retirou.
- Marque encomenda como entregue.
- Confirme status `Entregue`.

## 16. Visualizacao de Encomendas pelo Morador

- Como morador, acesse `/morador/encomendas`.
- Verifique listas de aguardando retirada e entregues.
- Confirme que nao ha edicao ou exclusao.

## 17. Relatorios Admin

- Como admin, acesse `/admin/relatorios`.
- Filtre por periodo.
- Filtre acessos por tipo e metodo.
- Filtre encomendas por status.
- Filtre visitantes por status.
- Verifique cards, graficos e tabelas.

## 18. Logout

- Clique em `Sair`.
- Confirme retorno para `/login`.
- Tente acessar rota protegida e confirme redirecionamento.
