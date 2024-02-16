import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";

/**
 * Create a DataSource from local sqlite DB
 */
const datasource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
});

/**
 * Create a db instance from the datasource
 */
export const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});
