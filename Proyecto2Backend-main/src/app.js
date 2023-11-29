import express from 'express';
import cors from 'cors';
import authenticateToken from '../Proyecto2Backend-main/autorizacion';
import usuariosRoutes from '../Proyecto2Backend-main/Usuarios/usuarios.routes'
import restaurantesRoutes from '../Proyecto2Backend-main/Restaurantes/restaurante.routes'
import productosRoutes from '../Proyecto2Backend-main/Productos/productos.routes'
import pedidoRoutes from '../Proyecto2Backend-main/Pedidos/pedido.routes'
import authRoutes from '../Proyecto2Backend-main/Usuarios/auth.routes'

// Creacion del app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/usuarios',authenticateToken, usuariosRoutes)
app.use('/restaurante',authenticateToken, restaurantesRoutes)
app.use('/productos',authenticateToken, productosRoutes)
app.use('/pedido',authenticateToken, pedidoRoutes)
app.use('/login')

// Endpoint para 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found.' });
});

export default app;
