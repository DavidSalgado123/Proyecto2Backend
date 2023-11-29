import app from "../src/app";
import request from "supertest";
const userid = "";
const token = "";

describe("Pruebas de rutas de usuarios", () => {
  // Endpoint POST /usuarios
  test("POST /usuarios debería devolver un código 201", async () => {
    const usuarioNuevo = {
      nombre: "Juan",
      apellido: "Alimana",
      direccion: "Por mi casa",
      fotoPerfil: "URL foto fea",
      telefono: "123456789",
      correo: "juanlamechita@gmail.com",
      contrasena: "IcKKcK69",
    };
    const response = await request(app).post("/usuarios").send(usuarioNuevo);
    expect(response.statusCode).toBe(201);
    userid = response.body._id;
  });
  test("POST /usuarios deberia devolver un codigo 500", async () => {
    const usuarioNuevo = {
      name: "Jhontra",
      apellido: "volta",
    };
    const response = await request(app)
      .post("/usuarios")
      .send(usuarioNuevo)
      .set("Authorization", "Bearer tuTokenDeAutenticacion");
    expect(response.statusCode).toBe(500);
  });
  // Endpoint GET /usuarios
  test("GET /usuarios debería devolver un código 200", async () => {
    const response = await request(app)
      .get("/usuarios" + userid)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("GET /usuarios debería devolver un código 404 por ID", async () => {
    const response = await request(app)
      .get("/usuarios")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });

  test("GET /usuarios debería devolver un código 404 por token", async () => {
    const response = await request(app)
      .get("/usuarios" + userid)
      .set("Authorization", `Bearer tokenfake`);
    expect(response.statusCode).toBe(200);
  });

  // Endpoint PATCH /usuarios/:id
  test("PATCH /usuarios/:id debería devolver un código 200", async () => {
    const cambiosUsuario = {
      /* ...datos de usuario para modificar... */
    };
    const response = await request(app)
      .patch(`/usuarios/${userid}`) // Usa el ID del usuario creado
      .send(cambiosUsuario)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  // Endpoint DELETE /usuarios/:id
  test("DELETE /usuarios/:id debería devolver un código 204 para usuario eliminado", async () => {
    const response = await request(app)
      .delete(`/usuarios/${userid}`) // Usa el ID del usuario creado
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(204);
  });

  test("POST /usuarios debería devolver un código 400 para datos inválidos", async () => {
  const usuarioInvalido = {
    nombre: "", // Nombre vacío, suponiendo que es un campo obligatorio
    // Otros campos pueden ser omitidos o inválidos según tu esquema
  };
  const response = await request(app)
    .post("/usuarios")
    .send(usuarioInvalido)
    .set("Authorization", `Bearer ${token}`);
  expect(response.statusCode).toBe(400); 
  });

  test("PATCH /usuarios/:id debería devolver un código 404 para ID inexistente", async () => {
  const cambiosUsuario = {
    nombre: "Nombre Actualizado",
    // Otros cambios...
  };
  const idInexistente = "id_inexistente";
  const response = await request(app)
    .patch(`/usuarios/${idInexistente}`)
    .send(cambiosUsuario)
    .set("Authorization", `Bearer ${token}`);
  expect(response.statusCode).toBe(404); 
  });

  test("DELETE /usuarios/:id debería devolver un código 404 para ID inexistente", async () => {
  const idInexistente = "id_inexistente";
  const response = await request(app)
    .delete(`/usuarios/${idInexistente}`)
    .set("Authorization", `Bearer ${token}`);
  expect(response.statusCode).toBe(404); 
  });

  test("GET /usuarios debería devolver un código 401 para token inválido", async () => {
  const response = await request(app)
    .get("/usuarios")
    .set("Authorization", `Bearer token_invalido`);
  expect(response.statusCode).toBe(401); 
  });
});

describe('Pruebas de rutas de restaurantes', () => {
  let restauranteId; // Almacenará el ID del restaurante creado para su uso en pruebas posteriores

  // POST /restaurantes - Crear restaurante
  test('POST /restaurantes debería devolver un código 201 para restaurante creado', async () => {
    const nuevoRestaurante = {
      nombre: 'La Pizzería',
      categorias: ['Pizza', 'Italiana'],
      DomiciliariosPropios: true,
      costoEnvioPropio: 5000,
      tiempoEstimadoEnvio: '30 mins',
      administrador: 'id_administrador',
      calificacion: 4,
      ubicaciones: [{
        direccion: 'Calle 123',
        rangoServicioMaximo: 10
      }],
      menu: {
        categorias: ['Pizzas', 'Bebidas'],
        platos: [{
          nombre: 'Pizza Margarita',
          descripcion: 'Pizza clásica con tomate y mozarella',
          precio: 15000
        }]
      },
      habilitado: true
    };
    const response = await request(app).post('/restaurantes').send(nuevoRestaurante);
    expect(response.statusCode).toBe(201);
    restauranteId = response.body._id;
  });

  // GET /restaurantes - Obtener todos los restaurantes
  test('GET /restaurantes debería devolver un código 200', async () => {
    const response = await request(app).get('/restaurantes');
    expect(response.statusCode).toBe(200);
  });

  // GET /restaurantes/:id - Obtener un restaurante específico
  test('GET /restaurantes/:id debería devolver un código 200 para un ID válido', async () => {
    const response = await request(app).get(`/restaurantes/${restauranteId}`);
    expect(response.statusCode).toBe(200);
  });

  // PATCH /restaurantes/:id - Actualizar un restaurante
  test('PATCH /restaurantes/:id debería devolver un código 200 para una actualización válida', async () => {
    const cambiosRestaurante = {
      nombre: 'La Pizzería Deluxe',
      costoEnvioPropio: 6000
    };
    const response = await request(app).patch(`/restaurantes/${restauranteId}`).send(cambiosRestaurante);
    expect(response.statusCode).toBe(200);
  });

  // DELETE /restaurantes/:id - Eliminar un restaurante
  test('DELETE /restaurantes/:id debería devolver un código 204 para una eliminación válida', async () => {
    const response = await request(app).delete(`/restaurantes/${restauranteId}`);
    expect(response.statusCode).toBe(204);
  });

  // POST /restaurantes - Intento de crear un restaurante con datos inválidos
  test('POST /restaurantes debería devolver un código 400 para datos inválidos', async () => {
    const restauranteInvalido = {
      nombre: '', // Nombre vacío, siendo un campo obligatorio
  categorias: ['Categoría no válida'], 
  DomiciliariosPropios: true, 
  costoEnvioPropio: -100, // 
  tiempoEstimadoEnvio: '', // 
  calificacion: 6, 
  ubicaciones: [ 
    {
      direccion: '',
      rangoServicioMaximo: -5 
    }
  ],
  menu: {
    categorias: ['Pizzas'], 
    platos: [
      {
        nombre: 'Pizza con nombre extremadamente largo que excede el máximo permitido',
        descripcion: 'Una descripción que es demasiado larga y supera el límite de caracteres permitidos para la descripción de un plato en el menú.',
        precio: -200 
      }
    ]
  },
  habilitado: true
    };
    const response = await request(app).post('/restaurantes').send(restauranteInvalido);
    expect(response.statusCode).toBe(400);
  });
  
  // GET /restaurantes/:id - Intento de obtener un restaurante con ID inexistente
  test('GET /restaurantes/:id debería devolver un código 404 para un ID inexistente', async () => {
    const response = await request(app).get('/restaurantes/id_inexistente');
    expect(response.statusCode).toBe(404);
  });
  
  // PATCH /restaurantes/:id - Intento de actualizar un restaurante con datos inválidos
  test('PATCH /restaurantes/:id debería devolver un código 400 para datos inválidos', async () => {
    const cambiosInvalidos = {
      calificacion: 6,
    };
    const response = await request(app).patch(`/restaurantes/${restauranteId}`).send(cambiosInvalidos);
    expect(response.statusCode).toBe(400);
  });
  
  // DELETE /restaurantes/:id - Intento de eliminar un restaurante con ID inexistente
  test('DELETE /restaurantes/:id debería devolver un código 404 para un ID inexistente', async () => {
    const response = await request(app).delete('/restaurantes/id_inexistente');
    expect(response.statusCode).toBe(404);
  });
});

describe('Pruebas de rutas de pedidos', () => {
  let pedidoId; // Almacenará el ID del pedido creado para su uso en pruebas posteriores

  // POST /pedidos - Crear pedido
  test('POST /pedidos debería devolver un código 201 para pedido creado', async () => {
    const nuevoPedido = {
      restaurante: 'Restaurante Ejemplo',
      estadosPedido: ['Recibido'],
      tiempoEstimadoLlegada: '30 mins',
      calificacionUsuario: 4,
      domiciliario: {
        nombre: 'Juan',
        telefono: '1234567890',
        foto: 'url_a_la_foto'
      },
      valorTotal: 50000,
      productos: [
    {
      nombre: 'Pizza Margarita',
      descripcion: 'Pizza clásica con tomate, mozarella y albahaca',
      precio: 20000
    },
    {
      nombre: 'Gaseosa',
      descripcion: 'Bebida gaseosa de 500 ml',
      precio: 3000
    }
  ],
      habilitado: true
    };
    const response = await request(app).post('/pedidos').send(nuevoPedido);
    expect(response.statusCode).toBe(201);
    pedidoId = response.body.pedido._id;
  });

  // GET /pedido/id/:id - Obtener un pedido específico
  test('GET /pedido/id/:id debería devolver un código 200 para un ID válido', async () => {
    const response = await request(app).get(`/pedido/id/${pedidoId}`);
    expect(response.statusCode).toBe(200);
  });

  // PATCH /pedidos/:id - Actualizar un pedido
  test('PATCH /pedidos/:id debería devolver un código 200 para una actualización válida', async () => {
    const cambiosPedido = {
      restaurante: 'Restaurante Ejemplo',
      estadosPedido: ['Recibido, Preparando'],
      tiempoEstimadoLlegada: '30 mins',
      calificacionUsuario: 4,
      domiciliario: {
        nombre: 'Juan',
        telefono: '1234567890',
        foto: 'url_a_la_foto'
      },
      valorTotal: 50000,
      productos: [
    {
      nombre: 'Pizza Margarita',
      descripcion: 'Pizza clásica con tomate, mozarella y albahaca',
      precio: 20000
    },
    {
      nombre: 'Gaseosa',
      descripcion: 'Bebida gaseosa de 500 ml',
      precio: 3000
    }
  ],
      habilitado: true
    };
    const response = await request(app).patch(`/pedidos/${pedidoId}`).send(cambiosPedido);
    expect(response.statusCode).toBe(200);
  });

  // DELETE /prueba - Eliminar un pedido
  test('DELETE /prueba debería devolver un código 200 para una eliminación válida', async () => {
    const response = await request(app).delete(`/pedido/${pedidoId}`);
    expect(response.statusCode).toBe(200);
  });

    // POST /pedidos - Intento de crear un pedido con datos inválidos
  test('POST /pedidos debería devolver un código 400 para datos inválidos', async () => {
    const pedidoInvalido = {
      restaurante: '', 
  estadosPedido: [], 
  tiempoEstimadoLlegada: '', 
  // Falta el campo 'calificacionUsuario'
  domiciliario: {
    nombre: '', // Campo obligatorio vacío
    telefono: 'telefono no válido', 
    foto: 'url no válida' 
  },
  valorTotal: -100, 
  productos: [
    {
      nombre: 'Producto con nombre extremadamente largo que excede el máximo permitido',
      descripcion: 'Descripción demasiado larga',
      precio: 0 // Valor no permitido (debe ser mínimo 1)
    }
  ],
  habilitado: true
    };
    const response = await request(app).post('/pedidos').send(pedidoInvalido);
    expect(response.statusCode).toBe(400);
  });
  
  // GET /pedido/id/:id - Intento de obtener un pedido con ID inexistente
  test('GET /pedido/id/:id debería devolver un código 404 para un ID inexistente', async () => {
    const response = await request(app).get('/pedido/id/id_inexistente');
    expect(response.statusCode).toBe(404);
  });
  
  // PATCH /pedidos/:id - Intento de actualizar un pedido con datos inválidos
  test('PATCH /pedidos/:id debería devolver un código 400 para datos inválidos', async () => {
    const cambiosInvalidos = {
      restaurante: 123, 
  estadosPedido: ['Estado no válido'], 
  tiempoEstimadoLlegada: 'tiempo no válido', 
  calificacionUsuario: 6, 
  domiciliario: {
    nombre: '', 
    telefono: 'telefono no válido', 
    foto: 'url no válida' 
  },
  valorTotal: -500, 
  productos: [
    {
      nombre: '', 
      descripcion: 'Descripción demasiado corta', 
      precio: 0 
    }
  ],
  habilitado: 'no booleano'
    };
    const response = await request(app).patch(`/pedidos/${pedidoId}`).send(cambiosInvalidos);
    expect(response.statusCode).toBe(400);
  });
  
  // DELETE /prueba - Intento de eliminar un pedido con ID inexistente
  test('DELETE /prueba debería devolver un código 404 para un ID inexistente', async () => {
    const response = await request(app).delete('/pedido/id_inexistente');
    expect(response.statusCode).toBe(404);
  });
});

describe('Pruebas de rutas de productos', () => {
  let productoId; // Almacenará el ID del producto creado para su uso en pruebas posteriores

  // POST /productos - Crear producto
  test('POST /productos debería devolver un código 201 para producto creado', async () => {
    const nuevoProducto = {
      restaurante: 123, // Suponiendo que es un ID numérico
      nombre: 'Pizza Margarita',
      categoria: ['Pizza', 'Italiana'],
      descripcion: 'Pizza clásica con tomate y mozarella',
      ingredientes: ['Tomate', 'Mozarella', 'Albahaca'],
      disponibilidad: true,
      precio: 15000,
      foto: 'https://url-de-la-foto.com/pizza.jpg'
    };
    const response = await request(app).post('/productos').send(nuevoProducto);
    expect(response.statusCode).toBe(201);
    productoId = response.body._id;
  });

  // GET /productos - Obtener todos los productos
  test('GET /productos debería devolver un código 200', async () => {
    const response = await request(app).get('/productos');
    expect(response.statusCode).toBe(200);
  });

  // GET /productos/:id - Obtener un producto específico
  test('GET /productos/:id debería devolver un código 200 para un ID válido', async () => {
    const response = await request(app).get(`/productos/${productoId}`);
    expect(response.statusCode).toBe(200);
  });

  // PATCH /productos/:id - Actualizar un producto
  test('PATCH /productos/:id debería devolver un código 200 para una actualización válida', async () => {
    const cambiosProducto = {
      restaurante: 123, // Suponiendo que es un ID numérico
      nombre: 'Pizza Margarita',
      categoria: ['Pizza', 'Italiana'],
      descripcion: 'Pizza clásica con tomate',
      ingredientes: ['Tomate', 'Albahaca'],
      disponibilidad: true,
      precio: 15000,
      foto: 'https://url-de-la-foto.com/pizza.jpg'
    };
    const response = await request(app).patch(`/productos/${productoId}`).send(cambiosProducto);
    expect(response.statusCode).toBe(200);
  });

  // DELETE /productos/:id - Eliminar un producto
  test('DELETE /productos/:id debería devolver un código 204 para una eliminación válida', async () => {
    const response = await request(app).delete(`/productos/${productoId}`);
    expect(response.statusCode).toBe(204);
  });

    // POST /productos - Intento de crear un producto con datos inválidos
  test('POST /productos debería devolver un código 400 para datos inválidos', async () => {
    const productoInvalido = {
      restaurante: 123,
      categoria: ['Pizza', 'Italiana'],
      descripcion: '',
      ingredientes: [],
      disponibilidad: true,
      precio: -20, // Precio inválido
      foto: 'no-url'
    };
    const response = await request(app).post('/productos').send(productoInvalido);
    expect(response.statusCode).toBe(400);
  });
  
  // GET /productos/:id - Intento de obtener un producto con ID inexistente
  test('GET /productos/:id debería devolver un código 404 para un ID inexistente', async () => {
    const response = await request(app).get('/productos/id_inexistente');
    expect(response.statusCode).toBe(404);
  });
  
  // PATCH /productos/:id - Intento de actualizar un producto con datos inválidos
  test('PATCH /productos/:id debería devolver un código 400 para datos inválidos', async () => {
    const cambiosInvalidos = {
      precio: -100
    };
    const response = await request(app).patch(`/productos/${productoId}`).send(cambiosInvalidos);
    expect(response.statusCode).toBe(400);
  });
  
  // DELETE /productos/:id - Intento de eliminar un producto con ID inexistente
  test('DELETE /productos/:id debería devolver un código 404 para un ID inexistente', async () => {
    const response = await request(app).delete('/productos/id_inexistente');
    expect(response.statusCode).toBe(404);
  });
});
