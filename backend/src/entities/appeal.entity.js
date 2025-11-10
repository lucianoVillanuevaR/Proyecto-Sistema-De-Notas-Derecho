import { EntitySchema } from "typeorm";

export const Appeal = new EntitySchema({
    name: "Appeal",
    tableName: "appeals",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        studentId: {
            type: "int",
            nullable: false,
        },
        professorId: {
            type: "int",
            nullable: false,
        },
        gradeId: {
            type: "int",
            nullable: false,
        },
        reason: {
            type: "text",
            nullable: false,
        },
        comment: {
            type: "text",
            nullable: true,
        },
        status: {
            type: "varchar",
            length: 50,
            nullable: false,
            default: "pendiente",
        },
        meetingDate: {
            type: "timestamp",
            nullable: true,
        },
        created_at: {
            type: "timestamp",
            createDate: true,
            default: () => "CURRENT_TIMESTAMP",
        },
        updated_at: {
            type: "timestamp",
            updateDate: true,
            default: () => "CURRENT_TIMESTAMP",
        },
    },
});