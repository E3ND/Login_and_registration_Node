const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const uploadUser = require('../middlewares/uploadimage');

const routes = express.Router();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Validação de token
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

routes.post("/upload-image", checkToken, uploadUser.single(), async(req, res) => {
    if(req.file){
        
        async function main() {
            await prisma.$connect()

            const imageName = req.file.filename

            
            const imageCreate = await prisma.Image.create({
                data: {
                    img: imageName
                }
            })

            return res.status(201).json(imageCreate);
        }
        main().then(async () => {
            await prisma.$disconnect()
        }).catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        });
        

    } else {
        return res.status(400).json("Imagem Não suportada.")
    }
});

// Create
routes.post("/cars/create", checkToken, uploadUser.single(), async (req, res) => {
    const { title, subtitle, price, body } = req.body;
    var imageName = null;

    if(req.file) {
        imageName = req.file.filename;
    }
    
    if (title != "" & subtitle != "" & price != "" & body != "") {
        async function main() {
            // Conecta ao cliente
            await prisma.$connect()
            // Aqui vai ser o escrito os comandos para o mongoDB
            const result = await prisma.Cars.create({
                data: {
                    title: title,
                    subtitle: subtitle,
                    price: price,
                    body: body,
                    image: imageName,
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

// Read all
routes.get("/cars/readall", async (req, res) => {
    const all = await prisma.Cars.findMany()
    return res.status(200).json(all);
})

// Read por id
routes.get("/cars/read/:id", async (req, res) => {
    const { id } = req.params;

    const verification = await prisma.Cars.findUnique({ where: { id: id, }, });

    if (verification) {
        const user = await prisma.Cars.findUnique({
            where: {
                id: id,
            },
        })
        return res.status(200).json(user);

    } else {
        return res.status(404).json({ message: "Não encontrado!" });
    }

})

// Update
routes.put("/cars/update", checkToken, async (req, res) => {
    const { id, title, subtitle, price, body } = req.body;

    const upadteUser = await prisma.Cars.update({
        where: {
            id: id,
        },
        data: {
            title: title,
            subtitle: subtitle,
            price: price,
            body: body,
        },
    })
    return res.status(200).json(upadteUser);
})

// Delete
routes.delete("/cars/delete/:id", checkToken, async (req, res) => {
    const { id } = req.params;

    const verification = await prisma.Cars.findUnique({ where: { id: id, }, });

    if(verification) {
        const deleteUser = await prisma.Cars.delete({
            where: {
                id: id,
            }
        })
        return res.status(200).json({ message: "Deletado com sucesso!" });
    } else {
        return res.status(404).json({ message: "Dados inexistentes!" });
    }

    
})

module.exports = routes;