import { Router } from 'express';
import fs from 'fs';

const router = Router();
const productsFilePath = './src/data/products.json';

const readProductsFile = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};


router.get('/', (req, res) => {
    const { limit } = req.query;
    const products = readProductsFile();
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

// GET
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProductsFile();
    const product = products.find(p => p.id === pid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
});

// POST
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    const products = readProductsFile();
    const newProduct = {
        id: Date.now().toString(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };
    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
});

// PUT
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    const products = readProductsFile();
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) return res.status(404).json({ message: 'Producto no encontrado' });
    const updatedProduct = {
        ...products[productIndex],
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    };
    products[productIndex] = updatedProduct;
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.json(updatedProduct);
});

// DELETE
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    let products = readProductsFile();
    const productIndex = products.findIndex(p => p.id === pid);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

    res.status(200).json({ message: `Producto con id ${pid} se ha borrado` });
});

export default router;
