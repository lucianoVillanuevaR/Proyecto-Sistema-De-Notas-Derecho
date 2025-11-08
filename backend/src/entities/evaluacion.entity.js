"use strict";
import {EntitySchema} from "typeorm";

export const EvaluacionEntity = new EntitySchema({
    name: "Evaluacion",
    tableName: "evaluaciones",
    columns: {
        id: {
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
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
            default: () => "CURRENT_TIMESTAMP"
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
            default: () => "CURRENT_TIMESTAMP"
        },
    },
});

export default EvaluacionEntity;