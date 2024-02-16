import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";
import { writeFileSync } from "fs";
import { z } from "zod";
import { db } from "../db/index.js";

/**
 * Returns all tables in a array format eg: ['users', 'products']
 */
export const tables = db.allTables.map((table) => table.tableName);

/**
 * A tool that is used by the AI, that returns the schema for the given table names
 */
export const describe_tables = new DynamicTool({
  name: "describe_tables",
  description:
    "Given a list of table names, returns the schema for those tables",
  func: async () => await db.getTableInfo(tables),
});

/**
 * A tool that is used by the AI, that returns the result of a sql query
 */
export const run_query = new DynamicTool({
  name: "run_query",
  description: "Given a sql query, run the query and return the result",
  func: async (query) => {
    try {
      // console.log("test", query);
      return await db.run(query);
    } catch (e) {
      /**
       * We want the AI(Open AI) to know that the run from the previous query had an erorr
       * and that it should re-try and we assume that the AI would use
       * the other tools availabel to re write the query
       */
      if (e.code == "SQLITE_ERROR") {
        return `The following error occurred ${e.message}`;
      } else {
        throw new Error("System Error");
      }
    }
  },
});

/**
 * A tool that is used by the AI, that will write a file to disc
 */
export const write_report = new DynamicStructuredTool({
  name: "write_report",
  description:
    "Use this tool whenever someone asks for a report, this writes a html file to disk.",
  schema: z.object({
    fileName: z.string().describe("The filename for the generated file"),
    data: z.string().describe("The data for the genertaed file"),
  }),
  func: ({ fileName, data }) => {
    try {
      // We are attaching a timestam to the fileName
      const arrName = fileName.split(".");
      const timeStampedName = `${arrName[0]}-${new Date().getTime()}.html`;
      writeFileSync(`reports/${timeStampedName}`, data);
    } catch (e) {
      console.log(e.message, "message");
      return `The following error occurred ${e.message}`;
    }
  },
});
