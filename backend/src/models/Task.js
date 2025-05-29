const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed"],
        message: "Status must be either pending or completed",
      },
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para optimizar consultas
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ parentTask: 1 });

// Método para verificar si una tarea puede completarse
// (no debe tener subtareas pendientes)
taskSchema.methods.canComplete = async function () {
  if (!this.parentTask) {
    // Es tarea padre
    const pendingSubtasks = await this.constructor.countDocuments({
      parentTask: this._id,
      status: "pending",
    });
    return pendingSubtasks === 0;
  }
  return true; // Las subtareas siempre pueden completarse
};

// Método para obtener todas las subtareas
taskSchema.methods.getSubtasks = async function () {
  return await this.constructor
    .find({ parentTask: this._id })
    .sort({ createdAt: -1 });
};

// Método virtual para verificar si es subtarea
taskSchema.virtual("isSubtask").get(function () {
  return this.parentTask !== null;
});

// Método virtual para verificar si es tarea padre
taskSchema.virtual("isParentTask").get(function () {
  return this.parentTask === null;
});

// Incluir virtuals en JSON
taskSchema.set("toJSON", { virtuals: true });

// Middleware pre-save: Validar que parentTask existe si se proporciona
taskSchema.pre("save", async function (next) {
  if (this.parentTask && this.isModified("parentTask")) {
    const parentExists = await this.constructor.findById(this.parentTask);
    if (!parentExists) {
      return next(new Error("Parent task does not exist"));
    }

    // Verificar que parent task pertenece al mismo usuario
    if (parentExists.user.toString() !== this.user.toString()) {
      return next(new Error("Parent task must belong to the same user"));
    }
  }
  next();
});

// Middleware post-remove: Eliminar subtareas cuando se elimina tarea padre
taskSchema.pre("findOneAndDelete", async function (next) {
  const taskId = this.getQuery()["_id"];
  if (taskId) {
    // Eliminar todas las subtareas
    await this.model.deleteMany({ parentTask: taskId });
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
