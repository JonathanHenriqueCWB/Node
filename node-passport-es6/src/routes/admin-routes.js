import {Router} from "express";
const router = Router()

// import controle de acesso
import admin from '../helpers/eAdmin.js'
const isAdmin = admin.vereficaAdmin

router.get('/', isAdmin, (req, res) => {
    res.send(`Rota com restrição de login ${req.user}`)
})

export default router