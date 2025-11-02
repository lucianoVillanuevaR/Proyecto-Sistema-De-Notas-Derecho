import { EntitySchema } from "typeorm";

export const Nota = new EntitySchema({
  name: "Nota",
  tableName: "notas",
  columns: {
    id: { primary: true, type: "int", generated: "increment" },
    puntaje: { type: "float" },
    creadoEn: { type: "timestamp", createDate: true, default: () => "CURRENT_TIMESTAMP" },
    actualizadoEn: { type: "timestamp", updateDate: true, default: () => "CURRENT_TIMESTAMP" },
  },
  relations: {
    evaluacion: {
      type: "many-to-one",
      target: "Evaluacion",
      joinColumn: true,
      nullable: false,
    },
    alumno: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      nullable: false,
    },
  },
  uniques: [{ columns: ["evaluacion", "alumno"] }],
});
