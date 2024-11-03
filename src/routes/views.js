import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.get('/home', async (req, res) => {
    try {
        // Obtiene solo 8 productos de la base de datos para la vista de home
        const products = await Product.find().limit(8);
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener productos");
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        // Obtiene solo 8 productos de la base de datos para la vista de productos en tiempo real
        const products = await Product.find().limit(8);
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener productos");
    }
});

export default router;
