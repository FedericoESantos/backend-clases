Swal.fire({
    title:"Identifiquese",
    input:"text",
    text:"Ingrese su nickname",
    inputValidator: (value) =>{
        return !value && "Debe ingresar un nombre ...!!! :S"
    },
    allowOutsideClick: false
}).then(datos =>{
    const socket = io();

    let nombre = datos.value;
    document.title = nombre;

    let inputMensaje = document.getElementById("mensaje");
    let divMensajes = document.getElementById("mensajes");

    inputMensaje.focus();
      
    socket.emit("id", nombre);

    socket.on("nuevoUsuario", nombre=>{
        Swal.fire({
            text: `${nombre} se ha conectado`,
            toast: true,
            position:"top-right"
        });
    })

    socket.on("mensajesPrevios", mensajes=>{
        mensajes.forEach( mensaje => {
            divMensajes.innerHTML += `<span> <strong>${mensaje.nombre}</strong> dice: <i>${mensaje.mensaje}</i> </span> <br>`;
            divMensajes.scrollTop = divMensajes.scrollHeight; 
        });
    })

    socket.on("saleUsuario", nombre=>{
        divMensajes.innerHTML += `<span> <strong>${nombre}</strong> ha salido del chat... :( </span> <br>`;
    });

    inputMensaje.addEventListener("keyup", evento =>{
        evento.preventDefault();
        
        if(evento.code === "Enter" && evento.target.value.trim().length>0){
            socket.emit("mensaje", nombre, evento.target.value.trim());
            evento.target.value = "";
            evento.target.focus();
        }
        
    })

    socket.on("nuevoMensaje", (nombre,mensaje)=>{
        divMensajes.innerHTML += `<span> <strong>${nombre}</strong> dice: <i>${mensaje}</i> </span> <br>`;
        divMensajes.scrollTop = divMensajes.scrollHeight;
    });
 


});



