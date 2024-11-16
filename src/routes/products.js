import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 8, sort, category, priceMin, priceMax } = req.query;

       
        const query = {};
        if (category) query.category = category; 
        if (priceMin) query.price = { ...query.price, $gte: parseFloat(priceMin) }; 
        if (priceMax) query.price = { ...query.price, $lte: parseFloat(priceMax) }; 

        
        const sortOption = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortOption[field] = order === 'desc' ? -1 : 1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const products = await Product.find(query).sort(sortOption).skip(skip).limit(parseInt(limit));

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / parseInt(limit));

        res.json({
            products,
            totalProducts,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, category, plot } = req.body;

        if (!title || !description || !price || !category) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
