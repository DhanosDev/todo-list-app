const { validationResult } = require("express-validator");
const Task = require("../models/Task");

// @desc    Get all tasks for authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { status, includeSubtasks } = req.query;
    const userId = req.user._id; // From auth middleware

    // Build query
    let query = { user: userId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter subtasks if specified
    if (includeSubtasks === "false") {
      query.parentTask = { $exists: false };
    }

    // Get tasks with subtask counts
    const tasks = await Task.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "parentTask",
          as: "subtasks",
        },
      },
      {
        $addFields: {
          subtaskCount: { $size: "$subtasks" },
          pendingSubtasks: {
            $size: {
              $filter: {
                input: "$subtasks",
                cond: { $eq: ["$$this.status", "pending"] },
              },
            },
          },
          isParentTask: { $gt: [{ $size: "$subtasks" }, 0] },
          isSubtask: { $ne: ["$parentTask", null] },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving tasks",
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
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
    const task = await Task.findOne({
      _id: req.params.id,
      user: userId,
    }).populate("user", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Get subtasks if this is a parent task
    const subtasks = await Task.find({
      parentTask: task._id,
      user: userId,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...task.toObject(),
        subtasks,
        subtaskCount: subtasks.length,
        pendingSubtasks: subtasks.filter((st) => st.status === "pending")
          .length,
      },
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving task",
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { title, description, parentTask } = req.body;
    const userId = req.user._id;

    // If creating a subtask, verify parent task exists and belongs to user
    if (parentTask) {
      const parent = await Task.findOne({
        _id: parentTask,
        user: userId,
      });

      if (!parent) {
        return res.status(404).json({
          success: false,
          message: "Parent task not found",
        });
      }

      // Check if parent task is already a subtask (no nested subtasks)
      if (parent.parentTask) {
        return res.status(400).json({
          success: false,
          message: "Cannot create subtask of a subtask",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      user: userId,
      parentTask: parentTask || undefined,
    });

    // Populate user info for response
    await task.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: parentTask
        ? "Subtask created successfully"
        : "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating task",
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
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
    const updates = req.body;

    // Find task and verify ownership
    const task = await Task.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // If trying to update status, use the specific status endpoint logic
    if (updates.status && updates.status !== task.status) {
      if (updates.status === "completed" && !task.parentTask) {
        const canComplete = await task.canComplete();
        if (!canComplete) {
          return res.status(400).json({
            success: false,
            message: "Cannot complete task while subtasks are pending",
          });
        }
      }
    }

    // Update task
    Object.assign(task, updates);
    await task.save();
    await task.populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating task",
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user.id;
    const task = await Task.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Delete task (middleware will handle subtask deletion)
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting task",
    });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { status } = req.body;
    const userId = req.user.id;

    const task = await Task.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if parent task can be completed
    if (status === "completed" && !task.parentTask) {
      const canComplete = await task.canComplete();
      if (!canComplete) {
        return res.status(400).json({
          success: false,
          message: "Cannot complete task while subtasks are pending",
        });
      }
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${status}`,
      data: task,
    });
  } catch (error) {
    console.error("Update task status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating task status",
    });
  }
};

// @desc    Get subtasks for a task
// @route   GET /api/tasks/:id/subtasks
// @access  Private
const getSubtasks = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user.id;

    // Verify parent task exists and belongs to user
    const parentTask = await Task.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!parentTask) {
      return res.status(404).json({
        success: false,
        message: "Parent task not found",
      });
    }

    const subtasks = await Task.find({
      parentTask: req.params.id,
      user: userId,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: subtasks.length,
      data: subtasks,
    });
  } catch (error) {
    console.error("Get subtasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving subtasks",
    });
  }
};

// @desc    Create subtask
// @route   POST /api/tasks/:id/subtasks
// @access  Private
const createSubtask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { title, description } = req.body;
    const userId = req.user.id;
    const parentTaskId = req.params.id;

    // Verify parent task exists and belongs to user
    const parentTask = await Task.findOne({
      _id: parentTaskId,
      user: userId,
    });

    if (!parentTask) {
      return res.status(404).json({
        success: false,
        message: "Parent task not found",
      });
    }

    // Check if parent is already a subtask
    if (parentTask.parentTask) {
      return res.status(400).json({
        success: false,
        message: "Cannot create subtask of a subtask",
      });
    }

    const subtask = await Task.create({
      title,
      description,
      user: userId,
      parentTask: parentTaskId,
    });

    await subtask.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Subtask created successfully",
      data: subtask,
    });
  } catch (error) {
    console.error("Create subtask error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating subtask",
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getSubtasks,
  createSubtask,
};
