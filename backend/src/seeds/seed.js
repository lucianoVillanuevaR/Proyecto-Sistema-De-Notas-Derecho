#!/usr/bin/env node
import { AppDataSource } from "../config/configDb.js";
import bcrypt from "bcrypt";
import { User } from "../entities/user.entity.js";
import { Grade } from "../entities/grade.entity.js";
import { EvaluacionEntity } from "../entities/evaluacion.entity.js";

/**
 * Función principal para poblar la base de datos con datos de prueba
 * Crea usuarios (profesores y alumnos), evaluaciones y notas
 */
async function run() {
  try {
    await AppDataSource.initialize();
    console.log('╔════════════════════════════════════════╗');
    console.log('║  INICIANDO SEED DE BASE DE DATOS      ║');
    console.log('╚════════════════════════════════════════╝\n');

    const userRepo = AppDataSource.getRepository(User);
    const gradeRepo = AppDataSource.getRepository(Grade);
    const evaluacionRepo = AppDataSource.getRepository(EvaluacionEntity);

    // Asignaturas del programa de Derecho
    const subjects = [
      'Derecho Civil',
      'Derecho Penal',
      'Derecho Constitucional',
      'Derecho Laboral',
      'Derecho Administrativo',
    ];

    // Profesores - Cuentas institucionales @ubiobio.cl
    const profesoresData = [
      { 
        name: 'Juan Pérez González', 
        email: 'juan.perez@ubiobio.cl', 
        password: 'Profesor1!', 
        role: 'profesor' 
      },
      { 
        name: 'María González López', 
        email: 'maria.gonzalez@ubiobio.cl', 
        password: 'Profesor2!', 
        role: 'profesor' 
      },
    ];

    // Alumnos - Cuentas institucionales @alumnos.ubiobio.cl
    const alumnosData = [
      {
        name: 'Carlos Andrés Ruiz Mora',
        email: 'carlos.ruiz@alumnos.ubiobio.cl',
        password: 'Alumno1!2024',
        role: 'estudiante',
      },
      {
        name: 'Ana María Silva Torres',
        email: 'ana.silva@alumnos.ubiobio.cl',
        password: 'Alumno2!2024',
        role: 'estudiante',
      },
      {
        name: 'Diego Fernando Castillo Muñoz',
        email: 'diego.castillo@alumnos.ubiobio.cl',
        password: 'Alumno3!2024',
        role: 'estudiante',
      },
      {
        name: 'Valentina Paz Reyes Soto',
        email: 'valentina.reyes@alumnos.ubiobio.cl',
        password: 'Alumno4!2024',
        role: 'estudiante',
      },
      {
        name: 'Sebastián Ignacio Flores Díaz',
        email: 'sebastian.flores@alumnos.ubiobio.cl',
        password: 'Alumno5!2024',
        role: 'estudiante',
      },
    ];

    /**
     * Crea o retorna un usuario existente
     * @param {Object} userData - Datos del usuario (email, password, role, name)
     * @returns {Promise<User>} Usuario creado o existente
     */
    async function ensureUser(userData) {
      const exists = await userRepo.findOne({ where: { email: userData.email } });
      if (exists) {
        console.log('Usuario ya existe: ' + userData.email + ' (' + (userData.name || userData.email) + ')');
        return exists;
      }
      
      const hashedPassword = await bcrypt.hash(String(userData.password), 10);
      const newUser = userRepo.create({ 
        email: userData.email, 
        password: hashedPassword, 
        role: userData.role,
        name: userData.name || userData.email.split('@')[0]
      });
      
      return await userRepo.save(newUser);
    }

    // Crear profesores
    console.log('\n=== CREANDO PROFESORES ===');
    const profesores = [];
    for (const profesorData of profesoresData) {
      const profesor = await ensureUser(profesorData);
      profesores.push(profesor);
      console.log('✓ Profesor: ' + profesorData.name + ' | ' + profesor.email + ' | ID: ' + profesor.id);
    }

    // Crear alumnos
    console.log('\n=== CREANDO ALUMNOS ===');
    const alumnos = [];
    for (const alumnoData of alumnosData) {
      const alumno = await ensureUser(alumnoData);
      alumnos.push(alumno);
      console.log('✓ Alumno: ' + alumnoData.name + ' | ' + alumno.email + ' | ID: ' + alumno.id + ' | Password: ' + alumnoData.password);
    }

    // Generar notas para cada alumno
    console.log('\n=== CREANDO NOTAS ===');
    let notasCreadas = 0;
    
    for (const alumno of alumnos) {
      const alumnoData = alumnosData.find(a => a.email === alumno.email);
      // 3 evaluaciones por alumno
      for (let j = 0; j < 3; j++) {
        const subject = subjects[(j + alumno.id) % subjects.length];
        const profesor = profesores[(j + alumno.id) % profesores.length];
        const evaluation = subject + ' - Parcial ' + (j + 1);
        
        // Calificación en escala chilena: 1.0 - 7.0
        const minScore = 4.0; // Nota mínima razonable para datos de prueba
        const maxScore = 7.0;
        const raw = Math.random() * (maxScore - minScore) + minScore;
        const score = Math.round(raw * 10) / 10;

        const existing = await gradeRepo.findOne({ 
          where: { 
            studentId: Number(alumno.id), 
            professorId: Number(profesor.id), 
            evaluation 
          } 
        });
        
        if (existing) continue;

        const nota = gradeRepo.create({
          studentId: Number(alumno.id),
          professorId: Number(profesor.id),
          evaluation,
          score,
          observation: score >= 6.0 ? 'Excelente desempeño' : score >= 5.0 ? 'Buen desempeño' : 'Aprobado',
          type: 'escrita',
        });
        
        await gradeRepo.save(nota);
        notasCreadas++;
        console.log('✓ Nota: ' + alumnoData.name + ' | ' + evaluation + ' | Nota: ' + score + ' | Profesor: ' + profesor.email);
      }
    }
    console.log('Total de notas creadas: ' + notasCreadas);

    // Crear evaluaciones del sistema
    console.log('\n=== CREANDO EVALUACIONES ===');
    const evaluacionesData = [
      {
        tipoEv: 'escrita',
        nombreEv: 'Parcial 1',
        asignatura1: 'Derecho Civil',
        profesor: 'juan.perez',
        ponderacion: 30,
      },
      {
        tipoEv: 'oral',
        nombreEv: 'Exposición Oral',
        asignatura1: 'Derecho Penal',
        profesor: 'maria.gonzalez',
        ponderacion: 20,
      },
      {
        tipoEv: 'escrita',
        nombreEv: 'Examen Final',
        asignatura1: 'Derecho Constitucional',
        profesor: 'juan.perez',
        ponderacion: 40,
      },
      {
        tipoEv: 'escrita',
        nombreEv: 'Prueba Solemne',
        asignatura1: 'Derecho Laboral',
        profesor: 'maria.gonzalez',
        ponderacion: 35,
      },
      {
        tipoEv: 'oral',
        nombreEv: 'Defensa Oral',
        asignatura1: 'Derecho Administrativo',
        profesor: 'juan.perez',
        ponderacion: 25,
      },
    ];

    let evaluacionesCreadas = 0;
    for (const evalData of evaluacionesData) {
      const existing = await evaluacionRepo.findOne({ 
        where: { 
          nombreEv: evalData.nombreEv, 
          asignatura1: evalData.asignatura1 
        } 
      });
      
      if (!existing) {
        const evaluacion = evaluacionRepo.create(evalData);
        await evaluacionRepo.save(evaluacion);
        evaluacionesCreadas++;
        console.log('✓ Evaluación: ' + evalData.nombreEv + ' | ' + evalData.asignatura1 + ' | ' + evalData.ponderacion + '%');
      }
    }
    console.log('Total de evaluaciones creadas: ' + evaluacionesCreadas);

    console.log('\n=== SEED COMPLETADO EXITOSAMENTE ===');
    console.log('Profesores: ' + profesores.length);
    console.log('Alumnos: ' + alumnos.length);
    console.log('Notas: ' + notasCreadas);
    console.log('Evaluaciones: ' + evaluacionesCreadas);
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ ERROR EJECUTANDO SEED:', err.message);
    console.error(err);
    try { 
      await AppDataSource.destroy(); 
    } catch(e) {
      console.error('Error cerrando conexión:', e.message);
    }
    process.exit(1);
  }
}

run();
