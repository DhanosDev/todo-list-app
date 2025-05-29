const { validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const Task = require("../models/Task");

// @desc    Get all comments for a specific task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
const getTaskComments = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { taskId } = req.params;
    const userId = req.user._id;

    // Verify task exists and belongs to user
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const comments = await Comment.find({ task: taskId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Get task comments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving comments",
    });
  }
};

// @desc    Create new comment
// @route   POST /api/tasks/:taskId/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { content } = req.body;
    const { taskId } = req.params;
    const userId = req.user._id;

    // Verify task exists and belongs to user
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const comment = await Comment.create({
      content,
      task: taskId,
      user: userId,
    });

    // Populate user info for response
    await comment.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating comment",
    });
  }
};

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Private
const getComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user._id;

    // Find comment and populate task to verify ownership
    const comment = await Comment.findById(req.params.id)
      .populate("user", "name email")
      .populate("task");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Verify user owns the task this comment belongs to
    if (comment.task.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not authorized to view this comment",
      });
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error("Get comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving comment",
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { content } = req.body;
    const userId = req.user._id;

    // Find comment and verify it belongs to the user
    const comment = await Comment.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or access denied",
      });
    }

    comment.content = content;
    await comment.save();
    await comment.populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating comment",
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user._id;

    // Find comment and verify it belongs to the user
    const comment = await Comment.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or access denied",
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting comment",
    });
  }
};

// @desc    Get comment count for a task
// @route   GET /api/tasks/:taskId/comments/count
// @access  Private
const getCommentCount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { taskId } = req.params;
    const userId = req.user.id;

    // Verify task exists and belongs to user
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const count = await Comment.countDocuments({ task: taskId });

    res.status(200).json({
      success: true,
      data: {
        taskId,
        commentCount: count,
      },
    });
  } catch (error) {
    console.error("Get comment count error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting comment count",
    });
  }
};

module.exports = {
  getTaskComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
  getCommentCount,
};
