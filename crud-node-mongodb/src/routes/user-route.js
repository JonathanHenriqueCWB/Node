import { Router } from 'express'
const router = Router()
import User from '../models/User.js'
import bcrypt from 'bcrypt'

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', (req, res) => {
    const error = []
    
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        error.push({text: 'Preencha corretamente o campo nome'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        error.push({text: 'Preencha corretamente o campo email'})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        error.push({text: 'Preencha corretamente o campo senha'})
    }
    if(!req.body.confirmPassword || typeof req.body.confirmPassword == undefined || req.body.confirmPassword == null){
        error.push({text: 'Preencha corretamente o campo confirma senha'})
    }
    if(req.body.password != req.body.confirmPassword){
        error.push({text: 'O campo senha e confirmar senha devem ser iguais'})
    }

    if(error.length > 0) {
        res.render('users/register', {error})
    } else {
        
        User.findOne({email: req.body.email}).then(user => {
            if(user){
                req.flash('error_msg', 'There is already a user with this email.')
                res.redirect('/user/register')
            }else {
                const newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }
        
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error){
                            req.flash('error_msg', 'Error generate hash for password')
                            res.redirect('/')
                        }
        
                        newUser.password = hash
        
                        new User(newUser).save().then(() => {
                            req.flash('success_msg', 'Created user successfylly')
                            res.redirect('/')
                        }).catch(err => {
                            req.flash('error_msg', 'Error creating user')
                            res.redirect('/')
                        })
                    })
                })
            }
        })        
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

export default router