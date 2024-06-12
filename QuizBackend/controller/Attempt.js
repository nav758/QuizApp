const mongoose = require('mongoose');
const Attempt = require('../models/Attempt');

const submitQuiz = async (req, res) => {
  const { quizId, attempts, correctCount, totalAttempts } = req.body;

  try {
    // Find the existing attempt document
    const existingAttempt = await Attempt.findOne({ quizId });

    if (existingAttempt) {
      // Update the existing attempt document
      attempts.forEach((attempt) => {
        const existingQuestion = existingAttempt.attempts.find(q => q.questionId === attempt.questionId);

        if (existingQuestion) {
          existingQuestion.correctCountQuestion += attempt.isCorrect ? 1 : 0;

          switch (attempt.selectedOption) {
            case 0:
              existingQuestion.optionChosen0 += 1;
              break;
            case 1:
              existingQuestion.optionChosen1 += 1;
              break;
            case 2:
              existingQuestion.optionChosen2 += 1;
              break;
            case 3:
              existingQuestion.optionChosen3 += 1;
              break;
            default:
              break;
          }

          existingQuestion.questionAttempts += 1;
          existingQuestion.attemptOptions.push({ optionChosen: attempt.selectedOption, isCorrect: attempt.isCorrect });
        } else {
          const newQuestion = {
            questionId: attempt.questionId,
            correctCountQuestion: attempt.isCorrect ? 1 : 0,
            optionChosen0: attempt.selectedOption === 0 ? 1 : 0,
            optionChosen1: attempt.selectedOption === 1 ? 1 : 0,
            optionChosen2: attempt.selectedOption === 2 ? 1 : 0,
            optionChosen3: attempt.selectedOption === 3 ? 1 : 0,
            questionAttempts: 1,
            attemptOptions: [{ optionChosen: attempt.selectedOption, isCorrect: attempt.isCorrect }]
          };
          existingAttempt.attempts.push(newQuestion);
        }
      });

      existingAttempt.correctCounts += correctCount;
      existingAttempt.totalAttempts = totalAttempts;

      const savedAttempt = await existingAttempt.save();
      res.status(200).json({ message: 'Quiz updated successfully', savedAttempt });
    } else {
      // Create a new attempt document
      const newAttempt = new Attempt({
        quizId,
        attempts: attempts.map(attempt => ({
          questionId: attempt.questionId,
          correctCountQuestion: attempt.isCorrect ? 1 : 0,
          optionChosen0: attempt.selectedOption === 0 ? 1 : 0,
          optionChosen1: attempt.selectedOption === 1 ? 1 : 0,
          optionChosen2: attempt.selectedOption === 2 ? 1 : 0,
          optionChosen3: attempt.selectedOption === 3 ? 1 : 0,
          questionAttempts: 1,
          attemptOptions: [{ optionChosen: attempt.selectedOption, isCorrect: attempt.isCorrect }]
        })),
        correctCounts: correctCount,
        totalAttempts,
      });

      const savedAttempt = await newAttempt.save();
      res.status(200).json({ message: 'Quiz submitted successfully', savedAttempt });
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Error submitting quiz', error });
  }
};

 const getAttempt = async (req, res) => {
  const { quizId } = req.params;
  try {
    const attempt = await Attempt.findOne({quizId: quizId });
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }
    res.status(200).json(attempt);
  } catch (error) {
    console.error('Error fetching attempt:', error);
    res.status(500).json({ message: 'Error fetching attempt', error });
  } 
};

module.exports = { submitQuiz, getAttempt };
