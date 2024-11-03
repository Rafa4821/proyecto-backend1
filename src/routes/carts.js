import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = Router();

// GET all carts
router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new cart
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart();
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a cart by id
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST add a product to a cart
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        const cartProduct = cart.products.find(p => p.product.equals(product._id));

        if (cartProduct) {
            cartProduct.quantity += 1;
        } else {
            cart.products.push({ product: product._id, quantity: 1 });
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
