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

//check if key is loaded (prints first 4 chars only)
if (process.env.GEMINI_API_KEY) {
    console.log(`[System] API Key loaded: ${process.env.GEMINI_API_KEY.substring(0, 4)}...`);
} else {
    console.error("[System] ERROR: GEMINI_API_KEY is missing from .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

///start a chat session with the model using a configuration prompt
// Adjusted path since we are now inside /services
const modelPromptFilePath = path.join(__dirname, "..", "model_prompt");
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
        console.error(" Unable to get model response: " + error.message);
        return null;
        //return null explicitly on failure
    }
}

module.exports = {
    modelOutput
};

