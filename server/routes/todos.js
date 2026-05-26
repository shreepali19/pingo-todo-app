const express = require('express');
const { body } = require('express-validator');
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const todoValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title max 200 chars'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description max 1000 chars'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
];

const updateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
  body('description').optional().isLength({ max: 1000 }),
  body('completed').optional().isBoolean().withMessage('Completed must be boolean'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
];

router.use(protect);

router.get('/', getTodos);
router.post('/', todoValidation, createTodo);
router.put('/:id', updateValidation, updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
