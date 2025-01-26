
  
const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  text: { type: String, required: true },
  showInOption: { type: Boolean, required: true }, // For MCQ options
  isAnswer: { type: Boolean, required: true },      // For MCQ answer check
});

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrectAnswer: { type: Boolean, required: true }
});

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true },           // 'MCQ' or 'ANAGRAM'
  anagramType: { type: String },                    // Optional: Type of Anagram, if any
  blocks: [blockSchema],                            // Blocks for Anagram
  options: [optionSchema],                          // Options for MCQ
  siblingId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  solution: { type: String, required: true },      // Correct answer (for anagram)
  title: { type: String, required: true },         // Question Title
});

module.exports = mongoose.model("Question", questionSchema);
