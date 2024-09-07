let logout = async (evento) => {
    try {
        let respuesta = await fetch("/api/session/logout",
            {
                method: "GET"
            })   
            if(!respuesta.ok){
                return console.log('Error al intentar hacer el logout');
        }
        let resultado = await respuesta.json();
        if(resultado.status === "sucess"){
            windows.location.href = "/login"
        }
        
    } catch (error) {  
        console.error("Error al enviar la solicitud: ", error.message);
    }

}