export default {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.isAdmin == 1) {
            return next()
        }

        req.flash("error_msg", "Access danied!")
        res.redirect('/')
    }
}