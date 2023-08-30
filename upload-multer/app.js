var express = require('express')
var app = express()
var mongoose = require('mongoose')
 
var fs = require('fs');
var path = require('path');

var imgModel = require('./models/image');


// Conexão com banco
const conn = require('./database/conn')
conn()

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
 
// Set EJS as templating engine
app.set("view engine", "ejs");

// Confi Multer
    var multer = require('multer');

    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });

    var upload = multer({ storage: storage });


    app.post('/', upload.single('image'), (req, res, next) => { 
        var obj = {
            name: req.body.name,
            desc: req.body.desc,
            img: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        }
        
        imgModel.create(obj).then((result) => {
            res.redirect('/')
        }).catch((err) => {
            console.log(err)
        })
    });

// Rotas
app.get('/', async (req, res) => {
    try {
        const img = await imgModel.find();
        res.render('imagesPage', {items: img})
    } catch (error) {
        console.log( "Caiu aqui " + error);
    }
});




app.listen(8080, () => console.log('Servidor rodando na porta 8080'))