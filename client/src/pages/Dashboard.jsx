import { useEffect, useState } from "react";
import API from "../services/api";
import KanbanBoard from "../components/KanbanBoard";
import NewTaskModal from "../components/NewTaskModal"; // Naya component import kiya
import { Moon, Sun, LayoutDashboard, Target, Briefcase, CheckCircle, LogOut, Search, Plus } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const { darkMode, setDarkMode } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => t.status === "In Progress").length,
    done: tasks.filter(t => t.status === "Done").length,
    progress: tasks.length ? Math.round((tasks.filter(t => t.status === "Done").length / tasks.length) * 100) : 0
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0b0f1a] text-slate-900 dark:text-white transition-colors duration-500 font-sans">
      
      {/* 🚀 Futuristic Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 font-black text-xl tracking-tighter uppercase italic">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <LayoutDashboard size={20}/>
          </div>
          TaskFlow <span className="text-indigo-600 ml-1">Pro</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8 relative hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search mission..." 
            className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="hidden md:flex bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] items-center gap-2 transition-all active:scale-90 shadow-xl shadow-indigo-500/20"
          >
            <Plus size={16}/> New Task
          </button>
          
          <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border dark:border-white/10">
            {darkMode ? <Sun size={18} className="text-amber-400"/> : <Moon size={18} className="text-indigo-600"/>}
          </button>

          <button onClick={() => {localStorage.clear(); window.location.href="/";}} className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all">
             <LogOut size={18}/>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* 📊 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatBox icon={<Briefcase/>} label="Total Load" val={stats.total} color="indigo" />
          <StatBox icon={<Target/>} label="In Progress" val={stats.active} color="amber" />
          <StatBox icon={<CheckCircle/>} label="Completed" val={stats.done} color="emerald" />
          
          {/* Efficiency Box */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-[2.2rem] border-2 border-slate-100 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-all group">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500">Efficiency</div>
             <div className="text-4xl font-black mb-4">{stats.progress}%</div>
             <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-1000" style={{width: `${stats.progress}%`}}></div>
             </div>
          </div>
        </div>

        {/* 📱 Floating Add Button for Mobile */}
        <button onClick={() => setIsModalOpen(true)} className="md:hidden fixed bottom-8 right-8 z-50 bg-indigo-600 text-white p-5 rounded-full shadow-2xl shadow-indigo-600/50 active:scale-75 transition-all">
          <Plus size={28}/>
        </button>

        {/* 📋 Kanban Board */}
        <KanbanBoard tasks={filteredTasks} fetchTasks={fetchTasks} />
      </main>

      {/* 🛠 New Task Modal Component */}
      {isModalOpen && (
        <NewTaskModal 
          fetchTasks={fetchTasks} 
          closeModal={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

function StatBox({icon, label, val, color}) {
  const themes = {
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200/50 dark:border-indigo-500/20",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200/50 dark:border-amber-500/20",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-500/20"
  };
  return (
    <div className="bg-white dark:bg-[#111827] p-6 rounded-[2.2rem] border-2 border-slate-100 dark:border-white/5 flex items-center gap-5 shadow-sm hover:shadow-lg transition-all cursor-default group">
      <div className={`p-4 rounded-2xl border ${themes[color]} group-hover:scale-110 transition-transform`}>{icon}</div>
      <div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-4xl font-black">{val}</div>
      </div>
    </div>
  );
}