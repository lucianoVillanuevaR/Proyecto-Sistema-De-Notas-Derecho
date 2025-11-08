"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, PASSWORD, DB_PORT } from "./configEnv.js";
import bcrypt from "bcrypt";
import { User } from "../entities/user.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: HOST,                
  port: Number(DB_PORT),      
  username: DB_USERNAME,    
  password: PASSWORD,          
  database: DATABASE,         
  entities: ["src/entities/**/*.js"],
<<<<<<< HEAD
  synchronize: true,
=======
  synchronize: false,
>>>>>>> d7e589a (add funciones y arreglo de codigo)
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos PostgreSQL!");
    // Sembrar usuarios por defecto: un estudiante y un profesor
    try {
      const repo = AppDataSource.getRepository(User);

      async function ensureUser(email, plainPassword, role) {
        const exists = await repo.findOne({ where: { email } });
        if (!exists) {
          const hashed = await bcrypt.hash(String(plainPassword), 10);
          const nuevo = repo.create({ email, password: hashed, role });
          await repo.save(nuevo);
          console.log(`Usuario creado: ${email} (${role})`);
        } else {
          console.log(`Usuario ya existe: ${email}`);
        }
      }

      // Contraseñas iniciales (cámbialas en producción)
      await ensureUser("estudiante@ejemplo.com", "Estudiante123", "estudiante");
      await ensureUser("profesor@ejemplo.com", "Profesor123", "profesor");
    } catch (seedError) {
      console.warn("No fue posible sembrar usuarios por defecto:", seedError.message || seedError);
    }
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
<<<<<<< HEAD
}
=======
}

// Consulta para obtener restricciones únicas de la tabla 'evaluaciones'
// Nota: no ejecutar consultas con AppDataSource antes de inicializar la conexión.
// Si necesitas listar/eliminar constraints, hazlo después de llamar a connectDB()
// o usa el script independiente `scripts/drop_evaluaciones_constraints.js`.
>>>>>>> d7e589a (add funciones y arreglo de codigo)
