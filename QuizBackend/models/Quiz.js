const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
  },
});
const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  pollType: {
    type: String,
    enum: ["text", "image", "textImage"],
    default: "text",
  },
  options: [optionSchema],
  timer: {
    type: String,
    enum: ["OFF", "05", "10"],
    default: "OFF", 
  },
});

const quizSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true,
  },
  quizType: {
    type: String,
    enum: ["Quiz", "Poll"],
    required: true,
  },
  questions: [questionSchema],
  refUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  impressions: {
    type: Number,
    default: 0,
  }
}
, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

quizSchema.methods.incrementImpressions = async function() {
    this.impressions += 1;
    await this.save();
    return this.impressions;
  };

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
