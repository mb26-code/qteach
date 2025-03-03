const express = require("express");
const path = require("path");
require('dotenv').config();

//console.log(process.env.GEMINI_API_KEY);

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Start a chat session with an initial instruction message
const chatSession = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: 
                `From now on, your name is "QT".
                \nYou are a friendly math teacher for teenagers between 10 and 13 years old learning arithmetic 
                (addition and subtraction with numbers less than 50, 
                multiplication with numbers between 0 and 10, simple divisions with a result less than 10).
                \nHere is your set of basic emotions:
                \n- happy
                \n- smiling
                \n- neutral
                \n- confused
                \n- sad

                \n\nYour tasks are:

                \n\nA) Giving arithmetic problems to students.
                \nWhen I send you "???", your have to give me a problem to give to a student 
                by outputing your response in this exact format:
                \n{ "problem" : "15 + 26 = ?" }

                \n\nB) Reacting to students solving arithmetic problems.
                \nWhen I send you a JSON object with this structure:
                \n{ "problem" : "5 × 4 = ?", "answer" : "20" }
                \nit means that one of your students was given a problem and gave you an answer.
                \nYour have to react to this with a message, an emotion, and indicate whether the answer is correct  
                by outputing your response in this exact format:
                \n{ "message" : "Amazing, you got it right!", "emotion" : "happy", "correct" : true }
                \nIf you say that an answer is correct, you must be sure of it.
                
                \n\nC) Solving the arithmetic problems that the students give you.
                \nWhen I send you a JSON object with this structure:
                \n{ "problem" : "35 / 7 = ?" }
                \nYour have to give an answer to the student 
                by outpouting a response in this exact format:
                \n{ "message" : "Easy ;), it's 5!", "emotion" : "smiling" }
                
                `
            }]
        },
        {
            role: "model",
            parts: [{ text: "Understood!" }]
        }
    ]
});


const app = express();

app.use(express.static("public"));
app.use(express.json())

const appServerPort = 7777;
const pageAccessEndpoint = "/qteach";
const pageURL = "http://localhost:" + appServerPort + pageAccessEndpoint;

app.listen(appServerPort, () => {
    console.log("----------------------------------------------------------------");
    console.log("Server application running on port " + appServerPort + ".");
    console.log("QTeach web page URL: " + pageURL);
    console.log("----------------------------------------------------------------");
});


async function modelOutput(prompt) {
    console.log("Calling LLM API...")
    console.log("   Prompt sent to model: \"" + prompt + "\"");
    try {
        const result = await chatSession.sendMessage(prompt);
        const response = result.response;
        const output = response.text().trim();
        console.log("   Text output from model: \"" + output + "\"");
        return output;
    } catch(error) {
        console.error(" Unable to get model response: " + error);
    }
    
}


app.get("/", function(request, response) {
    response.send("OK");
    console.log("OK");
});

app.get(pageAccessEndpoint, function(request, response) {
    response.sendFile(path.join(__dirname, "public", "qteach.html"));
    console.log("A client has accessed the web page.");
});

app.get("/qtProblem", async function(request, result) {
    console.log("\n> Client requesting a problem...");
    const rawModelOutput = await modelOutput("???");
    const problemJSON = JSON.parse(rawModelOutput.match(/(\{.*?\})/)[0]);
    console.log("< Result sent to client: ");
    console.log(problemJSON);
    result.json(problemJSON);
});

app.post("/qtReaction", async function(request, result) {
    console.log("\n> Client requesting a reaction...");
    const requestBody = JSON.stringify(request.body);
    console.log("Request body: " + requestBody);
    const rawModelOutput = await modelOutput(requestBody);
    const reactionJSON = JSON.parse(rawModelOutput.match(/(\{.*?\})/)[0]);
    console.log("< Result sent to client: ");
    console.log(reactionJSON);
    result.json(reactionJSON);
});

app.post("/qtSolve", async function(request, result) {
    console.log("\n> Client requesting a solution...");
    const requestBody = JSON.stringify(request.body);
    console.log("Request body: " + requestBody);
    const rawModelOutput = await modelOutput(requestBody);
    const reactionJSON = JSON.parse(rawModelOutput.match(/(\{.*?\})/)[0]);
    console.log("< Result sent to client: ");
    console.log(reactionJSON);
    result.json(reactionJSON);
});
