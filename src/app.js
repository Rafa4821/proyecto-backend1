import express from 'express';
import { Server } from 'socket.io'; 
import { createServer } from 'http'; 
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import fs from 'fs';

const app = express();
const httpServer = createServer(app); 
const io = new Server(httpServer); 

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

let products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf-8'));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('productList', products);

    socket.on('newProduct', (product) => {
        product.id = Date.now().toString();
        products.push(product);

        fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
        io.emit('productList', products);
    });

    socket.on('deleteProduct', (productId) => {
        products = products.filter(product => product.id !== productId);

        fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
        io.emit('productList', products);
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
