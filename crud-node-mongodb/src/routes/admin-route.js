import { Router } from 'express'
const router = Router()

import Category from '../models/Category.js'

router.get('/', (req, res) => res.render('admin/index'))

// Categoria
router.get('/categories', (req, res) => {
    Category.find().sort({date: 'desc'}).lean().then(categories => {
        res.render('admin/category/read', {categories})
    })
})

router.get('/categories/create', (req, res) => {
    res.render('admin/category/create')
})

router.post('/categories/create', (req, res) => {
    const newCategory = {
        name: req.body.name,
        slug: req.body.slug
     }

    new Category(newCategory).save().then(() => {
        req.flash('success_msg', 'Category successfully created')
        res.redirect('/admin/category')
    }).catch(err => {
        req.flash('error_msg', 'Error creating category')
        res.redirect('/admin/category')
    })
})


export default router