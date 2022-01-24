import { Router } from "express";
const router = Router()

import User from '../models/User.js'
import bcrypt from 'bcrypt'
import passport from 'passport'

router.get('/', (req, res) => res.send('Please access user register or user login routes'))

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', (req, res) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword
    }

    // Falta as verificações no servidor

    User.findOne({email: req.body.email}).then(user => {
        // Verefica se já existe usuário com esse email
        if(user){
            req.flash('error_msg', 'Email already registred')
            res.redirect('/users/register')
        }else {
            // Hash para senha
            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    if(error){
                        req.flash('error_msg', 'Erro ao gerar hash. Por favor verefique o código fonte')
                        res.redirect('/')
                    }

                    newUser.password = hash
                    
                    new User(newUser).save().then(() => {
                        req.flash('success_msg', 'User registered successfully')
                        res.redirect('/users/register')
                    }).catch(err => {
                        req.flash('error_msg', 'Error registering user')
                        res.redirect('/users/register')
                    })
                })
            })
        }
    })
})

router.get('/login', (req, res) => {
    res.render('user/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

export default router