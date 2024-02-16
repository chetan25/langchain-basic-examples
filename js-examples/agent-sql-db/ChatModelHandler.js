import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import chalk from "chalk";

/**
 * One way of attaching the handler to the callback is using the Static method from BaseCallbackHandler
 */
// const ChatModelHanderls = BaseCallbackHandler.fromMethods({
//   handleLLMStart(llm, _prompts) {
//     console.log("handleLLMStart: I'm the second handler!!", { llm });
//   },
//   handleChainStart(chain) {
//     console.log("handleChainStart: I'm the second handler!!", { chain });
//   },
//   handleChatModelStart(llm, message) {
//     console.log("handleChatModelStart llm", llm);
//     console.log("handleChatModelStart messgae", message);
//   },
// });

/**
 * Creating a new class that extends BaseCallbackHandler
 */
class ChatModelHandler extends BaseCallbackHandler {
  name = "ChatModelHandler";

  /**
   * Lifecycle method to hook .
   * We are formatting the Message from each stage nicely for readiablity
   */
  handleChatModelStart(llm, messages) {
    console.log(
      chalk.underline.bgBlue("------ Sending Message ---------------\n\n")
    );
    for (let message of messages[0]) {
      const messageData = message.toDict();
      if (messageData.type === "system") {
        console.log(chalk.blue("\n------ System Message ---------------\n"));
        console.log(messageData.data.content);
      }

      if (messageData.type === "human") {
        console.log(chalk.yellow("\n------ Human Message ---------------\n"));
        console.log(messageData.data.content);
      }

      if (messageData.type === "ai") {
        console.log(chalk.magenta("\n------ AI Message ---------------\n"));
        console.log(messageData.data.additional_kwargs);
      }

      if (messageData.type === "function") {
        console.log(
          chalk.cyan("\n------ AI Function Message ---------------\n")
        );
        console.log(messageData.data.name);
        console.log(messageData.data.additional_kwargs);
      }
    }
  }

  // handleLLMEnd(output) {
  //   console.log("handleLLMEnd output", output);
  // }
}

export default ChatModelHandler;
