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
        nombre: {
            type: String,
            length: 30
        },
        asignatura: {
            type: String,
            length: 30
        },
        profesor: {
            type: String,
            length: 30
        },
        nota: {
            type: Number
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