import { Router } from 'express'
const router = Router()
import Category from '../models/Category.js'
import Product from '../models/Product.js'

router.get('/', (req, res) => res.render('admin/index'))

router.get('/categories', (req, res) => {
    Category.find().sort({date: 'desc'}).lean().then(categories => {
        res.render('admin/categories/read', {categories})
    })
})

router.get('/categories/create', (req, res) => {
    res.render('admin/categories/create')
})

router.post('/categories/create', (req, res) => {
    const newCategory = {
        name: req.body.name,
        slug: req.body.slug
     }

    new Category(newCategory).save().then(() => {
        req.flash('success_msg', 'Successfully created category')
        res.redirect('/admin/categories')
    }).catch(err => {
        req.flash('error_msg', 'Error creating category')
        res.redirect('/admin/categories')
    })
})

router.get('/categories/update/:id', (req, res) => {
    Category.findById({_id: req.params.id}).lean().then(category => {
        res.render('admin/categories/update', {category})
    }).catch(err => {
        req.flash('error_msg', 'Invalid category')
        res.redirect('/admin/categories')
    })
})

router.post('/categories/update', (req, res) => {
    Category.findById({_id: req.body.id}).then(category => {
        category.name = req.body.name
        category.slug = req.body.slug

        category.save().then(() => {
            req.flash('success_msg', 'Successfully created category')
            res.redirect('/admin/categories')
        })
    }).catch(err => {
        res.send('Categoria não encontrada')
    })
})

router.get('/categories/delete/:id', (req, res) => {
    Category.remove({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Successfully removed category')
        res.redirect('/admin/categories')
    })
})

router.get('/products', (req, res) => {
    Product.find().populate('category').lean().then(products => {
        res.render('admin/products/read', {products})
    })
})

router.get('/products/create', (req, res) => {
    Category.find().lean().then(categories => {
        res.render('admin/products/create', { categories })
    }).catch(err => {
        req.flash('error_msg', 'Error listing categories')
        res.redirect('/admin/products')
    })
})

router.post('/products/create', (req, res) => {

    const error = []
    const newProduct = {
        name: req.body.name,
        quantity: req.body.quantity,
        brand: req.body.brand,
        category: req.body.category,
        description: req.body.description
    }

    if(newProduct.category == '0'){
        error.push({text: 'Invalid product, register a product'})
    }

    if(error.length > 0) {
        res.render('admin/products/create', {error})
    }else{
        new Product(newProduct).save().then(() => {
            req.flash('success_msg', 'Successfully created product')
            res.redirect('/admin/products')
        }).catch(err => {
            req.flash('error_msg', 'Error created product')
            res.redirect('/admin/products')
        })
    }
})

router.get('/products/update/:id', (req, res) => {
    Product.findById({_id: req.params.id}).populate('category').lean().then(product => {
        Category.find().lean().then(categories => {
            res.render('admin/products/update', {product, categories})
        })
    })
})

router.post('/products/update', (req, res) => {

    Product.findById({_id: req.body.id}).then(product => {
        product.name = req.body.name
        product.quantity = req.body.quantity
        product.brand = req.body.brand
        product.category = req.body.category
        product.description = req.body.description

        product.save().then(() => {
            req.flash('success_msg', 'Successfully updating product')
            res.redirect('/admin/products')
        }).catch(err => {
            req.flash('error_msg', 'Error editing product' + err)
            res.redirect('/admin/products')
        })
    })
})

router.get('/products/delete/:id', (req, res) => {
    Product.deleteOne({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Sucessfully deleted product')
        res.redirect('/admin/products')
    }).catch(err => {
        req.flash('error_msg', 'Error deleting product')
        res.redirect('/admin/products')
    })
})

export default router