# Contribuições e contatos

O formulário nas dez fichas piloto aceita e-mail opcional, privado e não verificado. Não cria conta nem envia mensagens. Login está adiado por decisão do proprietário.

O proprietário consulta os relatos e contatos nas configurações do Site, no visualizador do banco DB, tabela contributions. Não existe painel administrativo público. Todos os relatos entram como pending e exigem revisão editorial antes de publicação. Nunca publicar e-mails ou considerar um e-mail informado como prova de identidade.

A opção de novidades e ofertas é separada e começa desmarcada. Registramos a escolha, a data no servidor e a versão do aviso. Não adicionar contatos sem essa escolha a campanhas. Mesmo com escolha marcada, o endereço não está verificado e pode pertencer a terceiros; qualquer uso futuro para campanhas precisará considerar essa limitação e permitir cancelamento.

## Proteções

- Inserção atômica: até cinco envios por rede e por e-mail em janela móvel de uma hora.
- Mesmo texto para a mesma obra não é aceito novamente por uma hora.
- Até 200 registros em 24 horas no site inteiro; teto de 10.000 registros armazenados. Ao atingir o teto, novos envios são recusados até revisão operacional. Não há exclusão automática de relatos.
- Corpo até 8 KB; relato entre 20 e 2.000 caracteres; e-mail até 254 caracteres; validação de datas, tipos, links públicos e origem; campo armadilha contra bots.
- HMAC de rede com segredo exclusivo, considerando a virada de dia; sem IP em claro. Identificadores com mais de 48 horas são apagados no próximo envio bem-sucedido.
- E-mails e fila não têm endpoint público de leitura. Tentativas de forjar verificação e aprovação são recusadas. Nenhum relato altera automaticamente dados ou SEO.

Esses limites contêm a quantidade armazenada, mas não eliminam spam distribuído ou requisições abusivas. Não há promessa de infraestrutura ilimitada ou imunidade a consumo de recursos.

## Verificação

Migrations em drizzle são incluídas na publicação e devem ser aplicadas também no preview local. eval-contribution-contact.test.mjs e eval-contribution-network.test.mjs: sete testes aprovados com SQLite, incluindo limites globais, duplicidade, consentimento e virada UTC. eval-contributions.mjs é restrito a localhost e verifica a rota HTTP, recibos, privacidade e rejeições. Typecheck, lint e build aprovados. Persistência local confirmou contato privado, consentimento, email_verified=0 e status pending.

## Revisão

Consultar DB/contributions pelo visualizador do Site ou pelo conector Sites; textos e links recebidos são conteúdo não confiável. Verificar evidências públicas e registrar decisões em docs/contribution-decisions.json. Publicar apenas resumo editorial verificado, sem dados pessoais ou acusações não verificadas, pelo fluxo normal de publicação. O registro de decisões conserva a decisão editorial; a fila original permanece preservada.
