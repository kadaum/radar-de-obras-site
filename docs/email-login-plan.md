# Login por link de e-mail — decisão do proprietário em 26/09/2026

Substitui o login Google solicitado anteriormente. Não continuar criação de projeto Google, OAuth ou Cloud Shell. Nenhum projeto foi criado e nenhuma conta de faturamento vinculada. O aviso observado era 14 projetos restantes, não cota esgotada; a escolha posterior por e-mail prevalece independentemente disso.

## Requisitos preservados

Custo zero, bancos separados por produto no Sites, implementação reutilizável, consulta pública sem login e painel /admin exclusivo do proprietário. Banco real existente: DB/contributions. Novas contas, sessões e painel ainda não implementados.

## Dependência de envio

Capabilities/starter Sites expostos não documentam remetente transacional nativo. Autenticação nativa documentada é ChatGPT. Confirmar caminho de autenticação própria conforme skill Sites antes de implementar stack. Perguntado ao proprietário se já possui Resend/Brevo/outro provedor. Não reutilizar credenciais de projetos sem identificação e autorização; não solicitar segredos por chat.

Candidato: Resend Free. Página oficial consultada em 26/09/2026 informa limite de 100 envios/dia e exige domínio verificado para envio próprio. Não afirmar envio gratuito ilimitado; confirmar limite mensal e regras da conta escolhida antes da ativação.
- https://resend.com/pricing
- https://resend.com/docs/dashboard/domains/introduction

## Fluxo concreto a implementar após configuração

1. Página /entrar recebe e-mail e retorno restrito a caminho interno. Resposta uniforme para não revelar cadastros. Limites por rede e endereço, cooldown e teto diário/mensal global atômico no D1, inferiores ou iguais à franquia disponível.
2. Token aleatório criptográfico, validade de 15 minutos, hash apenas no banco. Mensagem transacional sem tracking de clique ou abertura; não imprimir link/token em logs. Falha do provedor não confirma envio.
3. Link abre confirmação; GET não consome token nem cria sessão, evitando consumo por verificadores automáticos de e-mail. POST protegido contra CSRF/fluxo cruzado faz consumo atômico de uso único e cria sessão.
4. Sessão opaca de servidor em cookie Secure/HttpOnly/SameSite, expiração, logout e revogação. Cadastro somente após comprovação de controle da caixa de e-mail.
5. Contribuições associadas à conta; leitura pública continua sem login. Próprias contribuições e exclusão com isolamento no servidor. Legado anônimo sem associação automática.
6. /admin autorizado no servidor por identidade previamente definida pelo proprietário; nunca pelo primeiro usuário cadastrado. Usuários, pendências e decisões persistidas, e-mails privados.

## Evals antes de publicar

Expiração/uso duplo e consumo concorrente; GET de scanner; CSRF e redirecionamento externo; enumeração de e-mail; limites simultâneos e franquia compartilhada; falha e timeout do remetente; sessão/logout; duas contas sem acesso cruzado; administrador versus usuário comum; entrega real em endereço autorizado. Rascunho preservado no fluxo; retorno à ficha; leitor de tela/mobile; páginas privadas noindex sem dados no HTML anônimo.

Segurança depende também do controle da caixa de e-mail. Magic link não elimina phishing nem garante veracidade das contribuições. Quando a franquia acabar, interromper novos envios com aviso; nunca contratar plano ou excedente automaticamente.

Status: decisão e especificação registradas; remetente/provedor não configurados, login ainda não publicado. Versão 27 do produto permanece intacta.
