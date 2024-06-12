const express = require("express");
const router = express.Router();
const quizController = require("../controller/Quiz");
const {verifyToken} = require("../middlewares/verifyToken");


router.post("/create", verifyToken, quizController.createQuiz);
router.put("/:quizId/impressions", quizController.incrementImpressions);
router.get("/:quizId", quizController.getQuizbyId);
router.get("/user/:userId", verifyToken, quizController.getQuizbyUserId);
router.post("/:quizId", verifyToken, quizController.updateQuiz);
router.delete("/:quizId", verifyToken, quizController.deleteQuiz);
router.get("/", quizController.getAllQuiz);



module.exports = router