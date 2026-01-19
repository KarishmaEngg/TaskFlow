import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import API from "../services/api";
import toast from "react-hot-toast";

const columns = ["Todo", "In Progress", "Done"];

export default function KanbanBoard({ tasks, fetchTasks }) {
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    // Agar user ne board se bahar drop kiya ya same jagah drop kiya
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    try {
      // Backend par update request bhej rahe hain
      await API.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      toast.success(`Moved to ${destination.droppableId}`);
      fetchTasks();
    } catch (err) { 
      toast.error("Failed to move task");
      console.error(err);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided, snapshot) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className={`p-5 rounded-[32px] min-h-[600px] border transition-all duration-300 ${
                  snapshot.isDraggingOver 
                  ? "bg-indigo-50/30 border-indigo-300 dark:bg-indigo-500/5 shadow-2xl shadow-indigo-500/10" 
                  : "bg-slate-100/50 dark:bg-[#161b2c] border-slate-200/60 dark:border-gray-800/50"
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-8 px-2">
                  <h2 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      col === 'Todo' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
                      col === 'In Progress' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 
                      'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    }`}></span>
                    {col}
                  </h2>
                  <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-xl text-xs font-bold text-slate-500 border border-slate-100 dark:border-slate-700">
                    {tasks.filter(t => t.status === col).length}
                  </span>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                  {tasks
                    .filter((task) => task.status === col)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1
                            }}
                          >
                            <TaskCard task={task} fetchTasks={fetchTasks} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}