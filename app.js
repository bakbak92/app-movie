const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()
const faker = require('faker')
const expressJwt = require('express-jwt') 
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const config = require('./config')
console.log(config)
// se connecter a sa db 
mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@ds147440.mlab.com:47440/appmovie`)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: cannot connect to my DB'))
db.once('open', () => {
    console.log('connected to the DB :)')
})

//faire un schema
const movieShema = mongoose.Schema({
    movietitle: String,
    movieyear: Number
})


// Model 2 param nom de notre collection et schema
const Movie = mongoose.model('Movie', movieShema)
// genere une phrase en 3 mots
const title = faker.lorem.sentence(3)
// gener des année 
const year = Math.floor(Math.random() * 80) +1950



const port = 3000
let frenchMovies = []

app.set('views', './views')
app.set('view engine', 'ejs')


// to service static files from the public folder
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq'
//app.use(expressJwt({ secret: secret}).unless({path:['/','/movies', 'movie-search', '/login']}))

app.get('/movies', (req, res) => {

    const title = "Films français des 30 dernières années"
    frenchMovies = []
    // récup data de la db 
    //1 param l'erreur , 2 data
    Movie.find((err, movies) => {
        if(err) {
            console.error('could not retrive movies from Db')
            res.sendStatus(500)
        }else{
            frenchMovies = movies
            res.render('movies', { title: title, movies: frenchMovies})
        }
    })
    
})

// // create application/x-www-form-urlencoded parser
// // https://github.com/expressjs/body-parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

// app.post('/movies', urlencodedParser, (req, res) => {
//     if (!req.body) {
//         return res.sendStatus(400)
//     } else {
//         // res.send('welcome, ' + req.body.movietitle)
//         console.log('req.body', req.body)
//         res.send(req.body.movietitle)
//     } 
// })

//!\ In upload.fields([]), the empty array '[]' is required
app.post('/movies', upload.fields([]), (req, res) => {
    if (!req.body) {
        return res.sendStatus(500)
    } else {
        const formData = req.body 
        console.log('form data: ', formData)
        // on récup data
        const title = req.body.movietitle
        const year = req.body.movieyear
        // on fais une new instance
        const myMovie = new Movie({movietitle: title, movieyear: year})
        // on persister les datas
        myMovie.save((err, savedMovie) => {
            if(err){
                console.error(err)
                return
            }else {
               console.log(savedMovie)
               res.sendStatus(201) 
            }
        })
    } 
})


// create application/x-www-form-urlencoded parser
// https://github.com/expressjs/body-parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/movies-old-browser', urlencodedParser, (req, res) => {
    if (!req.body) {
        return res.sendStatus(500)
    } else {        
        frenchMovies = [... frenchMovies, { title: req.body.movietitle, year: req.body.movieyear }]
        res.sendStatus(201)
    } 
})


app.get('/movies/add', (req, res) => {
    res.send('prochainement, un formulaire d\'ajout ici')
})

app.get('/movies/:id', (req, res) => {
    const id = req.params.id
    res.render('movie-details')
})
app.get('/movie-details/:id', (req, res) => {
    const id = req.params.id
    // récuper un élement grace a son id
    // 1 param l'id 2 callback avec erreur et la data
    Movie.findById(id, (err, movie) => {
        console.log(movie._id)
        res.render('movie-details', {movie: movie})
    })
})
app.post('/movie-details/:id', urlencodedParser, (req, res) => {
    const id = req.params.id
    if(!req.body){
        return res.sendStatus(500)
    }else{
        console.log('movietitle:', req.body.movietitle, 'movieyear:', req.body.movieyear)
    }
    // modif data
    Movie.findByIdAndUpdate(id, {$set: {movietitle: req.body.movietitle, movieyear: req.body.movieyear}}, (err,movie) => {
        if(err) {
            console.log(err)
            return res.sendStatus('le film na pas pu etre mis a jour')
        }else{
            // redirige a movie
            res.redirect('/movies')
        }
    })
})

app.delete('/movie-details/:id', (req, res) => {
    const id = req.params.id
    // pour supprimer element
    Movie.findByIdAndRemove(id, (err, movie) => {
        // status qui correspond a une supression
        res.sendStatus(202)
    })
})
app.get('/movie-search', (req, res) => {
    res.render('movie-search')
})

app.get('/login', (req, res) => {
    res.render('login', { title: 'Espace membre'})
})

const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' }


app.post('/login', urlencodedParser, (req, res) => {
    console.log('login post', req.body)
    if (!req.body) {
        return res.sendStatus(500)
    } else {        
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            // iss means 'issuer'
            const myToken = jwt.sign({iss: 'http://expressmovies.fr', user: 'Sam', role: 'moderator'}, secret)
            console.log('myToken', myToken)
            res.json(myToken)
        } else {
            res.sendStatus(401)
        } 
    } 
})
app.get('/member-only'), (req, res) =>{
    console.log('req.user', req.user)
}

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})