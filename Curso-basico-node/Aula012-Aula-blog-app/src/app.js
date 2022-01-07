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

import Posts from './models/Post.js'
import Category from './models/Category.js'
import Post from './models/Post.js'

import users from './routes/user-routes.js'

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
       Posts.find().populate('category').lean().sort({date: 'desc'}).then(posts => {
           res.render('index', {posts})
       }).catch(err => {
           req.flash('error_msg', 'No posts found')
           res.redirect('/')
       })
    })

    app.get('/posts/:slug', (req, res) => {
        Posts.find({slug: req.params.slug}).populate('category').lean().then(post => {
            if(post.length > 0) {
                res.render('posts/index', {post})
            }else {
                req.flash('error_msg', 'No posts found')
                res.redirect('/')
            }
        }).catch(err => {
            req.flash('error_msg', 'No posts found')
            res.redirect('/')
        })
    })

    app.get('/categories', (req, res) => {
        Category.find().lean().then(categories => {
            res.render('categories/index', {categories})
        }).catch(err => {
            req.flash('error_msg', 'Please register a category')
            res.redirect('/')
        })
    })

    app.get('/categories/:id', (req, res) => {
        Post.find( {category: req.params.id} ).populate('category').lean().then(posts => {
            if(posts.length > 0){
                res.render('categories/posts', {posts})
            }else{
                req.flash('error_msg', 'This is category does not contain any post')
                res.redirect('/')
            }
        }).catch(err => {
            req.flash('error_msg', 'No registered posts, please register')
            res.redirect('/')
        })
    })

    app.use('/admin', admin)
    app.use('/users', users)

app.listen(8080, () => console.log(`Servidor rodando na porta ${8080}`))