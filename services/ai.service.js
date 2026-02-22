const fs = require("fs");
//for using file system operations

const path = require("path");
//for working with file directory paths

require('dotenv').config();
//for .env access

const { GoogleGenAI } = require("@google/genai");
//for LLM AI agent feature



//check if key is loaded
if (process.env.GEMINI_API_KEY) {
    console.log(`Gemini API key loaded: "${process.env.GEMINI_API_KEY.substring(0, 12)}..."`);
} else {
    console.error("ERROR: GEMINI_API_KEY is missing from environment variables (.env).");
}

const ai = new GoogleGenAI({});

///start a chat session with the model using a configuration prompt/instructions
const modelInstructionsFilePath = path.join(__dirname, "..", process.env.MODEL_INSTRUCTIONS);
const modelInstructions = fs.readFileSync(modelInstructionsFilePath, "utf8");

console.log("Loading Gemini model:");
console.log(`   Name: "${process.env.GEMINI_MODEL}"`);
console.log(`   Instructions: "${process.env.MODEL_INSTRUCTIONS}"`);

console.log(`   ...`);
const chatSession = ai.chats.create({
    model: process.env.GEMINI_MODEL || "gemini-3-flash-preview",
    config: {
        systemInstruction: modelInstructions,
        //lowering the temperature makes the model more deterministic and less likely to get creative/swayed by bad prompts
        temperature: 0.3 
    }
});
console.log("QT model ready.\n");

//a function to send a prompt to the and get the text response
async function modelOutput(prompt) {
    //console.log("Calling LLM API...")

    if (process.env.PROMPT_LOGS == "true") {
        console.log("   Prompt to model:\n\"" + prompt + "\"");
    }
    try {
        const response = await chatSession.sendMessage({ message: prompt });
        const textOutput = response.text.trim();
        if (process.env.PROMPT_LOGS == "true") {
            console.log("   Text output response from model:\n\"" + textOutput + "\"");
        }
        return textOutput;

    } catch(error) {
        console.error("ERROR: Unable to get model response.\n" + error.message);
        return null;
        //return null explicitly on failure
    }
}

module.exports = {
    modelOutput
};

