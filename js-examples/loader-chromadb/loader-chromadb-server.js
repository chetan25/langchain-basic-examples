import "dotenv/config";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { RunnableSequence } from "@langchain/core/runnables";
import { Chroma } from "@langchain/community/vectorstores/chroma";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import { ChatAnthropic } from "@langchain/anthropic";

// const llm = new OpenAI();

/**
 * A text splitter instance to split the text file into chunks for creating embeddings
 */
const textSplitter = new CharacterTextSplitter({
  separator: "\n",
  chunk_size: 100,
  chunk_overlap: 0,
});

/**
 * Loader to load a text file
 */
const loader = new TextLoader("./dino-facts.txt");
/**
 * Creating Documents chunks of the file loaded using the splitter
 */
const docs = await loader.loadAndSplit(textSplitter);

const embeddings = new OpenAIEmbeddings();

/**
 *  Create vector store and index the docs
 *
 *  To run this first run a chroma server with `chroma run --path /path/to/data`
 *  We are running it in the package json script
 */
const db = await Chroma.fromDocuments(docs, embeddings, {
  collectionName: "fact-collection",
  url: "http://localhost:8000", // Optional, will default to this value
  // collectionMetadata: {
  //   "hnsw:space": "cosine",
  // }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
});

/**
 * Search for the most similar document
 */
const response = await db.similaritySearch(
  "When were Dinosaurs present on Earth"
);

console.log(response);
