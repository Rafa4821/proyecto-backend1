import { Router } from 'express';
import fs from 'fs';

const router = Router();
const cartsFilePath = './src/data/carts.json';
const productsFilePath = './src/data/products.json';

const readCartsFile = () => {
    const data = fs.readFileSync(cartsFilePath);
    return JSON.parse(data);
};

const readProductsFile = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};

router.get('/', (req, res) => {
    const carts = readCartsFile();
    res.json(carts);
});

router.post('/', (req, res) => {
    const carts = readCartsFile();
    const newCart = {
        id: Date.now().toString(),
        products: []
    };
    carts.push(newCart);
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readCartsFile();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
});

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = readCartsFile();
    const products = readProductsFile();

    const cart = carts.find(c => c.id === cid);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const product = products.find(p => p.id === pid);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cartProduct = cart.products.find(p => p.id === pid);

    if (cartProduct) {
        cartProduct.quantity += 1;
        cartProduct.subtotal = cartProduct.price * cartProduct.quantity;
    } else {
        cart.products.push({ 
            id: pid, 
            title: product.title, 
            price: product.price, 
            quantity: 1,
            subtotal: product.price 
        });
    }

    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    res.status(201).json(cart);
});

export default router;
