import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import updateTodoApi from '../services/updateTodo';
import deleteTodoApi from '../services/deleteTodo';
import addTodoApi from '../services/addTodoApi';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const TodoContext = createContext();

export function TodoProvider({children}){
    const[todos,setTodos] = useState([]);
    const{ token } = useAuth();
    const { showNotification } = useNotification();

    const fetchTodos = useCallback(async ()=>{
        if(!token) return ;
        const response = await fetch('http://localhost:8080/crud/todos',{
            headers:{Authorization: `Bearer ${token}`}
        });
        if(response.ok){
            setTodos(await response.json());
        }
    },[token]);


    useEffect(() => {
        if (!token) return; 

        const connectSSE = async () => {
            try {
                await fetchEventSource('http://localhost:8080/crud/stream', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    onmessage(event) {
                        if (event.event === 'AI_UPDATE') {
                            const data = JSON.parse(event.data);
                            console.log("AI Update Received via SSE:", data);
                            
                            setTodos(prev => prev.map(t => 
                                t.id === data.todoId 
                                    ? { ...t, aiContent: data.aiContent } 
                                    : t
                            ));
                            
                            showNotification("AI Summary Ready!", "success");
                        }
                    },
                    onerror(err) {
                        console.error("SSE Connection Error. Retrying...", err);
                    }
                });
            } catch (error) {
                console.error("Failed to start SSE stream", error);
            }
        };

        connectSSE();
    }, [token]); 

    const updateTodo = async(id,updatedData)=>{
        const previousTodos = [...todos];

        setTodos(prev => prev.map(t=>t.id===id?{...t,...updatedData}:t));
        try{
            await updateTodoApi(token,id,updatedData);
        }catch(error){
            setTodos(previousTodos);
            showNotification("Sync failed reverted changes","error");
        }
    };

    const deleteTodoLocal = async(id)=>{
        const previousTodos = [...todos];
        setTodos(prev=>prev.filter(t=>t.id!==id));
        try{
            await deleteTodoApi(token,id);
            showNotification("deleted","success");
        }catch(err){
            setTodos(previousTodos)
            showNotification("delete failed",'error')
        }
    };

    const addTodoLocal = async (todoData) => {
        try {
            const newTodoFromDB = await addTodoApi(todoData, token);
            setTodos(prev => [newTodoFromDB, ...prev]); 
            
        } catch (error) {
            showNotification(error.message, "error");
        }
    };
    return (
        <TodoContext.Provider value={{ todos, setTodos, fetchTodos, updateTodo, deleteTodoLocal, addTodoLocal }}>
            {children}
        </TodoContext.Provider>
    );
}

export function useTodos(){
    return useContext(TodoContext)
}
