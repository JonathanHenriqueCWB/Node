const express = require('express')
const app = express()


const PORT = 8080
app.listen(PORT, (req, res) => {
    console.log('Servidor rodando na porta 8080')
})