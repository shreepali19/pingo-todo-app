const { validationResult } = require('express-validator');
const Todo = require('../models/Todo');

// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const { filter, search, page = 1, limit = 50 } = req.query;

    const query = { userId: req.user._id };

    if (filter === 'completed') query.completed = true;
    else if (filter === 'pending') query.completed = false;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Todo.countDocuments(query);
    const completedCount = await Todo.countDocuments({ userId: req.user._id, completed: true });
    const pendingCount = await Todo.countDocuments({ userId: req.user._id, completed: false });

    res.json({
      success: true,
      todos,
      stats: {
        total: await Todo.countDocuments({ userId: req.user._id }),
        completed: completedCount,
        pending: pendingCount,
      },
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching todos.' });
  }
};

// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { title, description, priority } = req.body;

    const todo = await Todo.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      userId: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Todo created!', todo });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ success: false, message: 'Server error creating todo.' });
  }
};

// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found.' });
    }

    const { title, description, completed, priority } = req.body;

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;

    await todo.save();

    res.json({ success: true, message: 'Todo updated!', todo });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ success: false, message: 'Server error updating todo.' });
  }
};

// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found.' });
    }

    res.json({ success: true, message: 'Todo deleted successfully.' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting todo.' });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
