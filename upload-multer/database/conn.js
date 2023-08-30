const mongoose = require('mongoose')

async function Main() {
    try {        
        await mongoose.connect('mongodb://127.0.0.1/images')
        console.log('Conectado ao banco de dados com sucesso')
    } catch (error) {
        console.log('Erro ao conectar ao banco de dados' + error)
    }
}

module.exports = Main