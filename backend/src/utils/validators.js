const { body, param, query } = require("express-validator");

const validators = {
  // MongoDB ObjectId validation
  mongoId: (field = "id") => [
    param(field).isMongoId().withMessage(`Invalid ${field} format`),
  ],

  // Task validations
  task: {
    title: body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),

    description: body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),

    status: body("status")
      .isIn(["pending", "completed"])
      .withMessage("Status must be either pending or completed"),

    parentTask: body("parentTask")
      .optional()
      .isMongoId()
      .withMessage("Parent task must be a valid ID"),
  },

  // Comment validations
  comment: {
    content: body("content")
      .trim()
      .notEmpty()
      .withMessage("Comment content is required")
      .isLength({ min: 1, max: 300 })
      .withMessage("Comment must be between 1 and 300 characters"),
  },

  // Query parameter validations
  query: {
    status: query("status")
      .optional()
      .isIn(["pending", "completed"])
      .withMessage("Status must be either pending or completed"),

    includeSubtasks: query("includeSubtasks")
      .optional()
      .isBoolean()
      .withMessage("includeSubtasks must be a boolean"),

    page: query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),

    limit: query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
  },
};

// Combinaciones de validaciones frecuentes
const validationSets = {
  createTask: [
    validators.task.title,
    validators.task.description,
    validators.task.parentTask,
  ],

  updateTask: [
    ...validators.mongoId(),
    validators.task.title,
    validators.task.description,
  ],

  updateTaskStatus: [...validators.mongoId(), validators.task.status],

  createComment: [...validators.mongoId("taskId"), validators.comment.content],

  updateComment: [...validators.mongoId(), validators.comment.content],

  getTasksWithFilters: [
    validators.query.status,
    validators.query.includeSubtasks,
    validators.query.page,
    validators.query.limit,
  ],
};

module.exports = {
  validators,
  validationSets,
};
