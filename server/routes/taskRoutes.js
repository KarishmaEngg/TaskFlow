const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the logged-in user
 */
router.get("/", auth, async (req, res) => {
  try {
    // FIX: Schema mein field 'user' hai, 'userId' nahi
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Fetching tasks failed: " + err.message });
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task with category and deadline
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title, priority, category, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({
      title,
      priority: priority || "Medium",
      category: category || "Work",
      deadline: deadline || Date.now(),
      status: "Todo",
      user: req.user.id // FIX: Must match Schema field name 'user'
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Post Error:", err.message);
    res.status(500).json({ message: "Could not save task: " + err.message });
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update any field (status, checklist, priority, etc.)
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Security: User must own the task
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Update failed: " + err.message });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Remove a task
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.json({ message: "Task Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed: " + err.message });
  }
});

module.exports = router;