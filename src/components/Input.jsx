import createTodo from '../services/createTodo'
import { useAuth } from '../context/AuthContext'

export default function Input({fetchTodos}){
    const {token} = useAuth();

    const handleSubmit = async(e)=>{
            e.preventDefault();
    
            const data = {
                title: e.target.title.value,
                description: e.target.description.value,
            }
    
            try{
                const response = await createTodo(data,token);
                console.log(response)
                alert("Created Successfully");
                fetchTodos();

            }catch(error){
                alert(error.message)
            }
         }
    return (
        <form onSubmit={handleSubmit}>
            <div className='nearAdjust'>
                <div>
                <div className='nearAdjust'>
                <label htmlFor='title'>Enter Title:</label>
                <input id='title' name='title'></input>
                </div>
            <br></br>
                <div className='nearAdjust'>
                <label htmlFor='description'>Enter Description:</label>
                <input id='description' name='description'></input>
                </div>
            <br></br>
            </div>
            <div>
                <button>Submit</button>
            </div>
            </div>
            
        </form>
    )
}