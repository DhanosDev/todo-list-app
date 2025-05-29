const express = require("express");
const { body, param } = require("express-validator");
const {
  getTaskComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
  getCommentCount,
} = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Apply auth protection to ALL routes
router.use(protect);

// @route   GET /api/tasks/:taskId/comments
// @desc    Get all comments for a specific task
// @access  Private
router.get(
  "/:taskId/comments",
  [param("taskId").isMongoId().withMessage("Invalid task ID format")],
  getTaskComments
);

// @route   POST /api/tasks/:taskId/comments
// @desc    Create new comment for a task
// @access  Private
router.post(
  "/:taskId/comments",
  [
    param("taskId").isMongoId().withMessage("Invalid task ID format"),
    body("content")
      .trim()
      .isLength({ min: 1, max: 300 })
      .withMessage(
        "Comment content is required and must be between 1 and 300 characters"
      ),
  ],
  createComment
);

// @route   GET /api/tasks/:taskId/comments/count
// @desc    Get comment count for a specific task
// @access  Private
router.get(
  "/:taskId/comments/count",
  [param("taskId").isMongoId().withMessage("Invalid task ID format")],
  getCommentCount
);

// @route   GET /api/comments/:id
// @desc    Get single comment by ID
// @access  Private
router.get(
  "/comments/:id",
  [param("id").isMongoId().withMessage("Invalid comment ID format")],
  getComment
);

// @route   PUT /api/comments/:id
// @desc    Update comment
// @access  Private
router.put(
  "/comments/:id",
  [
    param("id").isMongoId().withMessage("Invalid comment ID format"),
    body("content")
      .trim()
      .isLength({ min: 1, max: 300 })
      .withMessage(
        "Comment content is required and must be between 1 and 300 characters"
      ),
  ],
  updateComment
);

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private
router.delete(
  "/comments/:id",
  [param("id").isMongoId().withMessage("Invalid comment ID format")],
  deleteComment
);

module.exports = router;
