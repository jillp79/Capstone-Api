var express = require('express');
var router = express.Router();
const {Category, Question, Answer} = require('../lib/models');

// List out the questions for a particular category

// GET /api/v1/categories
// GET /api/v1/categories/:categoryId/questions
// POST /api/v1/categories/:categoryId/questions
// DELETE /api/v1/categories/:categoryId/questions/:questionId

// POST /api/v1/categories/:categoryId/questions/:questionId/answers
// GET /api/v1/categories/:categoryId/questions/:questionId/answers
// DELETE /api/v1/categories/:categoryId/questions/:questionId/answers/:answerId
// PUT /api/v1/categories/:categoryId/questions/:questionId/answers/:answerId/:state

router.get('/categories', async function(req, res, next) {
    let categories = await Category.findAll({});
    res.json(categories);
});

//#region Questions

router.post('/categories/:categoryId/questions', async function(req, res, next) {
    let body = req.body;
    body.categoryId = req.params.categoryId;
    let question = await Question.create(body);
    res.json(question);
});

router.get('/categories/:categoryId/questions', async function(req, res, next) {
    let questions = await Question.findAll({where: {categoryId: req.params.categoryId}, include: [{model: Answer}]});
    res.json(questions);
});

router.delete('/categories/:categoryId/questions/:questionId', async function(req, res, next) {
    let answers = await Question.destroy({where:{id:req.params.questionId}});
    res.json(answers);
});

//#endregion

//#region Answers

router.post('/categories/:categoryId/questions/:questionId/answers', async function(req, res, next) {
    let body = req.body;
    body.questionId = req.params.questionId;
    let answer = await Answer.create(body);
    res.json(answer);
});

router.get('/categories/:categoryId/questions/:questionId/answers', async function(req, res, next) {
    let answers = await Answer.findAll({where: {questionId: req.params.questionId}});
    res.json(answers);
});

router.delete('/categories/:categoryId/questions/:questionId/answers/:answerId', async function(req, res, next) {
    let answers = await Answer.destroy({where:{id:req.params.answerId}});
    res.json(answers);
});

router.put('/categories/:categoryId/questions/:questionId/answers/:answerId/:state', async function(req, res, next) {
    let answers = await Answer.update({correctAnswer:req.params.state},{where:{id:req.params.answerId}});
    res.json(answers);
});

//#endregion


module.exports = router;
