const login = async(evento)=>{
    evento.preventDefault();
    let [email, password] =  new FormData(document.getElementById("registro")).values();
    let body = {
        email, password
    }
    let respuesta = await fetch("/api/sessions/login",{
        method: "post",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    })

    let datos = await respuesta.json();
    
    if(respuesta.ok){
        window.location.href = "/perfil"
    }else{
        window.location.href = "/login?error=Error al validar"
    }
}