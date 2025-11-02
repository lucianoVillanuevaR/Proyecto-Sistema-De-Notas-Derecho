import { EntitySchema } from "typeorm";

export const Anio = new EntitySchema({
  name: "Anio",
  tableName: "anios",
  columns: {
    id: { primary: true, type: "int", generated: "increment" },
    score: { type: "float" },
    createdAt: { type: "timestamp", createDate: true, default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", updateDate: true, default: () => "CURRENT_TIMESTAMP" },
  },
  relations: {
    evaluacion: { type: "many-to-one", target: "Evaluacion", joinColumn: true, nullable: false },
    estudiante:  { type: "many-to-one", target: "User", joinColumn: true, nullable: false },
  },
  uniques: [{ columns: ["evaluacion", "estudiante"] }],
});
