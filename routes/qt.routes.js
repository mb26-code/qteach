const express = require("express");
const router = express.Router();
const qtController = require("../controllers/qt.controller");

router.get("/test", qtController.getTest);

//endpoints that require a model output (the user interacts with QT)
router.get("/qtProblem/:language", qtController.getProblem);
router.post("/qtReaction/:language", qtController.postReaction);
router.post("/qtSolve/:language", qtController.postSolve);

// Main page route
router.get("/", qtController.getHome);

module.exports = router;

