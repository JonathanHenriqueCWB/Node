// Common js import
    // const LocalStrategy = passportLocal.Strategy
    // import { Strategy as LocalStrategy } from 'passport-local';

// ES6 Module import
import localStrategy from 'passport-local'
const LocalStrategy = localStrategy.Strategy

// Model e hash
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

export default (passport) => {

    // Middleware passando os campos de referencia e uma callback
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
        User.findOne({email: email}).then(user => {
            if(!user){
                return done(null, false, {message: 'Account not exist'})
            }

            bcrypt.compare(password, user.password, (error, batem) => {
                if(batem){
                    return done(null, user)
                }else {
                    return done(null, false, {message: 'Invalid password'})
                }
            })            
        })
    }))

    // Salvando os dados do usuário em uma sessão
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}