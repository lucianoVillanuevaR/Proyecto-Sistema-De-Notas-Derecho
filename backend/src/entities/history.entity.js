import { EntitySchema } from "typeorm";

export const History = new EntitySchema({
  name: "History",
  tableName: "histories",
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
    userId: {
      type: "int",
      nullable: false,
    },
    action: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    details: {
      type: "text",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
