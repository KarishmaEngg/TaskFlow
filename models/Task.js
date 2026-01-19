const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, default: "Todo" },
  priority: { type: String, default: "Medium" },
  category: { type: String, default: "Work" },
  deadline: { type: Date, default: Date.now },
  checklist: [{ text: String, completed: { type: Boolean, default: false } }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);