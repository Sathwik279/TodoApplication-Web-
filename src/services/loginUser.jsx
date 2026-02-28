
export default async function loginUser(data){
    const response = await fetch("http://localhost:8080/auth/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    });

    console.log(`response object is ${response}`)
    if(!response.ok){
        throw new Error("Registration Failed")
    }

    return response.json();
}