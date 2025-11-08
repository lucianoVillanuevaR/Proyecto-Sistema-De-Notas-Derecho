<<<<<<< HEAD
"use strict";
=======
>>>>>>> d7e589a (add funciones y arreglo de codigo)
import {EntitySchema} from "typeorm";

export const EvaluacionEntity = new EntitySchema({
    name: "Evaluacion",
    tableName: "evaluaciones",
    columns: {
        id: {
<<<<<<< HEAD
            type: Number,
            primary: true,
            generated: true
        },
        nombreEv: {
            type: String,
            unique: true,
            nullable: false,
            length: 30
        },
        asignatura1: {
            type: String,
            unique: true,
            nullable: false,
            length: 30
        },
        profesor: {
            type: String,
            unique: true,
            nullable: false,
            length: 30
        },
        ponderacion: {
            type: Number,
            nullable: false,
            default: null
=======
            type: "int",
            primary: true,
            generated: "increment",
        },
        nombreEv: {
            type: "varchar",
            unique: false,
            nullable: false,
            length: 30,
        },
        asignatura1: {
            type: "varchar",
            nullable: false,
            length: 30,
        },
        profesor: {
            type: "varchar",
            nullable: false,
            length: 30,
        },
        ponderacion: {
            type: "int",
            nullable: false,
            default: null,
>>>>>>> d7e589a (add funciones y arreglo de codigo)
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
<<<<<<< HEAD
            default: () => "CURRENT_TIMESTAMP"
=======
            default: () => "CURRENT_TIMESTAMP",
>>>>>>> d7e589a (add funciones y arreglo de codigo)
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
<<<<<<< HEAD
            default: () => "CURRENT_TIMESTAMP"
=======
            default: () => "CURRENT_TIMESTAMP",
>>>>>>> d7e589a (add funciones y arreglo de codigo)
        },
    },
});

export default EvaluacionEntity;