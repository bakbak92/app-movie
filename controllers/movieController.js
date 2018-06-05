const Movie = require('../model/Movie')

exports.getMovies = (req, res) => {
    const title = "Liste des tes films préféré"
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
}

exports.postMovies = (req, res) => {
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
}

exports.getDetails = (req, res) => {
    if(!req.params) {
        res.sendStatus(400)
    }else {
        const id = req.params.id
        Movie.findById(id, (err, movie) => {
            console.log(movie._id)
            res.render('movie-details', {movie: movie})
        })
    }
    // récuper un élement grace a son id
    // 1 param l'id 2 callback avec erreur et la data
    
}

exports.updateMovie = (req, res) => {
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
}

exports.deleteMovie = (req, res) => {
    const id = req.params.id
    // pour supprimer element
    Movie.findByIdAndRemove(id, (err, movie) => {
        // status qui correspond a une supression
        res.sendStatus(202)
    })
}

