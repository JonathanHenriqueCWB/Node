import Categoria from '../models/Categoria.js' 
import { Router } from "express";
const router = Router()

router.get('/', (req, res) => res.render('admin/index'))

// CATEGORIAS
    router.get('/categorias', (req, res) => {
        Categoria.find().lean().sort({date: 'desc'}).then(categorias => {
            res.render('admin/categorias/read', { categorias })
        }).catch(err => {
            req.flash('error_msg', 'Erro ao carregar categorias')
            req.redirect('/admin')
        })
    })

    router.get('/categorias-cadastrar', (req, res) => {
        res.render('admin/categorias/create')
    })

    router.post('/categorias-cadastrar', (req, res) => {

        var erros = []

        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: 'nome invalido'})
        }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: 'slug invalido'})
        }
        if(req.body.nome.length < 3){
            erros.push({texto: 'nome deve ser maior de 3 caracteres'})
        }
        if(req.body.slug.length < 3){
            erros.push({texto: 'slug deve ser maior de 3 caracteres'})
        }

        if(erros.length > 0){
            res.render('admin/categorias/create', { erros })
        }else{

            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }
    
            new Categoria(novaCategoria).save().then(() => {

                // Essa requisição cairá no middleware 
                // A msg criada no flash será repasada para variaveis globais
                // As variaveis globais servirão para um view (partials)
                req.flash('success_msg', 'Categoria salva com sucesso')
                res.redirect('/admin/categorias')

            }).catch(err => {
                req.flash('error_msg', 'Erro ao salvar categoria')
                res.redirect('/admin')
            }) 
        }
    })

    router.get('/categorias-atualizar/:id', (req, res) => {
        Categoria.findOne({_id: req.params.id}).lean().then(categoria => {
            res.render('admin/categorias/update', { categoria })
        }).catch(err => {
            req.flash('error_msg', 'Categoria inexistente')
            res.redirect('/admin')
        })
    })

    router.post('/categorias-atualizar', (req, res) => {

        const erros = []

        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({texto: 'nome invalido'})
        }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: 'slug invalido'})
        }

        if(req.body.nome < 3 ){
            erros.push({texto: 'Nome muito curto'})
        }
        if(req.body.slug < 3){
            erros.push({texto: 'Slug muito curto'})
        }

        if(erros > 0) {
            res.render('admin/categorias/update', { erros })
        }else {
            // Atualizando categoria
            Categoria.findById({_id: req.body.id}).then(categoria => {
                categoria.nome = req.body.nome
                categoria.slug = req.body.slug
    
                categoria.save().then(() => {
                    req.flash('success_msg', 'Categoria editada com sucesso')
                    res.redirect('/admin/categorias')
                }).catch(err => {
                    req.flash('error_msg', 'Erro ao salvar categoria' + err)
                    res.redirect('/admin/categorias')
                })
    
            }).catch(err => {
                req.flash('error_msg', 'Houve um erro ao editar categoria' + err)
                res.redirect('/admin/categorias')
            })
        }

    })

    router .get('/categorias-deletar', (req, res) => {
        res.render('admin/categorias/delete')
    })

export default router