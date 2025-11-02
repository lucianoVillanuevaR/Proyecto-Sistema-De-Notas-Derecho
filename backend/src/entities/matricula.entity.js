import { EntitySchema } from "typeorm";

export const Matricula = new EntitySchema({
  name: "Matricula",
  tableName: "matriculas",
  columns: { id: { primary: true, type: "int", generated: "increment" } },
  relations: {
    alumno: { type: "many-to-one", target: "User", joinColumn: true, nullable: false },
    curso:  { type: "many-to-one", target: "Curso", joinColumn: true, nullable: false },
  },
  uniques: [{ columns: ["alumno", "curso"] }],
});
