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

exports.getProblem = async function(request, result) {
    console.log("\n> Client requesting a problem...");
    const language = request.params.language || "en";

    const rawModelOutput = await aiService.modelOutput("#" + language + " ???");

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
};

exports.postReaction = async function(request, result) {
    console.log("\n> Client requesting a reaction...");
    const requestBody = JSON.stringify(request.body);
    console.log("Request body: " + requestBody);
    const language = request.params.language || "en";

    const rawModelOutput = await aiService.modelOutput("#" + language + " " + requestBody);

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
};

exports.postSolve = async function(request, result) {
    console.log("\n> Client requesting a solution...");
    const requestBody = JSON.stringify(request.body);
    console.log("Request body: " + requestBody);
    const language = request.params.language || "en";

    const rawModelOutput = await aiService.modelOutput("#" + language + " " + requestBody);
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
};

