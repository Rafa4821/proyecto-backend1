import { Router } from 'express';
import Movie from '../models/Product.js'; // Ahora estamos usando el modelo de "Movie"

const router = Router();

// GET all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().limit(20); // Limita a 20 películas para evitar una carga excesiva
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
