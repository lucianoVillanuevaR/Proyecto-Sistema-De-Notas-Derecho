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

    // Administrador
    const adminData = {
      nombre: 'Jefe de carrera',
      rut: '12382243-1',
      email: 'jefecarrera@ubiobio.cl',
      password: 'Jefe123!',
      role: 'admin'
    };

    // Profesores - Cuentas institucionales @ubiobio.cl
    const profesoresData = [
      { 
        nombre: 'Juan Pérez González',
        rut: '12345678-9',
        email: 'juan.perez@ubiobio.cl', 
        password: 'Profesor1!', 
        role: 'profesor' 
      },
      { 
        nombre: 'María González López',
        rut: '23456789-0',
        email: 'maria.gonzalez@ubiobio.cl', 
        password: 'Profesor2!', 
        role: 'profesor' 
      },
    ];

    // Alumnos - Cuentas institucionales @alumnos.ubiobio.cl
    const alumnosData = [
      {
        nombre: 'Carlos Andrés Ruiz Mora',
        rut: '19876543-2',
        email: 'carlos.ruiz@alumnos.ubiobio.cl',
        password: 'Alumno1!2024',
        role: 'estudiante',
      },
      {
        nombre: 'Ana María Silva Torres',
        rut: '20123456-7',
        email: 'ana.silva@alumnos.ubiobio.cl',
        password: 'Alumno2!2024',
        role: 'estudiante',
      },
      {
        nombre: 'Diego Fernando Castillo Muñoz',
        rut: '19654321-8',
        email: 'diego.castillo@alumnos.ubiobio.cl',
        password: 'Alumno3!2024',
        role: 'estudiante',
      },
      {
        nombre: 'Valentina Paz Reyes Soto',
        rut: '20567890-1',
        email: 'valentina.reyes@alumnos.ubiobio.cl',
        password: 'Alumno4!2024',
        role: 'estudiante',
      },
      {
        nombre: 'Sebastián Ignacio Flores Díaz',
        rut: '19234567-3',
        email: 'sebastian.flores@alumnos.ubiobio.cl',
        password: 'Alumno5!2024',
        role: 'estudiante',
      },
    ];

    /**
     * Crea o retorna un usuario existente
     * @param {Object} userData - Datos del usuario (nombre, rut, email, password, role)
     * @returns {Promise<User>} Usuario creado o existente
     */
    async function ensureUser(userData) {
      const exists = await userRepo.findOne({ where: { email: userData.email } });
      if (exists) {
        console.log('Usuario ya existe: ' + userData.email + ' (' + (userData.nombre || userData.email) + ')');
        return exists;
      }
      
      const hashedPassword = await bcrypt.hash(String(userData.password), 10);
      const newUser = userRepo.create({ 
        nombre: userData.nombre,
        rut: userData.rut,
        email: userData.email, 
        password: hashedPassword, 
        role: userData.role
      });
      
      return await userRepo.save(newUser);
    }

    // Crear administrador
    console.log('\n=== CREANDO ADMINISTRADOR ===');
    const admin = await ensureUser(adminData);
    console.log('✓ Admin: ' + adminData.nombre + ' | ' + admin.email + ' | ID: ' + admin.id);

    // Crear profesores
    console.log('\n=== CREANDO PROFESORES ===');
    const profesores = [];
    for (const profesorData of profesoresData) {
      const profesor = await ensureUser(profesorData);
      profesores.push(profesor);
      console.log('✓ Profesor: ' + profesorData.nombre + ' | ' + profesor.email + ' | ID: ' + profesor.id);
    }

    // Crear alumnos
    console.log('\n=== CREANDO ALUMNOS ===');
    const alumnos = [];
    for (const alumnoData of alumnosData) {
      const alumno = await ensureUser(alumnoData);
      alumnos.push(alumno);
      console.log('✓ Alumno: ' + alumnoData.nombre + ' | ' + alumno.email + ' | ID: ' + alumno.id + ' | Password: ' + alumnoData.password);
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
        
        // Calificación entre 10 y 70
        const score = Math.floor(Math.random() * 61) + 10;

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
          observation: score >= 60 ? 'Excelente desempeño' : score >= 50 ? 'Buen desempeño' : 'Aprobado',
          type: 'escrita',
        });
        
        await gradeRepo.save(nota);
        notasCreadas++;
        console.log('✓ Nota: ' + alumnoData.nombre + ' | ' + evaluation + ' | Nota: ' + score + ' | Profesor: ' + profesor.email);
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
        profesorId: profesores[0].id,
        ponderacion: 30,
      },
      {
        tipoEv: 'oral',
        nombreEv: 'Exposición Oral',
        asignatura1: 'Derecho Penal',
        profesorId: profesores[1] ? profesores[1].id : profesores[0].id,
        ponderacion: 20,
      },
      {
        tipoEv: 'escrita',
        nombreEv: 'Examen Final',
        asignatura1: 'Derecho Constitucional',
        profesorId: profesores[0].id,
        ponderacion: 40,
      },
      {
        tipoEv: 'escrita',
        nombreEv: 'Prueba Solemne',
        asignatura1: 'Derecho Laboral',
        profesorId: profesores[1] ? profesores[1].id : profesores[0].id,
        ponderacion: 35,
      },
      {
        tipoEv: 'oral',
        nombreEv: 'Defensa Oral',
        asignatura1: 'Derecho Administrativo',
        profesorId: profesores[0].id,
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