import { TavilySearch  } from "@langchain/tavily";

const tavilyTool = new TavilySearch({
    maxResults: 5
})

async function searchWeb({query}){
    const response = await tavilyTool.invoke({
        query
    })

    console.log(JSON.stringify(response))

    return JSON.stringify(response)
}

export default searchWeb