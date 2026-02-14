const express = require("express");
//for creating a web app instance

const qtRoutes = require("./routes/qt.routes");

const app = express();
//launch app instance

app.use(express.static("public"));
//setting the app's resource access/visibility on files

app.use(express.json());
//set up a JSON parser (we need to be able to treat client requests with some body content)

// Mount routes
app.use("/", qtRoutes);

module.exports = app;

