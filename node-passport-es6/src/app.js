import express, { urlencoded } from 'express'
const app = express()
import { engine } from 'express-handlebars'
import user from './routes/user-routes.js'
import mongoose from 'mongoose'
import flash from 'connect-flash'
import session from 'express-session'
// Cofigurações do passport
import passport from 'passport'
import passportConfig from './config/auth.js'
passportConfig(passport);

// flash e session
// SESSION, PASSPORT, FLASH E MIDLEWARE
app.use(session({
    secret: 'crudmongo',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash('error')
    next()
})

// Conexão com mongoose
mongoose.connect('mongodb://localhost/node-passport-es6').then(() => {
    console.log('Successfully connected to the database')
}).catch(err => {
    console.log('Error connecting to database')
})

// Body parser
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Confi expresss-handlebars (template engine)
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Routes
app.use('/users', user)
app.get('/', (req, res) => { res.render('home') })

const PORT = 8080
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))