# Decisão vigente: login adiado

Em 26/09/2026, após avaliar Google e magic links, o proprietário pediu deixar login para depois. Não criar provedores, contratar serviços, configurar envio ou continuar Google Cloud. Custo zero é restrição. Objetivo comercial esclarecido: captar interessados/leads; contas são um possível meio, não requisito imediato. Alternativa a discutir futuramente: formulário opcional de nome/e-mail e interesse, armazenado no D1 existente, com escolha explícita de receber contato. Não implementar coleta nova nem assumir adesão automática a marketing a partir desta anotação. Não prometer capacidade ilimitada ou verificação de identidade sem mecanismo real. Nenhum recurso pago foi ativado.

As especificações abaixo e email-login-plan.md ficam adiadas, não são trabalho ativo.

# Decisão vigente: login por link de e-mail

Em 26/09/2026 o proprietário substituiu Google por link de acesso enviado por e-mail, mantendo custo zero. Ver [email-login-plan.md](email-login-plan.md). A especificação Google abaixo é histórica e não deve orientar novas configurações.

# Fila de melhorias do Radar de Obras

## P1 — Conta com login Google para contribuições

Solicitado pelo proprietário em 25/09/2026. Status: planejado, ainda não implementado. Próxima evolução do formulário de contribuições.

Objetivo: permitir criar conta com Google, guardar o e-mail da conta e vincular os relatos a um usuário identificável para moderação e combate a abuso.

### Escopo e critérios de aceite

- Botão “Continuar com Google”; criar a conta no primeiro acesso e reutilizá-la nos seguintes. Não solicitar senha do Gmail nem acesso à caixa de mensagens.
- Validar a identidade no servidor e usar o identificador estável do provedor para vincular a conta; armazenar o e-mail verificado e os dados mínimos necessários.
- Exigir sessão válida no servidor para novos relatos, correções e indicações de fontes. Vincular cada envio ao usuário autenticado; nunca aceitar identidade declarada apenas pelo cliente.
- Permitir consultar as obras e seus dados sem login, preservando o HTML público e a indexação. Pedir login apenas ao contribuir e conservar o rascunho durante o fluxo.
- Disponibilizar saída da conta e uma área simples para consultar as próprias contribuições e seu estado de revisão.
- Manter revisão editorial antes da publicação. Adotar limites por conta e rede, prevenção de envios repetidos e possibilidade de bloquear contas abusivas. Login Google não garante veracidade nem elimina bots.
- Manter e-mails privados, fora de páginas públicas, URLs, eventos de analytics e logs. Explicar a finalidade de uso na criação da conta e oferecer exclusão da conta.
- Se houver interesse em avisos ou marketing por e-mail, pedir adesão separada e opcional; criar conta não equivale a assinar comunicações.
- Preservar as contribuições anônimas antigas como legado, sem atribuí-las automaticamente a novas contas.

### Preparação para implementação

Verificar o suporte de autenticação do ambiente Sites e selecionar a integração Google compatível; configurar credenciais e URLs de retorno dos domínios de produção. Definir migrations para usuários, vínculo com contribuições e estados reais de moderação. Validar login, retorno com rascunho, sessão expirada, logout, bloqueio, limites e isolamento entre contas antes de publicar.

### Situação atual

A versão 27 recebe contribuições sem cadastro em fila privada. Esta entrada registra a mudança solicitada; o login e a coleta de e-mails ainda não estão ativos.
