
export default async function registerUser(data,token){
    const response = await fetch("http://localhost:8080/crud/todo",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if(!response.ok){
        throw new Error("Registration Failed")
    }

    return response.json();
}