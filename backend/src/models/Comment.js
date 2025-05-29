const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [300, "Comment cannot exceed 300 characters"],
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task reference is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Índices para optimizar consultas
commentSchema.index({ task: 1, createdAt: -1 }); // Comentarios por tarea ordenados por fecha
commentSchema.index({ user: 1 }); // Comentarios por usuario

// Método para obtener información completa del comentario
commentSchema.methods.getFullInfo = async function () {
  return await this.populate([
    { path: "user", select: "name email" },
    { path: "task", select: "title" },
  ]);
};

// Middleware pre-save: Validar que la tarea existe y pertenece al usuario
commentSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("task")) {
    const Task = mongoose.model("Task");
    const task = await Task.findById(this.task);

    if (!task) {
      return next(new Error("Task does not exist"));
    }

    // Verificar que el usuario puede comentar en esta tarea
    // (la tarea debe pertenecerle al usuario)
    if (task.user.toString() !== this.user.toString()) {
      return next(new Error("You can only comment on your own tasks"));
    }
  }
  next();
});

// Método estático para obtener comentarios de una tarea con información del usuario
commentSchema.statics.getTaskComments = async function (taskId) {
  return await this.find({ task: taskId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
};

// Método estático para contar comentarios por tarea
commentSchema.statics.countByTask = async function (taskId) {
  return await this.countDocuments({ task: taskId });
};

// Virtual para formato de fecha amigable
commentSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
});

// Incluir virtuals en JSON
commentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Comment", commentSchema);
