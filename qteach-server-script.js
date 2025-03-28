const express = require("express");
//for creating a web app instance

const fs = require("fs");
//for using file system operations

const path = require("path");
//for working with file directory paths

require('dotenv').config();
//for .env access

const { GoogleGenerativeAI } = require("@google/generative-ai");
//for LLM AI agent feature

//checking if .env is working properly
//console.log("GEMINI_API_KEY: " + process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

///start a chat session with the model using a configuration prompt
const modelPromptFilePath = path.join(__dirname, "model_prompt");
const modelPrompt = fs.readFileSync(modelPromptFilePath, "utf8");

console.log("Configuring model with prompt...\n");
const chatSession = model.startChat({
    history: [
        {
            role : "user",
            parts : [{ text : modelPrompt }]
        },
        {
            role : "model",
            parts : [{ text : "Understood. I, QT, am ready to teach!" }]
        }
    ]
});
console.log("Model ready.\n")


const app = express();
//launch app instance

app.use(express.static("public"));
//setting the app's resource access/visibility on files

app.use(express.json())
//set up a JSON parser (we need to be able to treat client requests with some body content)

const appServerPort = process.env.PORT || 8080;
const pageAccessEndpoint = "/";
const pageLocalhostURL = "http://localhost:" + appServerPort + pageAccessEndpoint;

app.listen(appServerPort, () => {
    console.log("----------------------------------------------------------------");
    console.log("Server application running on port " + appServerPort + ".");
    console.log("QTeach web page localhost URL: " + pageLocalhostURL);
    console.log("----------------------------------------------------------------");
});

//a function to send a prompt to the and get the text response
async function modelOutput(prompt) {
    //console.log("Calling LLM API...")
    console.log("   Prompt sent to model:\n\"" + prompt + "\"");
    try {
        const result = await chatSession.sendMessage(prompt);
        const response = result.response;
        const textOutput = response.text().trim();
        console.log("   Text output from model:\n\"" + textOutput + "\"");
        return textOutput;

    } catch(error) {
        console.error(" Unable to get model response: " + error);
    }
    
}

//setting up endpoints

app.get("/test", function(request, response) {
    response.send("OK");
    console.log("/test endpoint reached.");
});

//this is the main endpoint, landing users on web page
app.get(pageAccessEndpoint, function(request, response) {
    response.sendFile(path.join(__dirname, "public", "qteach.html"));
    console.log("    +++ A client has accessed the web page.");
});

//endpoints that require a model output (the user interacts with QT)
app.get("/qtProblem", async function(request, result) {
    console.log("\n> Client requesting a problem...");
    const rawModelOutput = await modelOutput("???");

    try {
        const problemJSON = JSON.parse(rawModelOutput.match(/(\{.*?\})/s)[0]);
        console.log("< Result sent to client: ");
        console.log(problemJSON);
        result.json(problemJSON);
    } catch(error) {
        console.error("Unable to parse model output.");
        console.error("Error: " + error);
        //result.json({})
    }
    
});

app.post("/qtReaction", async function(request, result) {
    console.log("\n> Client requesting a reaction...");
    const requestBody = JSON.stringify(request.body);
    console.log("Request body: " + requestBody);

    const rawModelOutput = await modelOutput(requestBody);

    try {
        const reactionJSON = JSON.parse(rawModelOutput.match(/(\{.*?\})/s)[0]);
        console.log("< Result sent to client: ");
        console.log(reactionJSON);
        result.json(reactionJSON);
    } catch(error) {
        console.error("Unable to parse model output.");
        console.error("Error: " + error);
        //result.json({})
    }
    
});

app.post("/qtSolve", async function(request, result) {
    console.log("\n> Client requesting a solution...");
    const requestBody = JSON.stringify(request.body);
    console.log("Request body: " + requestBody);

    const rawModelOutput = await modelOutput(requestBody);
    console.log(rawModelOutput);
    try {
        const reactionJSON = JSON.parse(rawModelOutput.match(/(\{.*?\})/s)[0]);
        console.log("< Result sent to client: ");
        console.log(reactionJSON);
        result.json(reactionJSON);
    } catch(error) {
        console.error("Unable to parse model output.");
        console.error("Error: " + error);
        //result.json({})
    }
});
