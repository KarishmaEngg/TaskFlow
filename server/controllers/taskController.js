const Task = require("../models/Task");

// 1. Create a New Task
exports.createTask = async (req, res) => {
  try {
    const { title, priority, category, deadline } = req.body;

    // Validation: Title hona zaroori hai
    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const newTask = new Task({
      title,
      priority: priority || "Medium",
      category: category || "Work",
      deadline: deadline || Date.now(),
      user: req.user.id // Ye req.user.id authMiddleware se aa raha hai
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
};

// 2. Get All Tasks (sirf us user ke jo logged in hai)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Update Task (Status, Checklist, Priority, etc.)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Pehle check karein ki task exist karta hai aur user ka apna hai
    let task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to update this task" });
    }

    // Task update karein (req.body mein jo bhi change aayega wo save ho jayega)
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete" });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};