require('dotenv').config();
const app = require("./app");

const appServerPort = process.env.PORT || 8080;
const pageAccessEndpoint = "/";
const pageLocalhostURL = "http://localhost:" + appServerPort + pageAccessEndpoint;

app.listen(appServerPort, () => {
    console.log("----------------------------------------------------------------");
    console.log("Server application running on port " + appServerPort + ".");
    console.log("QTeach web page localhost URL: " + pageLocalhostURL);
    console.log("----------------------------------------------------------------");
});

