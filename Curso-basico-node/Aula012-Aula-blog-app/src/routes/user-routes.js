import { Router } from 'express'
import User from '../models/User.js'
const router = Router()

import bcrypt from 'bcryptjs'
import passport from 'passport'

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', (req, res) => {
    const newUser = {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }

    const error = []

    if(!req.body.name || typeof req.body.name == null || req.body.name == undefined){
        error.push({text: 'Name is required!'})
    }
    if(!req.body.lastname || typeof req.body.lastname == null || req.body.lastname == undefined){
        error.push({text: 'Lastname is required!'})
    }
    if(!req.body.email || typeof req.body.email == null || req.body.email == undefined){
        error.push({text: 'Email is required!'})
    }
    if(!req.body.password || typeof req.body.password == null || req.body.password == undefined){
        error.push({text: 'Password is required!'})
    }
    if(!req.body.confirmPassword || typeof req.body.confirmPassword == null || req.body.confirmPassword == undefined){
        error.push({text: 'ConfirmPassword is required!'})
    }

    if(req.body.password != req.body.confirmPassword) {
        error.push({text: 'The password must match'})
    }

    if( error.length > 0 ) {
        res.render('users/register', {error})
    }else {
        User.findOne({email: req.body.email}).then(user => {
            if(user){
                req.flash('error_msg', 'There is already a user with this email.')
                res.redirect('/users/register')
            }else {                
                const newUser = new User({
                    name: req.body.name,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password
                })
                
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error){
                            req.flash('error_msg', 'Error generating password hash (encryption)')
                            res.redirect('/')
                        }

                        newUser.password = hash

                        newUser.save().then(() => {
                            req.flash('success_msg', 'Usuario cadastrado com sucesso')
                            res.redirect('/')
                        }).catch(err => {
                            req.flash('error_msg', 'Erro ao cadastrar novo usuário')
                            res.redirect('/')
                        })
                    })
                })
            }
        }).catch(err => {
            req.flash('error_msg', 'Internal error')
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

// Rota de authenticação
router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

export default router
