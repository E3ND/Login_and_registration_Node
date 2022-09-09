const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const login = express.Router();

const prisma = new PrismaClient();

// Rota privada
login.get("/user/:id", checkToken, async (req, res) => {
    const { id } = req.params;

    // Checar se o usuario existe e retornar tudo menos a senha
    const userExists = await prisma.User.findUnique({ 
        where: { 
            id: id 
        },
        select: {
            id: true,
            name: true,
            email: true,
        }
    });

    if(!userExists) {
        return res.status(404).json({ message: "Usuário não encontrado! "})
    }

    res.status(200).json(userExists);
})

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Verifico se veio algima coisa e divido a string no espaço e pego a segunda parte
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        return res.status(401).json({ message: "Acesso negado!" })
    }
    try {
        // Verifica se o token é válido, caso der erro ele encerra a conexão
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next();

    } catch(error) {
        res.status(400).json({ message: "Token inválido!" })
    }
}

// Registrar usuario
login.post("/register", async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

    // validação
    if (name != "" & email != "" & password != "" & confirmpassword != "") {

        if (password !== confirmpassword) {
            return res.status(422).json({ message: "As senhas não conferem!" });
        }

        // Checar se o email existe
        const userExists = await prisma.User.findUnique({ where: { email: email } });

        if (userExists) {
            return res.status(422).json({ message: "E-mail já está em uso!" });
        }

        // Modificar senha
        const addModifiedPassword = await bcrypt.genSalt(12);
        const modifieldPassword = await bcrypt.hash(password, addModifiedPassword);

        // Criar dados
        async function main() {
            // Conecta ao cliente
            await prisma.$connect()
            // Aqui vai ser o escrito os comandos para o mongoDB
            const result = await prisma.User.create({
                data: {
                    name: name,
                    email: email,
                    password: modifieldPassword,
                }
            })
            return res.status(200).json(result);
        };

        main().then(async () => {
            await prisma.$disconnect()
        }).catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        });

    } else {
        return res.status(422).json({ message: "Todos os campos devem ser preenchidos!" });
    }
});

// Logar usuario
login.post("/login", async (req, res) => {
    const { email, password } =  req.body;

    // Validação
    if (email != "" & password != "") {
        // Checar se o usuario exista
        const userExists = await prisma.User.findUnique({ where: { email: email } });

        if (!userExists) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        // Checar se a senha combian
        const checkPassword = await bcrypt.compare(password,  userExists.password)

        if(!checkPassword) {
            return res.status(404).json({ message: "Senha inválida!" });
        }

        // Autenticação
        try {
            const secret = process.env.SECRET

            const token = jwt.sign({
                id: userExists._id
            }, secret,)

            res.status(500).json({ message: "Login realizado com sucesso!", token})

        } catch (err) {
            console.log(err)

            res.status(500).json({ message: "Ocorreu um erro no servidor, tente novamente mais tarde!" })
        }

    } else {
        return res.status(422).json({ message: "Todos os campos devem ser preenchidos!" })
    }
})

module.exports = login;