const registro = async(evento)=>{
    evento.preventDefault();
    let [name, last_name, email, password] =  new FormData(document.getElementById("registro")).values();
    let body = {
        name, last_name, email, password
    }
    let respuesta = await fetch("/api/sessions/registro",{
        method: "post",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    })

    let datos = await respuesta.json();
    
    if(respuesta.ok){
        window.location.href = "/registro?exito=Resgistro exitoso!!! Ahora Logueate :D"
    }else{
        window.location.href = "/registro?error=Error al validar datos o faltante de ellos"
    }
}