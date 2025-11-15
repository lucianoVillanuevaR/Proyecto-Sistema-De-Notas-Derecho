import { EntitySchema } from "typeorm";

export const asistenciaEvEntity = new EntitySchema({
    name: "AsistenciaEvaluacion",
    tableName: "asistencias_evaluaciones",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        estudianteId: {
            type: "int",
            nullable: false,
        },
        evaluacionId: {
            type: "int",
            nullable: false,
        },
        asistio: {
            type: "boolean",
            nullable: false,
            default: false,
        },
        nota: {
            type: "int",
            nullable: true,
            default: null,
        },
        calificadoPor: {
            type: "int",
            nullable: true,
            default: null,
        },
        estado: {
            type: "varchar",
            length: 20,
            nullable: false,
            default: "pendiente",
        },
        comentarios: {
            type: "text",
            nullable: true,
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

export default asistenciaEvEntity;