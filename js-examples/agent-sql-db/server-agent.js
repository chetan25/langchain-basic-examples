import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import ChatModelHandler from "./ChatModelHandler.js";

import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { v4 as uuidv4 } from "uuid";

import {
  tables,
  run_query,
  describe_tables,
  write_report,
} from "./tools/index.js";

/**
 * For storing chat message history in-memory.
 */
const messageHistory = new ChatMessageHistory();

// const tables = db.allTables.map((table) => table.tableName);
// console.log(tables, "db");
// console.log(db.getTableInfo(tables));

// console.log(
//   memory.chatHistory.getMessages(),
//   "memory.chatHistory.getMessages()"
// );

/**
 * Creating a instance of OpenAI large language models that use the Chat endpoint.
 * Attaching a callback Class which has listeners to listen on certain stages of the LLM model execution
 */
const llm = new ChatOpenAI({
  callbacks: [new ChatModelHandler()],
});

/**
 * For OpenAIFunctionsAgent, we must have a PromptTemplate with input key of 'agent_scratchpad'
 *
 * 'agent_scratchpad' is a simple form of memory(transactional/intermediate)
 * Every run of agent creates anew one
 */
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an AI that has access to Sqlite DB.
    The database has following tables ${tables.join(",")}
    Do not make any assumption about tables or columns. Use the 'describe_tables' functions to get information about the table.
    If someone asks for a report use the 'write_report' function, to write the data into disc, pass a meaningful file name and the html content as input arguments.
    `,
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

const tools = [run_query, describe_tables, write_report];

/**
 * Creating a OpenAI agent that uses the llm, tools and the prompt
 *
 * Agent is like a chain but can use tools
 */
const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  prompt,
});

/**
 * Executor to execute the Agent
 */
const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

/**
 * Creating a insatce of Agent with runnable memory history,
 * to keep track of previous messages and manage chat history.
 * It appends input messages and chain outputs as history,
 * and adds the current history messages to the chain input.
 */
const agentWithChatHistory = new RunnableWithMessageHistory({
  runnable: agentExecutor,
  getMessageHistory: (_sessionId) => messageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

const sessionId = uuidv4();
const result5 = await agentWithChatHistory.invoke(
  {
    input:
      "What are the top 5 popular product, give the product name and product id and sort in ascending order by popularity and also generate a report.",
    // "How many unique users have provided shipping address that is equal to '5832 Hunter Key Apt. 037, West Joyside, FL 39197'",
  },
  {
    configurable: {
      sessionId: sessionId,
    },
  }
);

console.log(result5.output);
