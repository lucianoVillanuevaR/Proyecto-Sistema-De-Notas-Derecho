import { DataSource } from "typeorm";
import { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DATABASE } from "./configEnv.js";
import { User } from "../entities/user.entity.js";
import { Curso } from "../entities/curso.entity.js";
import { ProfesorCurso } from "../entities/ProfesorCurso.entity.js";
import { Matricula } from "../entities/matricula.entity.js";
import { Evaluacion } from "../entities/evaluacion.entity.js";
import { Nota } from "../entities/nota.entity.js";
import { Anio } from "../entities/anio.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,              
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,      
  database: DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Curso,
    ProfesorCurso,
    Matricula,
    Evaluacion,
    Nota,
    Anio
  ],
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos PostgreSQL!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
};

export const conectarDB = connectDB;


