import {EntitySchema} from "typeorm";

export const EvaluacionEntity = new EntitySchema({
    name: "Evaluacion",
    tableName: "evaluaciones",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        tipoEv: {
            type: "enum",
            enum: ["oral", "escrita"],
            nullable: false,
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
            length: 70,
        },
        profesorId: {
            type: "int",
            nullable: true,
        },
        ponderacion: {
            type: "int",
            nullable: false,
            default: null,
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
            default: () => "CURRENT_TIMESTAMP",
        },
    },
});

export default EvaluacionEntity;
