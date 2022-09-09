Projeto feito com o intuito de estudo pessoal.

Objetivo do projeto: Fazer cadastro de usuário, gerar um token que permite ao usuário fazer cadastro de dados, sem estar logado o usuário não consegue cadastrar, deletar e nem atualizar nada.
Front-end em desenvolvimento...

Para o desenvolvimento do projeto foi usado Node, Prisma e MongoDB

Instruções de uso:
Crie uma conta no site: https://www.mongodb.com/pt-br crie seu banco de dados contendo nome de usuário e senha, após isso crie um arquivo na pasta raiz do projeto chamando .env e dentro dela crie uma variável chamada DATABASE_URL e armazene a URL do seu banco, contendo nome de usuário, senha e nome do banco.
O resultado deve ser semelhante a esse:

DATABASE_URL="mongodb+srv://(nome):(senha)@cluster0.b3kpyvx.mongodb.net/(nome do seu banco)?retryWrites=true&w=majority"

Após isso crie uma outra variável no arquivo .env com o nome SECRET, e nela armazene uma valor aleatório, pois ele valor será usado para gerar um token de autenticação, siga o exemplo:

SECRET=UISADPQOW1283H7182YEAO8Q71JW10WJNDA1O23JKN

Agora é só digitar no terminal: npm run dev e sua API estará pronta.
Para mis informações acesse: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb-node-mongodb
