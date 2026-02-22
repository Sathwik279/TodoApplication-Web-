
export default async function loginUser(data){
    const response = await fetch("http://localhost:8080/auth/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    });

    if(!response.ok){
        throw new Error("Registration Failed")
    }

    return response.json();
}