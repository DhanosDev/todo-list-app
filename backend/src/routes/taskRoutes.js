const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getSubtasks,
  createSubtask,
} = require("../controllers/taskController");

// Validaciones comunes
const taskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

const mongoIdValidation = [
  param("id").isMongoId().withMessage("Invalid task ID format"),
];

const statusValidation = [
  body("status")
    .isIn(["pending", "completed"])
    .withMessage("Status must be either pending or completed"),
];

// @route   GET /api/tasks
// @desc    Get all tasks with optional filters
// @access  Private (será en Fase 3)
// Query params: ?status=pending|completed&includeSubtasks=true
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
// @desc    Get single task by ID with subtasks
// @access  Private (será en Fase 3)
router.get("/:id", mongoIdValidation, getTaskById);

// @route   POST /api/tasks
// @desc    Create new task (can be main task or subtask)
// @access  Private (será en Fase 3)
router.post(
  "/",
  [
    ...taskValidation,
    body("parentTask")
      .optional()
      .isMongoId()
      .withMessage("Parent task must be a valid ID"),
  ],
  createTask
);

// @route   PUT /api/tasks/:id
// @desc    Update task (title and description only)
// @access  Private (será en Fase 3)
router.put("/:id", [...mongoIdValidation, ...taskValidation], updateTask);

// @route   PUT /api/tasks/:id/status
// @desc    Update task status
// @access  Private (será en Fase 3)
router.put(
  "/:id/status",
  [...mongoIdValidation, ...statusValidation],
  updateTaskStatus
);

// @route   DELETE /api/tasks/:id
// @desc    Delete task (and subtasks if it's a parent)
// @access  Private (será en Fase 3)
router.delete("/:id", mongoIdValidation, deleteTask);

// @route   GET /api/tasks/:id/subtasks
// @desc    Get all subtasks of a task
// @access  Private (será en Fase 3)
router.get(
  "/:id/subtasks",
  [param("id").isMongoId().withMessage("Invalid parent task ID format")],
  getSubtasks
);

// @route   POST /api/tasks/:id/subtasks
// @desc    Create subtask for a specific task
// @access  Private (será en Fase 3)
router.post(
  "/:id/subtasks",
  [
    param("id").isMongoId().withMessage("Invalid parent task ID format"),
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Subtask title is required")
      .isLength({ max: 100 })
      .withMessage("Subtask title cannot exceed 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Subtask description cannot exceed 500 characters"),
  ],
  createSubtask
);

module.exports = router;
