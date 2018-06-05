const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()
const faker = require('faker')
const config = require('./config')
const mongoose = require('mongoose')
const movieController = require('./controllers/movieController')
console.log(config)
// se connecter a sa db 
mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@ds147440.mlab.com:47440/appmovie`)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: cannot connect to my DB'))
db.once('open', () => {
    console.log('connected to the DB :)')
})




const port = 3000
let frenchMovies = []

app.set('views', './views')
app.set('view engine', 'ejs')


// to service static files from the public folder
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/movies', (req, res) => {
    res.render('movies')
})

app.get('/movielist' , movieController.getMovies)

app.post('/movies', upload.fields([]), movieController.postMovies)


// create application/x-www-form-urlencoded parser
// https://github.com/expressjs/body-parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.get('/movie-details/:id', movieController.getDetails)
app.post('/movie-details/:id', urlencodedParser, movieController.updateMovie)

app.delete('/movie-details/:id', movieController.deleteMovie)
app.get('/movie-search', (req, res) => {
    res.render('movie-search')
})



app.listen(port, () => {
    console.log(`listening on port ${port}`)
})