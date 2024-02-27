import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
// import { ChatAnthropic } from "@langchain/anthropic";
import { LLMChain } from "langchain/chains";

/**
 * Direct Consumption of LLM
 */
// const llm = new ChatAnthropic();
// const result = await llm.invoke("Write a short poem on snowy day");
// console.log(result);

const llm = new OpenAI();

/**
 * Template for the LLM. inputVariables define the input we have in
 * the template message
 */
const codePrompt = new PromptTemplate({
  inputVariables: ["language", "task"],
  template: "Write a short {language} function to {task}",
});

/**
 * Another way of creating a promt template from the "fromTemplate" method
 */
const testPrompt = PromptTemplate.fromTemplate(
  `Write unit test for the following {language} code \n {code}. Show only code`
);

/**
 * Single chain
 */
// const chain = codePrompt.pipe(llm);
// const codeResult = await chain.invoke({
//   language: "Javascript",
//   task: "Write a function to add 2 numbers",
// });

/**
 * Piping the output of a chain to a a String Parser
 */
// const codeChain = codePrompt.pipe(llm).pipe(new StringOutputParser());

/**
 * Instantiate LLMChain, which consists of a PromptTemplate and
 * an LLM. Pass the result from the PromptTemplate and the OpenAI LLM model
 */
// const codeChain = new LLMChain({
//   llm: llm,
//   prompt: codePrompt,
//   outputKey: "code",
// });

/**
 * Run the chain. Pass the value for the variable name
 * that was sent in the "inputVariables" list
 * passed to "PromptTemplate" initialization call
 */
// const res = await codeChain.call({
//   language: "Javascript",
//   task: "Write a function to add 2 numbers",
// });

/**
 * Creating Runnable Sequence since we want the output of one to be
 * input for the subsequent chain
 */
const codeChain = RunnableSequence.from([
  codePrompt,
  llm,
  new StringOutputParser(),
]);

const testChain = RunnableSequence.from([
  testPrompt,
  llm,
  new StringOutputParser(),
]);

let usrInput = {
  task: "",
  language: "",
};
let aIOutput = {
  code: "",
  test: "",
};

/**
 * Creating Another Runnable sequence to combine the two sequnces
 * so that the data flows from one to another w/o much effort
 */
const combinedChain = RunnableSequence.from([
  (prevRes) => {
    usrInput["task"] = prevRes.task;
    usrInput["language"] = prevRes.language;
    return prevRes;
  },
  codeChain,
  (preResult) => {
    aIOutput["code"] = preResult;
    return preResult;
  },
  {
    code: (preResult) => preResult,
    language: (input) => input.language,
  },
  testChain,
  (preResult) => {
    aIOutput["test"] = preResult;
    return preResult;
  },
]);

/**
 * Invoking the Chain
 */
await combinedChain.invoke({
  language: "Javascript",
  task: "Write a function to add 2 numbers. Show only code",
});

console.log(aIOutput);
// console.log(usrInput);
