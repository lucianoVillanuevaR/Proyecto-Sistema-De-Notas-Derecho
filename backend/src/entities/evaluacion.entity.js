import { EntitySchema } from "typeorm";

export const Evaluacion = new EntitySchema({
  name: "Evaluacion",
  tableName: "evaluaciones",
  columns: {
    id: { primary: true, type: "int", generated: "increment" },
    titulo: { type: "varchar", length: 120 },
    puntajeMax: { type: "float", default: 7.0 },
    fecha: { type: "date" },
    cerrada: { type: "boolean", default: false },
  },
  relations: {
    curso: {
      type: "many-to-one",
      target: "Curso",
      joinColumn: true,
      nullable: false,
    },
  },
});
