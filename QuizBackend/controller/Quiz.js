const Quiz = require("../models/Quiz");
const { decodeJwtToken } = require("../middlewares/verifyToken");
const createQuiz = async (req, res, next) => {
  try {
    const { quizName, quizType, questions } = req.body;

    if (!quizName || !quizType || !questions || questions.length === 0) {
      return res.status(400).json({
        errorMessage: "Quiz name, quiz type, and questions are required",
      });
    }

    const userId = req.userId; 
    const quiz = new Quiz({
      quizName,
      quizType,
      questions,
      refUserId: userId,
    });

    await quiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

const incrementImpressions = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ errorMessage: "Quiz not found" });
    }

    const impressions = await quiz.incrementImpressions();

    res.status(200).json({ message: "Impressions incremented", impressions });
  } catch (error) {
    next(error);
  }
};

const getQuizbyId = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ errorMessage: "Quiz not found" });
    }
    res.status(200).json({ quiz });
  } catch (error) {
    next(error);
  }
};

const getQuizbyUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    

    const quiz = await Quiz.find({ refUserId: userId });
    if (!quiz) {
      return res.status(404).json({ errorMessage: "Quiz not found" });
    }
    res.status(200).json({ quiz });
  } catch (error) {
    next(error);
  }
};

const getAllQuiz = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().sort({ impressions: -1 });

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ errorMessage: "No quizzes found" });
    }

    res.status(200).json({ quizzes });
  } catch (error) {
    next(error);
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = decodeJwtToken(req.headers["authorization"]);

 
    const quiz = await Quiz.findByIdAndDelete(quizId);
    if (!quiz) {
      return res.status(404).json({ errorMessage: "Quiz not found" });
    }   if (userId !== quiz.refUserId.toString()) {
      return res.status(403).json({ errorMessage: "Unauthorized" });
    }
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = decodeJwtToken(req.headers["authorization"]);

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ errorMessage: "Quiz not found" });
    }
    if (userId !== quiz.refUserId.toString()) {
      return res.status(403).json({ errorMessage: "Unauthorized" });
    }
    const { quizName, quizType, questions } = req.body;
    quiz.quizName = quizName;
    quiz.quizType = quizType;
    quiz.questions = questions;
    await quiz.save();
    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuiz,
  incrementImpressions,
  getQuizbyId,
  getQuizbyUserId,
  updateQuiz,
  deleteQuiz,
  getAllQuiz,
};
