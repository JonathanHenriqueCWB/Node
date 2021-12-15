import Category from '../models/Categoria.js' 
import { Router } from "express";
const router = Router()

router.get('/', (req, res) => res.render('admin/index'))

router.get('/category', (req, res) => {
    Category.find().lean().sort({date: 'desc'}).then(categorias => {
        res.render('admin/category/read', { categorias })
    }).catch(err => {
        req.flash('error_msg', 'Erro ao carregar categorias')
        req.redirect('/admin')
    })
})

router.get('/category/create', (req, res) => {
    res.render('admin/category/create')
})

router.post('/category/create', (req, res) => {

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
        res.render('admin/category/create', { erros })
    }else{
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }

        new Category(newCategory).save().then(() => {
            req.flash('success_msg', 'Category successfully created')
            res.redirect('/admin/category')

        }).catch(err => {
            req.flash('error_msg', 'Error creating category')
            res.redirect('/admin')
        })
    }
})


router.get('/category/update/:id', (req, res) => {
    Category.findOne({_id: req.params.id}).lean().then(category => {
        res.render('admin/category/update', { category })
    }).catch(err => {
        req.flash('error_msg', 'Categoria inexistente')
        res.redirect('/admin')
    })
})
    
router.post('/category/update', (req, res) => {

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
        res.render('admin/category/update', { erros })
    }else {
        Category.findById({_id: req.body.id}).then(category => {
            category.name = req.body.name
            category.slug = req.body.slug

            category.save().then(() => {
                req.flash('success_msg', 'Successfully edited category')
                res.redirect('/admin/category')
            }).catch(err => {
                req.flash('error_msg', 'Error editing category' + err)
                res.redirect('/admin/category')
            })    
        }).catch(err => {
            req.flash('error_msg', 'Non-existent category' + err)
            res.redirect('/admin/category')
        })
    }
})

router .get('/category/delete/:id', (req, res) => {
    Category.findOne({_id: req.params.id}).lean().then(category => {
        res.render('admin/category/delete', { category })
    }).catch(err => {
        req.flash('error_msg', 'Categoria não encontrada')
        res.redirect('/admin/category')
    })
})

router.post('/category/delete', (req, res) => {
    Category.deleteOne({_id: req.body.id}).then(category => {
        req.flash('success_msg', 'Category successfully deleted')
        res.redirect('/admin/category')
    }).catch(err => {
        req.flash('error_msg', 'Error erasing category')
        res.redirect('/admin/category')
    })
})

export default router