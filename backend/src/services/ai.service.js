import { ChatGoogle } from "@langchain/google";
import { SystemMessage, AIMessage, HumanMessage, tool, createAgent } from "langchain";
import { ChatOpenRouter } from "@langchain/openrouter";
import searchWeb from "./internet.service.js";
import * as z from "zod";

const searchTool = tool(
    searchWeb,
    {
        name: "searchTool",
        description: "Use this tool to search the internet",
        schema: z.object({
            query: z.string().describe("Enter the text to search the internet"),
        })    
    }
 
)

const geminiModel = new ChatGoogle({
    model: "gemini-3.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
});

const titleModel = new ChatOpenRouter({
    model: "nvidia/nemotron-3.5-super-vl:free",
    temperature: 0,
    maxTokens: 400,
});

const agent = createAgent({
    model: geminiModel,
    tools: [searchTool]
})

export async function generateResponse(messages) {
    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
            ...(messages.map((msg) => {  //array hi arha h toh array mai dalke bhejne ki jarurat nhi
                if(msg.role === "user"){
                    return new HumanMessage(msg)
                }else{
                    return new AIMessage(msg)
                }
            }))
        ]        
    });

    return response.messages[response.messages.length - 1].text;
}

export async function generateChatTitle(message){
    const response = await titleModel.invoke([
        new SystemMessage(
            `
            Generate a concise, relevant chat title based on the user's first message. The title must be 2–4 words long. Return only the title, without quotation marks, explanations, or punctuation.
            `
        ),
        new HumanMessage(`
            Generate a chat title based on this message: ${message}
            `)
    ]);

    return response.content;
}
