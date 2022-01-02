import express from 'express'
const app = express()
import admin from './routes/admin-route.js'
import { engine } from 'express-handlebars';
import mongoose from 'mongoose'
import session from 'express-session'
import flash from 'connect-flash'

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Products from './models/Product.js'
import Category from './models/Category.js';

// ARQUIVOS STATICOS
app.use(express.static(path.join(__dirname, 'public')))

// SESSION, FLASH E MIDLEWARE
app.use(session({
    secret: 'crudmongo',
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
mongoose.connect('mongodb://localhost/crud-mongo').then(() => {
    console.log('Connected to database successfully')
}).catch(err => {
    console.log(`Error connecting to database ${err}`)
})

// BODY-PARSER
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// TEMPLATE ENGINE EXPRESS-HANDLEBARS CONFIG
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// ROTAS
app.get('/', (req, res) => {
    Products.find().lean().then(products => {
        Category.find().lean().then(categories => {
            res.render('index', {products, categories})
        }).catch()
    }).catch()
    
})

app.get('/categories/:id', (req, res) => {
    Products.find({category: req.params.id}).lean().then(products => {
        res.render('categories/index', {products})
    })
})

app.use('/admin', admin)

const PORT = 8080
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))