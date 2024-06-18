const asyncHandler = require("express-async-handler");
const Question = require("../models/questionModel");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
});

//@desc Get all questions with userid
//@route GET /api/users/:userid/questions
//@access public
const getQuestions = asyncHandler(async (req, res) => {
  console.log("User ID", req.params.userid);
  const questions = await Question.find({ user_id: req.params.userid });
  res.status(200).json(questions);
});

//@desc Create new question
//@route POST /api/questions
//@access private
const createQuestion = asyncHandler(async (req, res) => {
  const question = req.body.question;
  if (!question) {
    res.status(400);
    throw new Error("Question is required!");
  }

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: question }],
    model: "gpt-3.5-turbo",
  });
  const answer = chatCompletion.choices[0].message.content;
  const ques = await Question.create({
    question,
    answer,
    user_id: req.user.id,
  });
  res.status(201).json(ques);
});

//@desc Get Question by ID
//@route GET /api/questions/:id
//@access public
const getQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    res.status(404);
    throw new Error("Question not found!");
  } else {
    console.log("Question Detected", req.params.id);
    res.status(200).json(question);
  }
});

module.exports = {
  createQuestion,
  getQuestion,
  getQuestions,
};
