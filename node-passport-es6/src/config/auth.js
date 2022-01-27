import localStrategy from 'passport-local'
const LocalStrategy = localStrategy.Strategy

import User from '../models/User.js'
import bcrypt from 'bcrypt'

export default passport => {
    // Buscar usuario e autentiar com passport-local
    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
        User.findOne({email: email}).then(user => {
            // Pesquisa usuario na base, caso nao ache...
            if(!user){
                return done(null, false, {message: 'This account does not exist'})
            }

            // Compara as senhas com hash
            bcrypt.compare(password, user.password, (error, batem) => {
                // Caso as senhas sejam identicas
                if(batem) {
                    return done(null, user)
                }else{
                    return done(null, false, {message: 'Incorrect password'})
                }
            })
        })
    }))

    // Salvar e recuperar usuario na sessao
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

/**
 * Arquivo ira exporta uma arrow function contendo toda configuracao de 
 * autenticacao no servidor por usuario, salvar e recupear usuario na sessao
 */

