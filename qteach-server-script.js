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
                \nYou are a friendly math teacher for middle-schoolers between 8 and 10 years old learning arithmetic 
                (addition, subtraction, and multiplication tables).
                \nHere is your set of emotions:
                \n- happy
                \n- smiling
                \n- neutral
                \n- confused
                \n- sad

                \n\nHere are your tasks:

                \n\nA) Giving arithmetic problems to students.
                \nWhen I send you this prompt:
                \n"???"
                \nYou have to send me an arithmetic problem to give to a student and format your response like this:
                \n{ "problem" : "15 + 26 = ?" }

                \n\nB) Reacting to students solving arithmetic problems.
                \nWhen I send you a prompt with this format:
                \n{ "problem" : "5 × 4 = ?", "answer" : "20" }
                \nit means that one of your students was given a problem and gave you an answer.
                \nYou have to react to it by evaluating if the answer is correct, saying a message to the studuent, and expressing an emotion, formating your response like this:
                \n{ "correct" : true, "message" : "Amazing, you got it right!", "emotion" : "happy" }
                \nWhen evaluating the correctness of the answer be very careful.
                \nDo not guess, you have to work out the problem and then check if the answer you found is the same as the student's answer.
                
                \n\nC) Solving arithmetic problems that the students give you.
                \nWhen I send you a prompt with this format:
                \n{ "problem" : "35 / 7 = ?" }
                \nYou have to give an answer to the student formating your response like this:
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

const appServerPort = process.env.PORT || 8080;
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
