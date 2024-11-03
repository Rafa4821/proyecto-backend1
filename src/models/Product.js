import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    plot: String,
    genres: [String],
    runtime: Number,
    cast: [String],
    title: String,
    fullplot: String,
    languages: [String],
    released: Date,
    directors: [String],
    writers: [String],
    awards: {
        wins: Number,
        nominations: Number,
        text: String
    },
    lastupdated: String,
    year: Number,
    imdb: {
        rating: Number,
        votes: Number,
        id: Number
    },
    type: String
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
