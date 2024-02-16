---
title: Simple Langchain JS examples.
excerpt: Simple examples demonstrating how we can use basic Langchain functionalities..
Tools: ["Langchain", "ChromaBd", "Node", "Javascript", "Qwik"]
---

# Simple LangchainJS examples

While I was learning Langchain using Python, it made sense to replicate those things in JS, since JS is my first language of preference and there is a JS version for Langchain, so I just created this repo with some JS samples.

## What's Included

The repo has two folders:

- 'js-examples' - This contains some simple use cases of Langchain JS like :
  - Agent Example - How to use a Agent with tools that can interact with Database.
  - Chains Example - How to write a simple and sequential chain.
  - Loader - How to load a document and create embeddings to do some search on it.
- 'study-bot' - This is work under progress, this will be a simple study bot that helps you upload files, and than search them in a conversational manner. The FE will be build with Qwik and BE will be Node JS + Langchain JS.

## Local Development

### How to locally run the examples

All js-examples share the common `package.json` file so, first step is to install the deps, run the following commands:

```js
 cd js-examples
 npm install
```

> Now make sure you create a `.env`, for that you can re-name the `.env.example` and put in your OPEN AI key

Now you are all set to run different commands to execute different LLM interactions.
Available commands are:

`npm run run:agent`
`npm run run:chain`

> NOTE for running the loader, we need to first start chroma server in a separate terminal (tried using wait-on and concurrently but did not work)

`npm run start-db`

> In separate terminal run

`npm run run:loader`
