import localStrategy from 'passport-local'
const LocalStrategy = localStrategy.Strategy

import User from '../models/User.js'
import bcrypt from 'bcrypt'

export default passport => {
    // Buscar usuário e autentiar com passport-local
    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
        User.findOne({email: email}).then(user => {
            // Pesquisa usuário na base, caso não ache...
            if(!user){
                return done(null, false, {message: 'This account does not exist'})
            }

            // Use o hash para coparar as senha caso a mesma tenha um HASH
            bcrypt.compare(password, user.password, (error, batem) => {
                //Caso as senhas sejam identicas
                if(batem) {
                    return done(null, user)
                }else{
                    return done(null, false, {message: 'Incorrect password'})
                }
            })
        })
    }))

    // Salvar e recuperar usuário na sessão
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
 * Arquivo irá exporta uma arrow function contendo toda configuração de 
 * autenticação no servidor por usuário, salvar e recupear usuário na sessão
 */

