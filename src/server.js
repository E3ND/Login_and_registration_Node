const express = require('express');
const routes = require('./routes.js');
const login = require('./login.js');

const app = express();

app.use(express.json());
app.use(routes);
app.use(login)

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Running!" });
})
app.listen(3333, () => console.log({ message: "Server is running" })) 