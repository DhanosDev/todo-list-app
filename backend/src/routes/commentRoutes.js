const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");

const {
  getComments,
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentCount,
} = require("../controllers/commentController");

// Validaciones comunes
const commentValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 1, max: 300 })
    .withMessage("Comment must be between 1 and 300 characters"),
];

const mongoIdValidation = [
  param("id").isMongoId().withMessage("Invalid comment ID format"),
];

const taskIdValidation = [
  param("taskId").isMongoId().withMessage("Invalid task ID format"),
];

// @route   GET /api/tasks/:taskId/comments/count
// @desc    Get comment count for a task (DEBE IR ANTES que /comments para evitar conflicto)
// @access  Private (será en Fase 3)
router.get("/tasks/:taskId/comments/count", taskIdValidation, getCommentCount);

// @route   GET /api/tasks/:taskId/comments
// @desc    Get all comments for a specific task
// @access  Private (será en Fase 3)
router.get("/tasks/:taskId/comments", taskIdValidation, getComments);

// @route   POST /api/tasks/:taskId/comments
// @desc    Create new comment for a task
// @access  Private (será en Fase 3)
router.post(
  "/tasks/:taskId/comments",
  [...taskIdValidation, ...commentValidation],
  createComment
);

// @route   GET /api/comments/:id
// @desc    Get single comment by ID
// @access  Private (será en Fase 3)
router.get("/comments/:id", mongoIdValidation, getCommentById);

// @route   PUT /api/comments/:id
// @desc    Update comment content
// @access  Private (será en Fase 3)
router.put(
  "/comments/:id",
  [...mongoIdValidation, ...commentValidation],
  updateComment
);

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private (será en Fase 3)
router.delete("/comments/:id", mongoIdValidation, deleteComment);

module.exports = router;
