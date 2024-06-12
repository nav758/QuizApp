const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for each question attempt
const questionSchema = new Schema({
  questionId: {
    type: String,
    required: true
  },
  correctCountQuestion: {
    type: Number,
    required: true,
    default: 0
  },
  optionChosen0: {
    type: Number,
    required: true,
    default: 0
  },
  optionChosen1: {
    type: Number,
    required: true,
    default: 0
  },
  optionChosen2: {
    type: Number,
    required: true,
    default: 0
  },
  optionChosen3: {
    type: Number,
    required: true,
    default: 0
  },
  questionAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  attemptOptions: [{
    optionChosen: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }]
});

// Schema for the overall quiz attempt
const AttemptSchema = new Schema({
  quizId: {
    type: String,
    required: true
  },
  attempts: [questionSchema],
  correctCounts: {
    type: Number,
    required: true
  },
  totalAttempts: {
    type: Number,
    required: true
  }
});

const Attempt = mongoose.model("Attempt", AttemptSchema);
module.exports = Attempt;
