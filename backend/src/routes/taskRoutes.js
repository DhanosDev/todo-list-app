const express = require("express");
const { body, param, query } = require("express-validator");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getSubtasks,
  createSubtask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Apply auth protection to ALL routes
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for authenticated user
// @access  Private
router.get(
  "/",
  [
    query("status")
      .optional()
      .isIn(["pending", "completed"])
      .withMessage("Status must be either pending or completed"),
    query("includeSubtasks")
      .optional()
      .isBoolean()
      .withMessage("includeSubtasks must be a boolean"),
  ],
  getTasks
);

// @route   GET /api/tasks/:id
// @desc    Get single task by ID
// @access  Private
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid task ID format")],
  getTask
);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage(
        "Title is required and must be between 1 and 100 characters"
      ),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("parentTask")
      .optional()
      .isMongoId()
      .withMessage("Invalid parent task ID format"),
  ],
  createTask
);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid task ID format"),
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("status")
      .optional()
      .isIn(["pending", "completed"])
      .withMessage("Status must be either pending or completed"),
  ],
  updateTask
);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid task ID format")],
  deleteTask
);

// @route   PUT /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.put(
  "/:id/status",
  [
    param("id").isMongoId().withMessage("Invalid task ID format"),
    body("status")
      .isIn(["pending", "completed"])
      .withMessage("Status must be either pending or completed"),
  ],
  updateTaskStatus
);

// @route   GET /api/tasks/:id/subtasks
// @desc    Get subtasks for a specific task
// @access  Private
router.get(
  "/:id/subtasks",
  [param("id").isMongoId().withMessage("Invalid task ID format")],
  getSubtasks
);

// @route   POST /api/tasks/:id/subtasks
// @desc    Create subtask for a specific task
// @access  Private
router.post(
  "/:id/subtasks",
  [
    param("id").isMongoId().withMessage("Invalid parent task ID format"),
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage(
        "Title is required and must be between 1 and 100 characters"
      ),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
  ],
  createSubtask
);

module.exports = router;
