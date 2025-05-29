const Comment = require("../models/Comment");
const Task = require("../models/Task");
const { validationResult } = require("express-validator");

// TEMP_USER_ID para testing hasta implementar JWT en Fase 3
const TEMP_USER_ID = "507f1f77bcf86cd799439011";

// @desc    Get all comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private (será en Fase 3)
exports.getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Verificar que la tarea existe y pertenece al usuario
    const task = await Task.findOne({
      _id: taskId,
      user: TEMP_USER_ID,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Obtener comentarios con información del usuario
    const comments = await Comment.find({ task: taskId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      task: {
        id: task._id,
        title: task.title,
      },
      data: comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new comment
// @route   POST /api/tasks/:taskId/comments
// @access  Private (será en Fase 3)
exports.createComment = async (req, res) => {
  try {
    // Validar errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors.array(),
      });
    }

    const { taskId } = req.params;
    const { content } = req.body;

    // Verificar que la tarea existe y pertenece al usuario
    const task = await Task.findOne({
      _id: taskId,
      user: TEMP_USER_ID,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Crear comentario
    const comment = await Comment.create({
      content,
      task: taskId,
      user: TEMP_USER_ID,
    });

    // Obtener comentario con información del usuario para la respuesta
    await comment.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (será en Fase 3)
exports.updateComment = async (req, res) => {
  try {
    // Validar errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors.array(),
      });
    }

    const { content } = req.body;

    // Buscar comentario que pertenezca al usuario
    const comment = await Comment.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Actualizar contenido
    comment.content = content;
    await comment.save();

    // Obtener comentario con información del usuario
    await comment.populate("user", "name email");

    res.json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (será en Fase 3)
exports.deleteComment = async (req, res) => {
  try {
    // Buscar comentario que pertenezca al usuario
    const comment = await Comment.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await Comment.findOneAndDelete({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single comment by ID
// @route   GET /api/comments/:id
// @access  Private (será en Fase 3)
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    })
      .populate("user", "name email")
      .populate("task", "title");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get comment count for a task
// @route   GET /api/tasks/:taskId/comments/count
// @access  Private (será en Fase 3)
exports.getCommentCount = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Verificar que la tarea existe y pertenece al usuario
    const task = await Task.findOne({
      _id: taskId,
      user: TEMP_USER_ID,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const count = await Comment.countDocuments({ task: taskId });

    res.json({
      success: true,
      task: {
        id: task._id,
        title: task.title,
      },
      commentCount: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
