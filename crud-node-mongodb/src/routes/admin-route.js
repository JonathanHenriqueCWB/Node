import { Router } from 'express'
const router = Router()
import Product from '../models/Product.js'

// ########## MAIN ROUTE (INDEX) ##########
router.get('/', (req, res) => res.render('admin/index'))

// ########## READ ##########
router.get('/products', (req, res) => {
    Product.find().lean().sort({date: 'desc'}).then(products => {
        res.render('admin/products/read', {products})
    })
})

// ########## CREATE ##########
router.get('/products/create', (req, res) => {
    res.render('admin/products/create')
})
router.post('/products/create', (req, res) => {

    const error = []
    const product = {
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        brand: req.body.brand,
        description: req.body.description
    }

    if(!product.name || typeof product.name == undefined || product.name == null){
        error.push({text: 'name cannot be empty'})
    }
    if(product.name.length < 3) {
        error.push({text: 'Name must have at least 3 characters'})
    }

    if(error.length > 0 ){
        res.render('admin/products/create', {error})
    }else {
        new Product(product).save().then(() => {
            req.flash('success_msg', 'Product saved successfully')
            res.redirect('/admin/products')
        }).catch(err => {
            req.flash('error_msg', 'Error saving product')
            res.redirect('/admin/products')
        })
    }
})

// ########## UPDATE ##########
router.get('/products/update/:id', (req, res) => {
    Product.findById({_id: req.params.id}).lean().then(p => {
        res.render('admin/products/update', {p})
    })
})

router.post('/products/update', (req, res) => {
    Product.findById({_id: req.body.id}).then(product => {
        console.log(product)
        product.name = req.body.name
        product.category = req.body.category
        product.quantity = req.body.quantity
        product.brand = req.body.brand
        product.description = req.body.description
    
        product.save().then(() => {
            req.flash('success_msg', 'Category successfully changed')
            res.redirect('/admin/products')
        }).catch(err => {
            req.flash('error_msg', 'Error changing category')
            res.redirect('/admin/products')
        })
    })
})

// ########## DELETE ##########
router.get('/products/delete/:id', (req, res) => {
    Product.findById({_id: req.params.id}).lean().then(p => {
        res.render('admin/products/delete', {p})
    }).catch(err => {
        req.flash('error_msg', 'Product does not exist')
        res.redirect('/admin/products')
    })
})
router.post('/products/delete', (req, res) => {
    Product.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Product removed successfully')
        res.redirect('/admin/products')
    }).catch(err => {
        req.flash('error_msg', 'Error removing product')
        res.redirect('/admin/products')
    })
})


export default router