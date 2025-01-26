
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Search questions by title (pagination included)
// router.get('/', async (req, res) => {
//   try {
//     const { query, page = 1, limit = 10 } = req.query;
//     const searchRegex = new RegExp(query, 'i'); // Case-insensitive regex

//     // Pagination logic
//     const questions = await Question.find({ title: { $regex: searchRegex } })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const totalQuestions = await Question.countDocuments({
//       title: { $regex: searchRegex },
//     });

//     const totalPages = Math.ceil(totalQuestions / limit);

//     res.json({
//       questions,
//       totalPages,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching questions' });
//   }
// });

// Backend API (Express.js example)
router.get('/', async (req, res) => {
  const { query, page, limit, type } = req.query;
  
  const filter = type ? { type } : {}; // If type is specified, filter by type
  
  try {
    const questions = await Question.find({ 
      title: { $regex: query, $options: 'i' }, // Search by query
      ...filter
    })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    const totalQuestions = await Question.countDocuments({ title: { $regex: query, $options: 'i' }, ...filter });
    
    res.json({
      questions,
      totalPages: Math.ceil(totalQuestions / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error });
  }
});


router.get('/:questionId', async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question details:', error);
    res.status(500).json({ message: 'Error fetching question details' });
  }
});

router.post('/verify-answer', async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;
    console.log('Request Body:', req.body);

    // Fetch the question from the database
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let isCorrect = false;

    // Check for MCQ
    if (question.type === 'MCQ') {
      console.log('Question Type is MCQ');
      const correctOption = question.options.find(option => option.isCorrectAnswer === true);
      if (correctOption) {
        isCorrect = correctOption.text.trim().toLowerCase() === userAnswer.trim().toLowerCase();
      }
    } 
    // Check for Anagram
    else if (question.type === 'ANAGRAM') {
      console.log('Question Type is ANAGRAM');
      isCorrect = question.solution.trim().toLowerCase() === userAnswer.trim().toLowerCase();
    }

    return res.json({ isCorrect });
  } catch (error) {
    console.error('Error during answer verification:', error.message);
    res.status(500).json({ message: 'Error verifying answer', error: error.message });
  }
});




module.exports = router;
