import express from 'express'
const app = express()

import admin from './routes/admin-routes.js'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import session from 'express-session'
import flash from 'connect-flash'

// Sessão, flash e middleware => ordem importa!
    app.use(session({
        secret: 'cursodenode',
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

// Arquivos staticos diretório public
    app.use(express.static(path.join(__dirname, 'public')))

// ODM mongoose
    mongoose.connect('mongodb://localhost/blog-app').then(() => {
        console.log('Conectado ao banco de dados')
    }).catch(err => {
        console.log(`Erro ao conectar-se ao banco de dados: ${err}`)
    })

// Express parser '-'
    app.use(express.json())
    app.use(express.urlencoded({ extended: true}))

// template engine
    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set("views", "./views");

// rotas
    app.get('/', (req, res) => {
        res.render('home')
    })
    app.use('/admin', admin)

app.listen(8080, () => console.log(`Servidor rodando na porta ${8080}`))