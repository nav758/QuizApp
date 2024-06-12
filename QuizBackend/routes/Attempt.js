const express  = require("express");
const router  = express.Router();
const attemptController = require("../controller/Attempt");

router.put("/submit", attemptController.submitQuiz);
router.get("/:quizId", attemptController.getAttempt);
module.exports = router 


 