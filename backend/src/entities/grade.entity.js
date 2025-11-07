import { EntitySchema } from "typeorm";

export const Grade = new EntitySchema({
  name: "Grade",
  tableName: "grades",
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
    evaluation: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    type: {
      type: "varchar",
      length: 50,
      nullable: false,
      default: "escrita",
    },
    score: {
      type: "numeric",
      nullable: false,
    },
    observation: {
      type: "text",
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
