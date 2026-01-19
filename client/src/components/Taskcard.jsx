import { useState } from "react";
import API from "../services/api";
import { Trash2, Plus, ChevronDown, ChevronUp, CheckCircle2, Tag, MoreHorizontal, Calendar, Target, Hash } from "lucide-react";
import toast from "react-hot-toast";

export default function TaskCard({ task, fetchTasks }) {
  const [showChecklist, setShowChecklist] = useState(false);
  const [newSubTask, setNewSubTask] = useState("");

  const priorityStyles = {
    High: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
    Low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
  };

  const updateStatus = async (newStatus) => {
    try {
      await API.put(`/tasks/${task._id}`, { status: newStatus });
      fetchTasks();
      toast.success(`Moved to ${newStatus}`);
    } catch (err) { toast.error("Update failed"); }
  };

  const addSubTask = async (e) => {
    e.preventDefault();
    if (!newSubTask.trim()) return;
    const updatedChecklist = [...task.checklist, { text: newSubTask, completed: false }];
    await API.put(`/tasks/${task._id}`, { checklist: updatedChecklist });
    setNewSubTask("");
    fetchTasks();
  };

  const toggleSubTask = async (index) => {
    const updatedChecklist = [...task.checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;
    await API.put(`/tasks/${task._id}`, { checklist: updatedChecklist });
    fetchTasks();
  };

  const completed = task.checklist.filter(t => t.completed).length;
  const progress = task.checklist.length > 0 ? Math.round((completed / task.checklist.length) * 100) : 0;
  const isDone = task.status === "Done";

  return (
    <div className={`
      relative p-5 rounded-[2.2rem] flex flex-col gap-4 transition-all duration-300 group
      bg-white dark:bg-slate-800/80 backdrop-blur-md
      border-2 border-slate-100 dark:border-white/5
      shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
      hover:shadow-[0_30px_60px_-12px_rgba(79,70,229,0.15)] hover:-translate-y-2
      ${isDone ? "opacity-80" : "opacity-100"}
    `}>
      
      {/* 1. TOP BAR: Priority & Delete */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
          <span className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
            <Hash size={12} className="text-indigo-500" /> {task.category || "General"}
          </span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); API.delete(`/tasks/${task._id}`).then(fetchTasks); }} 
          className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* 2. TITLE SECTION */}
      <div className="space-y-1">
        <h3 className={`text-[17px] font-bold leading-tight text-slate-800 dark:text-white transition-colors ${isDone ? "line-through opacity-50 text-slate-400" : ""}`}>
          {task.title}
        </h3>
      </div>
      
      {/* 3. PROGRESS SYSTEM (Clean UI) */}
      <div className="bg-slate-50/50 dark:bg-black/20 p-4 rounded-[1.5rem] border border-slate-100 dark:border-white/5 shadow-inner">
        <div className="flex justify-between items-center mb-2.5 px-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
          <span className={`text-[11px] font-black ${progress === 100 ? 'text-emerald-500' : 'text-indigo-500'}`}>
             {progress}%
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out shadow-[0_0_15px] ${progress === 100 ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-indigo-500 shadow-indigo-500/40'}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 4. META INFO */}
      <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold px-1">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-indigo-500" />
            <span>{task.deadline ? new Date(task.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "Planned"}</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-70">
             <Target size={14} className="text-slate-400" />
             <span className="uppercase tracking-widest">{task.status}</span>
          </div>
      </div>

      {/* 5. CHECKLIST SYSTEM (Refined) */}
      <div className="space-y-2">
        <button 
          onClick={() => setShowChecklist(!showChecklist)}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:border-indigo-500/30 transition-all group/btn"
        >
          <span className="flex items-center gap-2 tracking-wider"> 
             <MoreHorizontal size={14} className="group-hover/btn:rotate-90 transition-transform" /> 
             Mission Steps ({completed}/{task.checklist.length})
          </span>
          {showChecklist ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>

        {showChecklist && (
          <div className="pt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="max-h-36 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
              {task.checklist.map((item, index) => (
                <label key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-white/5 transition-all group/item">
                  <input 
                    type="checkbox" 
                    checked={item.completed} 
                    onChange={() => toggleSubTask(index)} 
                    className="w-4.5 h-4.5 rounded-md border-slate-300 dark:border-white/10 bg-transparent text-indigo-600 focus:ring-0 transition-all" 
                  />
                  <span className={`text-[12px] font-semibold transition-all ${item.completed ? 'line-through text-slate-400 opacity-60' : 'text-slate-700 dark:text-slate-200'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
            
            <form onSubmit={addSubTask} className="flex items-center bg-white dark:bg-black/40 border-2 border-slate-100 dark:border-white/10 rounded-2xl overflow-hidden focus-within:border-indigo-500/50 transition-all">
              <input 
                type="text" 
                placeholder="Add next step..." 
                className="flex-1 bg-transparent px-4 py-2.5 text-[11px] font-medium outline-none text-slate-600 dark:text-white placeholder:text-slate-400" 
                value={newSubTask} 
                onChange={(e) => setNewSubTask(e.target.value)} 
              />
              <button className="p-2.5 text-indigo-500 hover:bg-indigo-600 hover:text-white transition-all">
                <Plus size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 6. MAIN ACTION BUTTON */}
      <div className="mt-1">
        {!isDone ? (
          <button 
            onClick={() => updateStatus(task.status === "Todo" ? "In Progress" : "Done")}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] border-t-2 border-white/20 transition-all active:scale-95"
          >
            {task.status === "Todo" ? "Launch Mission" : "Secure Mission"}
          </button>
        ) : (
          <div className="w-full py-4 flex items-center justify-center gap-2 text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-[1.5rem] border-2 border-emerald-100 dark:border-emerald-500/20 uppercase tracking-[0.1em]">
            <CheckCircle2 size={18} /> Mission Secured
          </div>
        )}
      </div>
    </div>
  );
}