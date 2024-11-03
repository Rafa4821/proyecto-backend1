import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';

const app = express();

// Conectar a MongoDB
const uri = "mongodb+srv://rafaellucero998:BSdrJvU2XtTMRJ3x@proyectobackend1.tzyy9.mongodb.net/sample_mflix";
mongoose.connect(uri)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(error => console.error("Error de conexión a MongoDB:", error));

// Configuración del motor de plantillas Handlebars con opciones de seguridad desactivadas
app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
