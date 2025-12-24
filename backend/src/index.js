import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { AppDataSource, connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://146.83.198.35:1519",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({
  verify: (req, _res, buf) => {
    try {
      req.rawBody = buf.toString();
    } catch (e) {
      req.rawBody = undefined;
    }
  },
}));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("¡Bienvenido a mi API REST con TypeORM!");
});

connectDB()
  .then(() => {
    routerApi(app);
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
