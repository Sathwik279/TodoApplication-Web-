
export default async function deleteTodo(token,id){
    const response = await fetch(`http://localhost:8080/crud/todo/${id}`,{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        },
    });

    if(!response.ok){
        throw new Error("Deletion Failed")
    }

    return response.json();
}