const express = require("express");

const router = express.Router();
const {
  createQuestion,
  getQuestion,
  getQuestions,
} = require("../controllers/questionsController");

const validateToken = require("../middleware/validateTokenHandler");

// router.use(validateToken);

router.post("/questions", validateToken, createQuestion);
router.get("/questions/:id", getQuestion);
router.get("/users/:userid/questions", getQuestions);

module.exports = router;
