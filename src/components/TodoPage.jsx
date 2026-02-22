import { useAuth } from '../context/AuthContext'
import Input from './Input'
import { useState } from 'react';
import { useEffect } from 'react';
import Todo from './Todo'

export default function TodoPage(){
    let [todos,setTodos] = useState([]);
    const {token} = useAuth();

    const fetchTodos = async () => {
        
        const response = await fetch("http://localhost:8080/crud/todos", {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });

        if(response.ok){
            const data = await response.json();
            console.log(data)
            setTodos(data)
        }
    };


    useEffect(() => {
        if (token)  
        {
            fetchTodos();
        }

    }, [token]);

    return (
        <div>
        <Input fetchTodos={fetchTodos}/>
        <br></br>
        <div className='todos'>
            {
                // this is a pure function of the todos variable
                todos.map(
                    (todo)=>(
                        <Todo todo={todo} key ={todo.id} id={todo.id} title = {todo.title} description = {todo.description} fetchTodos={fetchTodos}/>
                    )
                )
            }
            </div>
        </div>
    )
}