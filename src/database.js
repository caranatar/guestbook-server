import { Sequelize, DataTypes } from "sequelize";

const createStore = async () => {
  const db = new Sequelize("database", "username", "password", {
    dialect: "sqlite",
    storage: "./store.sqlite",
    logging: false,
  });

  const User = await db.define("user", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
  });

  const Post = await db.define("post", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    title: DataTypes.STRING,
    contents: DataTypes.STRING,
    userId: DataTypes.STRING,
  });

  await db.sync();

  return { User, Post };
};

export default createStore;
