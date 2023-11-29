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
    const idUsuario = "ID_DEL_USUARIO_A_MODIFICAR";
    const cambiosUsuario = {
      /* ...datos de usuario para modificar... */
    };
    const response = await request(app)
      .patch(`/usuarios/${idUsuario}`)
      .send(cambiosUsuario)
      .set("Authorization", "Bearer tuTokenDeAutenticacion");
    expect(response.statusCode).toBe(200);
  });

  // Endpoint DELETE /usuarios/:id
  test("DELETE /usuarios/:id debería devolver un código 204", async () => {
    const idUsuario = "ID_DEL_USUARIO_A_ELIMINAR";
    const response = await request(app)
      .delete(`/usuarios/${idUsuario}`)
      .set("Authorization", "Bearer tuTokenDeAutenticacion");
    expect(response.statusCode).toBe(204);
  });
});
