import { Router } from "express";
import Usuario from "../models/Usuario.js";
const router = Router()
import bcrypt from 'bcrypt' // hash para senhas

router.get('/', (req, res) => res.send('Projeto teste hash javascript'))

router.get('/registrar', (req, res) => {
    res.render('usuarios/registrar')
})

router.post('/registrar', (req, res) => {
    
    const error =[]

    if(!req.body.nome || typeof req.body.nome == null || req.body.nome == undefined){
        error.push({texto: 'O campo nome deve estar preenchido'})
    }
    if(!req.body.email || typeof req.body.email == null || req.body.email == undefined){
        error.push({texto: 'O campo email deve estar preenchido'})
    }
    if(!req.body.senha || typeof req.body.senha == null || req.body.senha == undefined){
        error.push({texto: 'O campo senha deve estar preenchido'})
    }
    if(!req.body.confirmaSenha || typeof req.body.confirmaSenha == null || req.body.confirmaSenha == undefined){
        error.push({texto: 'O campo confirma senha deve estar preenchido'})
    }
    if(req.body.senha != req.body.confirmaSenha){
        error.push({texto: 'As senha devem ser iguais'})
    }

    if(error.length > 0){
        res.render('usuarios/registrar', {error})
    }else {
        const usuario = new Usuario ({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
        })

        Usuario.findOne({email: req.body.email}).then(u => {
            if(u){
                error.push({texto: 'Esse email já se encontra cadastrado'})
                res.render('usuarios/registrar', {error})
            }else {
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(usuario.senha, salt, (error, hash) => {
                        if(error){
                            req.flash('error_msg', 'Erro ao gerar hash. Por favor verefique o código fonte')
                            res.redirect('/')
                        }
                        
                        usuario.senha = hash
                        
                        usuario.save().then(() => {
                            req.flash('success_msg', 'Cadastro realizado com sucesso')
                            res.redirect('/')
                        }).catch(err => {
                            req.flash('success_msg', 'Erro ao salvar registro')
                            res.redirect('/')
                        })
                    })
                })
            }
        })
    }
})

export default router