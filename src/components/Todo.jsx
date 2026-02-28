
import deleteTodo from "../services/deleteTodo";
import { useAuth } from '../context/AuthContext'
import { useState,useEffect } from "react";
import updateTodo from "../services/updateTodo";
import { useNotification } from "../context/NotificationContext";

export default function Todo({todo,id,title,description,summary,fetchTodos}){
    const { token } = useAuth();
    // 1. Normalize props to prevent 'null' !== '""' type mismatches
    const safeTitle = title || "";
    const safeDescription = description || "";
    const safeSummary = summary || "";
    // Ensure this defaults to a boolean
    const safeAiEnabled = Boolean(todo.aiEnabled);
    
    const [curTitle, setCurTitle] = useState(safeTitle);
    const [curDescription, setCurDescription] = useState(safeDescription);
    const [curSummary, setCurSummary] = useState(safeSummary);
    const [aiEnabled, setAiEnabled] = useState(safeAiEnabled);
    const {showNotification} = useNotification();
    
    // 2. Sync local state whenever the parent component passes new props (like after fetchTodos)
    useEffect(() => {
        setCurTitle(safeTitle);
        setCurDescription(safeDescription);
        setCurSummary(safeSummary);
        setAiEnabled(safeAiEnabled);
    }, [safeTitle, safeDescription, safeSummary, safeAiEnabled]);

    let isChanged =
        curTitle !== safeTitle ||
        curDescription !== safeDescription ||
        curSummary !== safeSummary;


    const handleUpdate = async()=>{
        try{
            const updatedData = {
            ...todo,
            title: curTitle,
            description: curDescription,
            aiContent:curSummary,
            aiEnabled: aiEnabled
            }
            await updateTodo(token,id,updatedData);
            showNotification("updatedSuccessfully","success")
            fetchTodos();
        }catch(error){
            showNotification(error.message || "Update failed", "error");
        }
    }
    const handleDelete = async()=>{        
            
            try{
                const response = await deleteTodo(token,id);
                console.log(response)
                showNotification("Deleted Successfully","success")

                fetchTodos();

            }catch(error){
            showNotification(error.message || "Delete failed", "error");
            }
        }

    return(
        
            

    <div className="todo-table">

  {/* Content Row */}
  <textarea
    rows="2"
    value={curTitle}
    onChange={(e) => setCurTitle(e.target.value)}
  />

  <textarea
    rows="2"
    value={curDescription}
    onChange={(e) => setCurDescription(e.target.value)}
  />

  <textarea
    rows="2"
    value={curSummary}
    onChange={(e) => setCurSummary(e.target.value)}
  />

  <div className="ai-toggle">
    <label className="switch">
      <input
        type="checkbox"
        checked={aiEnabled}
        onChange={(e) => setAiEnabled(e.target.checked)}
      />
      <span className="slider"></span>
    </label>
  </div>

  {isChanged ? (
    <button onClick={handleUpdate}>Save</button>
  ) : (
    <button onClick={handleDelete}>Delete</button>
  )}

</div>
    )
}

