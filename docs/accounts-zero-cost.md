# Contas e administração — restrição de custo zero

Solicitação do proprietário em 26/09/2026: preparar projeto Google próprio para login, manter custo zero e explicar/admin de cadastros.

## Confirmado

- Acesso ao Google Cloud pelo navegador autenticado, projetos existentes Findli/JOBareo/Second Brain visíveis.
- Banco Sites verificado pela API: binding DB, tabela contributions. Não há users/sessions ou painel administrativo pronto.
- Formulário de novo projeto Radar de Obras preenchido, ainda NÃO enviado. Projeto sugerido radar-de-obras-509813. Campo Billing account seleciona My Billing Account e oferece duas contas faturáveis, sem alternativa sem conta no seletor observado. Não clicar Create nesse estado.
- Cloud Shell aberto: mensagem do próprio Google confirma gratuidade. Botão Continue dentro do iframe não acionável pelo controle do navegador (alvos presentes, erros de target unavailable). Solicitado clique manual do proprietário. Não há projeto/cliente OAuth criado nesta etapa.

## Restrição mandatória

Não associar conta de faturamento, ativar trial, serviços pagos, Firebase Blaze, Identity Platform pago, Cloud SQL ou nova hospedagem. Google somente como provedor de identidade básica. Banco/runtime permanecem Sites. Limites futuros da hospedagem não têm garantia de gratuidade perpétua; qualquer opção com cobrança exige nova decisão, nunca upgrade automático.

## Caminho gratuito para o projeto

A API Resource Manager projects.create não associa billing account. Usar gcloud projects create pelo Cloud Shell gratuito quando disponível, sem comando de vinculação. Verificar billingEnabled=false antes de preparar OAuth. Não alterar projetos existentes. Referências oficiais:
- https://docs.cloud.google.com/resource-manager/reference/rest/v1/projects/create
- https://cloud.google.com/shell/pricing
- https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid

## Painel pretendido

- /admin restrito por identidade verificada do proprietário no servidor, nunca por botão oculto ou e-mail enviado pelo navegador.
- Usuários: e-mail privado, nome, criação, último acesso, status ativo/bloqueado; dados mínimos sem acesso ao Gmail.
- Contribuições: obra, autor, tipo, data, evidência, estado; pendente/aprovada/rejeitada e nota de revisão persistidos no banco.
- Histórico de moderação com responsável/data; alterações públicas somente após revisão factual.
- Conta do cidadão: próprias contribuições, estados, logout e exclusão. Nunca acesso aos dados de outra conta.
- Consulta pública e SEO continuam sem login; sessão necessária para contribuir após ativação.
- Reusar D1 existente com migrations aditivas; legado anônimo não associado automaticamente.

Login, painel e novas tabelas NÃO implementados. Suporte/caminho de auth externa no Sites ainda precisa de confirmação técnica conforme skill Sites. Criação do projeto Google por si só não ativa login no site.
