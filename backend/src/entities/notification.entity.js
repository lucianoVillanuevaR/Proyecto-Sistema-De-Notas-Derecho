import { EntitySchema } from "typeorm";

export const Notification = new EntitySchema({
  name: "Notification",
  tableName: "notifications",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    userId: {
      type: "int",
      nullable: false,
    },
    type: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    message: {
      type: "text",
      nullable: false,
    },
    data: {
      type: "text",
      nullable: true,
    },
    read: {
      type: "boolean",
      default: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
