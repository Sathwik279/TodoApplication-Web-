
import deleteTodo from "../services/deleteTodo";
import { useAuth } from '../context/AuthContext'
import { useState } from "react";
import updateTodo from "../services/updateTodo";

export default function Todo({todo,id,title,description,fetchTodos}){
    const {token} = useAuth();
    const [curTitle,setCurTitle] = useState(title);
    const [curDescription,setCurDescription] = useState(description)

    let isChanged = curTitle !== title || curDescription!==description
    
    const handleUpdate = async()=>{
        try{
            const updatedData = {
            ...todo,
            title: curTitle,
            description: curDescription,
            }
            await updateTodo(token,id,updatedData);
            alert("Updated Successfully");
            fetchTodos();
        }catch(error){
            alert(error.message)
        }
    }
    const handleDelete = async()=>{        
            
            try{
                const response = await deleteTodo(token,id);
                console.log(response)
                alert("Deleted Successfully");
                fetchTodos();

            }catch(error){
                alert(error.message)
            }
        }

    return(
        <div className='nearAdjust'>
        <textarea rows='2' resize='vertical' value={curTitle} onChange={(e)=>setCurTitle(e.target.value)}/>
        <textarea rows='2' resize='vertical' value={curDescription} onChange={(e)=>setCurDescription(e.target.value)}/>
        {isChanged?(
            <button onClick={handleUpdate}>
                Save
            </button>
        ):(
        <button onClick={handleDelete}>Delete</button>
        )}
        </div>
    )
}

