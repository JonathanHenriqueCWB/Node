import express from 'express'
const app = express()
import {engine} from 'express-handlebars'
import mongoose from 'mongoose'
import usuarios from './routes/usuarios-routes.js'
import session from 'express-session'
import flash from 'connect-flash'

// Session, flash e middleware
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

// ODM Mongoose
mongoose.connect('mongodb://localhost/usuarios-db').then(() => {
    console.log('Conectado com sucesso ao banco de dados')
}).catch(err => {
    console.log(`Erro ao conectar-ser ao banco de dados ${err}`)
})

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// Template engine express handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Rotas
app.use('/usuarios', usuarios)
app.get('/', (req, res) => {
    res.render('index')
})

const PORT = 8080
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))