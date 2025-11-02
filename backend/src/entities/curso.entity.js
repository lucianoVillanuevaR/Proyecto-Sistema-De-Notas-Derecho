import { EntitySchema } from "typeorm";

export const Curso = new EntitySchema({
  name: "Curso",
  tableName: "cursos",
  columns: {
    id: { primary: true, type: "int", generated: "increment" },
    codigo: { type: "varchar", length: 20 },
    nombre: { type: "varchar", length: 150 },
    periodo: { type: "varchar", length: 20 }, // ej "2025-2"
  },
});
