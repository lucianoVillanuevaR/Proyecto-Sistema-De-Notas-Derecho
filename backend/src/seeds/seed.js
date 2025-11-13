#!/usr/bin/env node
import { AppDataSource } from "../config/configDb.js";
import bcrypt from "bcrypt";
import { User } from "../entities/user.entity.js";
import { Grade } from "../entities/grade.entity.js";

async function run() {
  try {
    await AppDataSource.initialize();
    console.log("Conectado a la base de datos para seed");

    const userRepo = AppDataSource.getRepository(User);
    const gradeRepo = AppDataSource.getRepository(Grade);

    // Asignaturas de Derecho
    const subjects = [
      "Derecho Civil",
      "Derecho Penal",
      "Derecho Constitucional",
      "Derecho Laboral",
      "Derecho Administrativo",
    ];

    // Profesores (2) - correos basados en nombre terminados en @ubiobio.cl
    const profesoresData = [
      { name: 'juan.perez', email: `juan.perez@ubiobio.cl`, password: "Profesor1!", role: "profesor" },
      { name: 'maria.gonzalez', email: `maria.gonzalez@ubiobio.cl`, password: "Profesor2!", role: "profesor" },
    ];

    // Alumnos (5) con correos en @alumnos.ubiobio.cl
    const alumnosData = Array.from({ length: 5 }).map((_, i) => ({
      email: `alumno${i + 1}@alumnos.ubiobio.cl`,
      password: `Alumno${i + 1}123`,
      role: "estudiante",
    }));

    // Crear o asegurar usuarios
    async function ensureUser(u) {
      const exists = await userRepo.findOne({ where: { email: u.email } });
      if (exists) return exists;
      const hashed = await bcrypt.hash(String(u.password), 10);
      const created = userRepo.create({ email: u.email, password: hashed, role: u.role });
      return await userRepo.save(created);
    }

    const profesores = [];
    for (const p of profesoresData) {
      const up = await ensureUser(p);
      profesores.push(up);
      console.log(`Profesor asegurado: ${up.email} (id=${up.id})`);
    }

    const alumnos = [];
    for (const a of alumnosData) {
      const ua = await ensureUser(a);
      alumnos.push(ua);
      console.log(`Alumno asegurado: ${ua.email} (id=${ua.id}) password=${a.password}`);
    }

    // Generar notas para cada alumno en varias asignaturas
    for (const alumno of alumnos) {
      // 3 notas por alumno
      for (let j = 0; j < 3; j++) {
        const subject = subjects[(j + alumno.id) % subjects.length];
        const profesor = profesores[(j + alumno.id) % profesores.length];
        const evaluation = `${subject} - Parcial ${j + 1}`;
        // Score escala 1.0 - 7.0 con un decimal
        const raw = Math.random() * (7 - 1) + 1; // 1.0 - 7.0
        const score = Math.round(raw * 10) / 10;

        const existing = await gradeRepo.findOne({ where: { studentId: Number(alumno.id), professorId: Number(profesor.id), evaluation } });
        if (existing) continue;

        const nota = gradeRepo.create({
          studentId: Number(alumno.id),
          professorId: Number(profesor.id),
          evaluation,
          score,
          observation: null,
          type: "escrita",
        });
        await gradeRepo.save(nota);
        console.log(`Nota creada: alumno=${alumno.id} profesor=${profesor.id} eval='${evaluation}' score=${score}`);
      }
    }

    console.log("Seed completado.");
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error("Error ejecutando seed:", err);
    try { await AppDataSource.destroy(); } catch(e){}
    process.exit(1);
  }
}

run();
