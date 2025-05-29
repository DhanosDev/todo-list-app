const Task = require("../models/Task");
const { validationResult } = require("express-validator");

// TEMP_USER_ID para testing hasta implementar JWT en Fase 3
const TEMP_USER_ID = "507f1f77bcf86cd799439011";

// @desc    Get all tasks with optional status filter
// @route   GET /api/tasks?status=pending|completed
// @access  Private (será en Fase 3)
exports.getTasks = async (req, res) => {
  try {
    const filter = { user: TEMP_USER_ID };

    // Filtrar por status si se proporciona
    if (
      req.query.status &&
      ["pending", "completed"].includes(req.query.status)
    ) {
      filter.status = req.query.status;
    }

    // Solo traer tareas padre (no subtareas) por defecto
    if (!req.query.includeSubtasks) {
      filter.parentTask = null;
    }

    const tasks = await Task.find(filter)
      .populate("parentTask", "title")
      .sort({ createdAt: -1 });

    // Para cada tarea padre, incluir conteo de subtareas
    const tasksWithSubtaskCount = await Promise.all(
      tasks.map(async (task) => {
        const taskObj = task.toJSON();
        if (!task.parentTask) {
          const subtaskCount = await Task.countDocuments({
            parentTask: task._id,
          });
          const pendingSubtasks = await Task.countDocuments({
            parentTask: task._id,
            status: "pending",
          });
          taskObj.subtaskCount = subtaskCount;
          taskObj.pendingSubtasks = pendingSubtasks;
        }
        return taskObj;
      })
    );

    res.json({
      success: true,
      count: tasks.length,
      data: tasksWithSubtaskCount,
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

// @desc    Get single task by ID with subtasks
// @route   GET /api/tasks/:id
// @access  Private (será en Fase 3)
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    }).populate("parentTask", "title");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Si es tarea padre, incluir subtareas
    let subtasks = [];
    if (!task.parentTask) {
      subtasks = await Task.find({ parentTask: task._id }).sort({
        createdAt: -1,
      });
    }

    res.json({
      success: true,
      data: {
        ...task.toJSON(),
        subtasks: subtasks,
      },
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

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (será en Fase 3)
exports.createTask = async (req, res) => {
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

    const { title, description, parentTask } = req.body;

    // Crear objeto de tarea
    const taskData = {
      title,
      description: description || "",
      user: TEMP_USER_ID,
    };

    // Si es subtarea, validar que parent task existe
    if (parentTask) {
      const parentExists = await Task.findOne({
        _id: parentTask,
        user: TEMP_USER_ID,
      });

      if (!parentExists) {
        return res.status(400).json({
          success: false,
          message: "Parent task not found",
        });
      }

      taskData.parentTask = parentTask;
    }

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: parentTask
        ? "Subtask created successfully"
        : "Task created successfully",
      data: task,
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

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (será en Fase 3)
exports.updateTask = async (req, res) => {
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

    const task = await Task.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const { title, description } = req.body;

    // Actualizar campos permitidos
    if (title) task.title = title;
    if (description !== undefined) task.description = description;

    await task.save();

    res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
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

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private (será en Fase 3)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be pending or completed",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Si es tarea padre y se quiere completar, verificar subtareas
    if (status === "completed" && !task.parentTask) {
      const canComplete = await task.canComplete();
      if (!canComplete) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot complete task with pending subtasks. Complete all subtasks first.",
        });
      }
    }

    task.status = status;
    await task.save();

    res.json({
      success: true,
      message: `Task marked as ${status}`,
      data: task,
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

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (será en Fase 3)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Si es tarea padre, también eliminar subtareas (manejado por middleware del modelo)
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    res.json({
      success: true,
      message: task.parentTask
        ? "Subtask deleted successfully"
        : "Task and all subtasks deleted successfully",
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

// @desc    Get subtasks of a task
// @route   GET /api/tasks/:id/subtasks
// @access  Private (será en Fase 3)
exports.getSubtasks = async (req, res) => {
  try {
    // Verificar que la tarea padre existe
    const parentTask = await Task.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    if (!parentTask) {
      return res.status(404).json({
        success: false,
        message: "Parent task not found",
      });
    }

    const subtasks = await Task.find({
      parentTask: req.params.id,
      user: TEMP_USER_ID,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: subtasks.length,
      parentTask: {
        id: parentTask._id,
        title: parentTask.title,
      },
      data: subtasks,
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

// @desc    Create subtask
// @route   POST /api/tasks/:id/subtasks
// @access  Private (será en Fase 3)
exports.createSubtask = async (req, res) => {
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

    // Verificar que la tarea padre existe
    const parentTask = await Task.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    if (!parentTask) {
      return res.status(404).json({
        success: false,
        message: "Parent task not found",
      });
    }

    // Verificar que la tarea padre no es una subtarea
    if (parentTask.parentTask) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot create subtask of a subtask. Only main tasks can have subtasks.",
      });
    }

    const { title, description } = req.body;

    const subtask = await Task.create({
      title,
      description: description || "",
      user: TEMP_USER_ID,
      parentTask: req.params.id,
    });

    res.status(201).json({
      success: true,
      message: "Subtask created successfully",
      data: subtask,
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
