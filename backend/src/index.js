// index.js
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { AppDataSource, conectarDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Ruta principal de bienvenida
app.get("/", (_req, res) => {
  res.send("¡Bienvenido a mi API REST con TypeORM!");
});

// Inicializa la conexión a la base de datos
conectarDB()
  .then(() => {
    // Cargar todas las rutas
    routerApi(app);

    // Levantar servidor
    const PORT = process.env.PORT || 3000;
    const HOST = process.env.SERVER_HOST || "0.0.0.0";
    app.listen(PORT, HOST, () => {
      console.log(`Servidor iniciado en http://${HOST}:${PORT}`);
      if (HOST === "0.0.0.0") console.log("También accesible desde tu IP local");
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });
