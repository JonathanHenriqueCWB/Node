export default {
    vereficaAdmin: function(req, res, next) {
        if(req.isAuthenticated()){
            return next()
        }

        req.flash('error_msg', 'Access denied please login before continuing')
        res.redirect('/')
    }
}

/**
 * Essa verificacao apenas serve para ver se o usuario esta logado,
 * caso queira verificacao administrativa alterar a model e colocar um 
 * campa eAdmin com valores 0 (false) ou 1 (true), tambem dever ser alterado
 * o if de verificacao adicionando a seguinte linha de codigo
 * req.isAutenticated() && req.user.isAdmin == 1
 */