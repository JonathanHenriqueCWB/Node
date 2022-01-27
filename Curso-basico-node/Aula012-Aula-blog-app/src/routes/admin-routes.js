import { Router } from "express";
const router = Router()
import Category from '../models/Category.js' 
import Post from '../models/Post.js'

import admin from '../helpers/eAdmin.js'
const isAdmin = admin.eAdmin

router.get('/', isAdmin, (req, res) => res.render('admin/index'))

router.get('/categories', (req, res) => {
    Category.find().lean().sort({date: 'desc'}).then(categories => {
        res.render('admin/categories/read', { categories })
    }).catch(err => {
        req.flash('error_msg', 'Error loading categories')
        req.redirect('/admin')
    })
})

router.get('/categories/create', (req, res) => {
    res.render('admin/categories/create')
})

router.post('/categories/create', (req, res) => {

    var erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        erros.push({texto: 'nome invalido'})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'slug invalido'})
    }
    if(req.body.name.length < 3){
        erros.push({texto: 'nome deve ser maior de 3 caracteres'})
    }
    if(req.body.slug.length < 3){
        erros.push({texto: 'slug deve ser maior de 3 caracteres'})
    }

    if(erros.length > 0){
        res.render('admin/categories/create', { erros })
    }else{
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }

        new Category(newCategory).save().then(() => {
            req.flash('success_msg', 'Category successfully created')
            res.redirect('/admin/categories')

        }).catch(err => {
            req.flash('error_msg', 'Error creating category')
            res.redirect('/admin')
        })
    }
})


router.get('/categories/update/:id', (req, res) => {
    Category.findOne({_id: req.params.id}).lean().then(category => {
        res.render('admin/categories/update', { category })
    }).catch(err => {
        req.flash('error_msg', 'Categoria inexistente')
        res.redirect('/admin')
    })
})
    
router.post('/categories/update', (req, res) => {

    const erros = []    
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        erros.push({texto: 'nome invalido'})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'slug invalido'})
    }

    if(req.body.name < 3 ){
        erros.push({texto: 'Nome muito curto'})
    }
    if(req.body.slug < 3){
        erros.push({texto: 'Slug muito curto'})
    }

    if(erros > 0) {
        res.render('admin/categories/update', { erros })
    }else {
        Category.findById({_id: req.body.id}).then(category => {
            category.name = req.body.name
            category.slug = req.body.slug

            category.save().then(() => {
                req.flash('success_msg', 'Successfully edited category')
                res.redirect('/admin/categories')
            }).catch(err => {
                req.flash('error_msg', 'Error editing category' + err)
                res.redirect('/admin/catgories')
            })    
        }).catch(err => {
            req.flash('error_msg', 'Non-existent category' + err)
            res.redirect('/admin/categories')
        })
    }
})

router .get('/categories/delete/:id', (req, res) => {
    Category.findOne({_id: req.params.id}).lean().then(category => {
        res.render('admin/categories/delete', { category })
    }).catch(err => {
        req.flash('error_msg', 'Categoria não encontrada')
        res.redirect('/admin/categories')
    })
})

router.post('/categories/delete', (req, res) => {
    Category.deleteOne({_id: req.body.id}).then(category => {
        req.flash('success_msg', 'Category successfully deleted')
        res.redirect('/admin/categories')
    }).catch(err => {
        req.flash('error_msg', 'Error erasing category')
        res.redirect('/admin/categories')
    })
})

router.get('/posts', (req, res) => {
    Post.find().populate('category').lean().sort({date: 'desc'}).then(posts => {
        res.render('admin/posts/read', {posts})
    })
})

router.get('/posts/create', (req, res) => {
    Category.find().lean().then(categories => {
        res.render('admin/posts/create', { categories })
    }).catch(err => {
        req.flash('error_msg', 'Error loading categories')
        res.redirect('/admin')
    })
})

router.post('/posts/create', (req, res) => {
    
    const error = []
    const newPost = {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        content: req.body.content,
        category: req.body.category
    }

    if(newPost.category == '0'){
        error.push({text: 'Categoria invalida, registre uma categoria'})
    }

    if(error.length > 0){
        res.render('admin/posts/create', {error})
    }else{
        new Post(newPost).save().then(() => {
            req.flash('success_msg', 'Post criado com sucesso')
            res.redirect('/admin/posts')
        }).catch(err => {
            req.flash('error_msg', 'Erro ao criar posts')
            res.redirect('/admin/posts')
        })
    }
})

router.get('/posts/update/:id', (req, res) => {
    Post.findById({_id: req.params.id}).lean().then(post => {
        Category.find().lean().then(categories => {
            res.render('admin/posts/update', {post, categories} )
        }).catch(err => {
            req.flash('error_msg', 'Erro ao carregar categorias')
            res.redirect('/admin/posts')
        })
    }).catch(err => {
        req.flash('error_msg', 'Erro ao carregar postagem')
        res.redirect('/admin/posts')
    })
})

router.post('/posts/update', (req, res) => {
    Post.findById({_id: req.body.id}).then(post => {
        
        post.title = req.body.title
        post.slug = req.body.slug
        post.description = req.body.description
        post.content = req.body.content
        post.category = req.body.category

        post.save().then(() => {
            req.flash('success_msg', 'Successfully edited post')
            res.redirect('/admin/posts')
        }).catch(err => {
            req.flash('error_msg', 'Error editing post' + err)
            res.redirect('/admin/posts')
        })  
    })
})

router.get('/posts/delete/:id', (req, res) => {
    Post.findById({_id: req.params.id}).populate('category').lean().then(post => {
        res.render('admin/posts/delete', {post})
    }).catch(err => {
        req.flash('error_msg', 'Postagem não encontrada')
    })
})

router.post('/posts/delete', (req, res) => {
    Post.deleteOne({_id: req.body.id}).then(post => {
        req.flash('success_msg', 'Sucessfully deleted posting')
        res.redirect('/admin/posts')
    })
})


export default router