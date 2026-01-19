import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./Taskcard";
import API from "../services/api";
import { FolderOpen, ListTodo, Timer, CheckCircle2 } from "lucide-react";

const columns = ["Todo", "In Progress", "Done"];

export default function KanbanBoard({ tasks, fetchTasks }) {
  
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    try {
      await API.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      fetchTasks(); 
    } catch (err) {
      console.error("Drag drop failed:", err);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-8 mt-8 overflow-x-auto pb-10 custom-scrollbar min-h-[85vh] px-4">
        {columns.map((col) => {
          const columnTasks = tasks.filter((task) => task.status === col);

          return (
            <div key={col} className="flex-1 min-w-[360px] max-w-[400px] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 px-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border-2 border-current/20 ${
                    col === 'Todo' ? 'text-blue-500 bg-blue-50 dark:bg-blue-400/10' : 
                    col === 'In Progress' ? 'text-amber-500 bg-amber-50 dark:bg-amber-400/10' : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-400/10'
                  }`}>
                    {col === 'Todo' ? <ListTodo size={20}/> : col === 'In Progress' ? <Timer size={20}/> : <CheckCircle2 size={20}/>}
                  </div>
                  <h2 className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{col}</h2>
                </div>
                <span className="text-[10px] font-black bg-slate-100 dark:bg-white/10 text-slate-500 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
                  {columnTasks.length}
                </span>
              </div>

              <Droppable droppableId={col}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`
                      relative p-5 rounded-[2.5rem] min-h-[650px] transition-all duration-300 flex flex-col gap-6
                      border-2 ${snapshot.isDraggingOver 
                        ? "bg-indigo-50 dark:bg-indigo-600/5 border-indigo-400 dark:border-indigo-500 shadow-xl" 
                        : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-white/5"
                      }
                    `}
                  >
                    <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pb-10">
                      {columnTasks.length > 0 ? (
                        columnTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                // KanbanBoard.jsx mein Droppable ke andar className update karein:
// KanbanBoard.jsx mein Droppable ke andar className update karein:
className={`
  relative p-5 rounded-[2rem] min-h-[650px] transition-all duration-300 flex flex-col gap-6
  ${snapshot.isDraggingOver 
    ? "bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-300 dark:border-indigo-500/50" 
    : "bg-slate-100/40 dark:bg-[#151b2b] border-slate-200 dark:border-white/[0.05]" 
  }
  border-2
`}
                              >
                                <TaskCard task={task} fetchTasks={fetchTasks} />
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-32 opacity-20 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-[2rem]">
                          <FolderOpen size={40} strokeWidth={1.5} className="mb-4 text-slate-400 dark:text-white" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white text-center px-4">No assets in this sector</p>
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}