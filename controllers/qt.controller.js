const path = require("path");
const aiService = require("../services/ai.service");

exports.getTest = function(request, response) {
    response.send("OK");
    console.log("/test endpoint reached.");
};

//this is the main endpoint, landing users on web page
exports.getHome = function(request, response) {
    // Adjusted path since we are now inside /controllers
    response.sendFile(path.join(__dirname, "..", "public", "qteach.html"));
    console.log("    +++ A client has accessed the web page.");
};

// Helper function to safely parse model output
const handleModelResponse = (rawModelOutput, result) => {
    if (!rawModelOutput) {
        return result.status(500).json({ error: "AI Model failed to respond." });
    }

    try {
        // Attempt to extract JSON from the text
        const match = rawModelOutput.match(/(\{.*?\})/s);
        if (!match) throw new Error("No JSON found in response");
        
        const problemJSON = JSON.parse(match[0]);
        console.log("< Result sent to client: ", problemJSON);
        result.json(problemJSON);
    } catch(error) {
        console.error("Unable to parse model output:", error.message);
        // Fallback or error response
        result.status(500).json({ error: "Failed to parse AI response." });
    }
};

exports.getProblem = async function(request, result) {
    console.log("\n> Client requesting a problem...");
    const language = request.params.language || "en";
    const rawModelOutput = await aiService.modelOutput("#" + language + " ???");
    handleModelResponse(rawModelOutput, result);
};

exports.postReaction = async function(request, result) {
    console.log("\n> Client requesting a reaction...");
    const requestBody = JSON.stringify(request.body);
    console.log("Request body: " + requestBody);
    const language = request.params.language || "en";
    const rawModelOutput = await aiService.modelOutput("#" + language + " " + requestBody);
    handleModelResponse(rawModelOutput, result);
};

exports.postSolve = async function(request, result) {
    console.log("\n> Client requesting a solution...");
    const requestBody = JSON.stringify(request.body);
    console.log("Request body: " + requestBody);
    const language = request.params.language || "en";
    const rawModelOutput = await aiService.modelOutput("#" + language + " " + requestBody);
    handleModelResponse(rawModelOutput, result);
};

