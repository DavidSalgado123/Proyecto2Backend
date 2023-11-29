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
