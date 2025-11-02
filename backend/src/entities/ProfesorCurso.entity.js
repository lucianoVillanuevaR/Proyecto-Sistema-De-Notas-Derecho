import { EntitySchema } from "typeorm";

export const ProfesorCurso = new EntitySchema({
  name: "ProfesorCurso",
  tableName: "profesores_cursos",
  columns: { id: { primary: true, type: "int", generated: "increment" } },
  relations: {
    profesor: { type: "many-to-one", target: "User", joinColumn: true, nullable: false },
    curso:    { type: "many-to-one", target: "Curso", joinColumn: true, nullable: false },
  },
  uniques: [{ columns: ["profesor", "curso"] }],
});
