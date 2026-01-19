import { useState } from "react";
import API from "../services/api";
import { X, Plus, Calendar, Tag, AlertCircle, Layout, ListTodo } from "lucide-react";
import toast from "react-hot-toast";

export default function NewTaskModal({ fetchTasks, closeModal }) {
  const [formData, setFormData] = useState({
    title: "",
    priority: "Medium",
    category: "Personal",
    deadline: "",
    checklist: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Title is required!");
    try {
      await API.post("/tasks", formData);
      fetchTasks();
      closeModal();
      toast.success("New Mission Launched!");
    } catch (err) {
      toast.error("Deployment failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-white/20 overflow-hidden relative">
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-gradient-to-b from-indigo-50/50 dark:from-indigo-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30">
              <Plus className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Deploy New Task</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Configuration</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Layout size={12} /> Task Title
            </label>
            <input
              type="text"
              placeholder="What needs to be done?"
              className="w-full bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/5 p-4 rounded-2xl outline-none focus:border-indigo-500/50 transition-all text-slate-700 dark:text-white font-semibold"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Grid Selection: Priority & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <AlertCircle size={12} /> Priority
              </label>
              <select
                className="w-full bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/5 p-4 rounded-2xl outline-none text-slate-600 dark:text-slate-300 font-bold appearance-none cursor-pointer focus:border-indigo-500/50"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                value={formData.priority}
              >
                <option value="High">High (CRITICAL)</option>
                <option value="Medium">Medium (STANDARD)</option>
                <option value="Low">Low (MINOR)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Tag size={12} /> Category
              </label>
              <select
                className="w-full bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/5 p-4 rounded-2xl outline-none text-slate-600 dark:text-slate-300 font-bold appearance-none cursor-pointer focus:border-indigo-500/50"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                value={formData.category}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Deadline Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Calendar size={12} /> Target Deadline
            </label>
            <input
              type="date"
              className="w-full bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/5 p-4 rounded-2xl outline-none text-slate-600 dark:text-slate-300 font-bold focus:border-indigo-500/50"
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-[1.8rem] shadow-[0_15px_30px_-5px_rgba(79,70,229,0.5)] border-t-2 border-white/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <ListTodo size={18} /> Deploy Mission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}