import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { MultiPromptChain } from "langchain/chains";

/**
 * Templates
 */
const templates = {
  travel_agent_template: `
    You are an experienced travel agent and tour guide who expertises in planning 
    vaccations for people. You are best in planning iternearies for the vacations too along with giving suggestions
    about the local food and transportation.

    Here is a question:
    {input}
  `,
  math_template: `
      You are a great mathamatecian and great at solving Maths problem and explaning hard concepts in
      simple format so that anybody can understand.

      Here is a question:
      {input}
  `,
  javascript_template: `
     You are a experienced Javascript developer who is a very adavnced in Javascript concepts and has a very in depth knowledge about the subject.
     You are also a very good teacher who can simplify any Javascript concept and explain it to anyone.

     Here is a question:
     {input}
  `,
};

const promts = [
  {
    name: "Maths",
    description: "This is good for answering Maths related questions",
    promptTemplate: templates["math_template"],
  },
  {
    name: "Travel",
    description:
      "This is good for answering Travel, Vaccations and Itenary related questions",
    promptTemplate: templates["travel_agent_template"],
  },
  {
    name: "Javascript",
    description:
      "This is good for answering programming question related to Javascript language",
    promptTemplate: templates["javascript_template"],
  },
];

const llm = new ChatOpenAI({
  streaming: true,
});

const multiPromptChain = MultiPromptChain.fromLLMAndPrompts(llm, {
  promptNames: [...promts.map((prompt) => prompt.name)],
  promptDescriptions: [...promts.map((prompt) => prompt.description)],
  promptTemplates: [...promts.map((prompt) => prompt.promptTemplate)],
});

process.stdout.write("Hello, How can I help you:   ");
for await (const question of console) {
  if (question === "no") {
    process.exit();
  }
  const result = await multiPromptChain.invoke({
    input: question,
  });

  console.log(result);
  process.stdout.write("Anything else:  ");
}
