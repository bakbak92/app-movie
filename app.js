const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = 3000
const multer = require('multer')
const upload = multer()
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
// pour servir des file static
app.use('/public', express.static('public'))
// use body parser
//app.use(bodyParser.urlencoded({extended: false}))


//method sed
// on déclare un répartoire qu'on nome views qui se trouve ds views
app.set('views', './views')
// déclare les template
app.set('view engine', 'ejs')

// toute les page sont access que si il y a un token, sauf la page login
app.use(expressJwt({secret: secret}).unless({path: ['/login']}))
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq'


// method get 
app.get('/', (req, res) => {
    // envoyer template
    res.render('index')
})

app.get('/movies/add', (req, res) => {
    res.send('ajout un film')
 })



let frenchMovies = []

app.get('/movies/', (req, res) => {
    const title = 'Films français des trente dernières années'
    frenchMovies = [
        {title: 'le fabuleux destin d\'Amélie Poulain', year: 2001},
        {title: 'Buffet froid', year: 1979},
        {title: 'Le diner de cons', year: 1998},
        {title: 'De rouille et d\'os,', year: 2012}
    ]
    res.render('movies', {movies: frenchMovies, title: title})
})
app.get('/movie-search', (req, res) => {
    res.render('movie-search')
})

app.get('/login', (req, res) => {
    res.render('login', {title : "Espace membre"})
})
const urlencoded = bodyParser.urlencoded({extended: false})
const fakeUser = {email: 'testuser@testmail.fr', password: 'qsd'}
// qui sera checker par le serveur
app.post('/login', urlencoded, (req, res) => {
    console.log('login post', req.body)
    if(!req.body) {
        res.sendStatus(500)
    }else {
        if(fakeUser.email === req.body.email && fakeUser.password == req.body.password){
            const myToken = jwt.sign({iss: 'http://expressmovie.fr', user: 'Sam', role: 'moderator'}, secret)
            res.json(myToken)
        }else {
            res.sendStatus(401)
        }
    }
})
// :id permet de metre en parametre une data
app.get('/movies/:id/', (req, res) => {
    const id = req.params.id
    res.render('movie-details', {movieid: id})
})


app.post('/movies', upload.fields([]), (req, res) => {
    if(!req.body) {
        return res.sendStatus(500)
    } else {
        const formData = req.body
        console.log('formData:', formData)
        const newMovie = { title: req.body.movietitle, year: req.body.movieyear}
        frenchMovies = [...frenchMovies, newMovie]
        res.sendStatus(201)
    }
})
// il faut réguler le body d'une requete graace un middle wear

/*app.post('/movies', urlencoded, (req, res) => {
    console.log('le titre :', req.body.movietitle)
    console.log('année :', req.body.movieyear)
    const newMovie = { title: req.body.movietitle, year: req.body.movieyear}

    // on créé un new tableau avec un elmt en +
    frenchMovies = [...frenchMovies, newMovie]
    console.log(frenchMovies)
    res.sendStatus(201)
})*/

// method listen écoute un port
app.listen(3000, () => {
    // action si le port est bien lancé
    console.log(`listening on port ${PORT}`)
})