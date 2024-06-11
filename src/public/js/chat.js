// aca vamos a crear el script que enlazamos desde el chat.hanglebars
//ACA COMIENZA EL FRONTED
Swal.fire({ // esta libreria devuelve una promesa
    title:"Identifíquese",
    input:"text",
    text:"Ingrese su email",
    inputValidator:(value) =>{
        return !value && "Debe ingresar un nombre !!!"
    },
    allowOutsideClick: false
}).then(datos=>{ //quiero pedirle los datos de esta promesa 
    let nombre = datos.value; // de esta manera captura el nombre que ingresen por pantalla
    document.title = nombre; //una vez capturado el nombre le ponemos ese nombra al navegador
    // aca comienza la comunicacion con el backend

    let inputMensaje = document.getElementById("mensaje"); // aca atrapamos en un let el input del chat.handlebars
    let divMensajes = document.getElementById("mensajes"); // aca atrapamos en un let el div del chat.handlebars
    inputMensaje.focus(); // con esto queda parado sobre el input cuando se ejecute la pagina

// ESTABLECEMOS LA CONEXION CON SOCKET

    const socket= io(); 

    socket.emit("id", nombre);  // aca le envio al backend el nombre

    socket.on("nuevoUsuario", nombre=>{ // aca recibo un nuevo usuario y le pido un nombre 
        Swal.fire({ // y otra ventana emergente diciendo quien se conecto
            text: `${nombre} se ha conectado !!!`,
            toast:true,
            position:"top-right"
        })
    })

    socket.on("mensajesPrevios", mensajes=>{
        mensajes.forEach(mens => {
            divMensajes.innerHTML+= `<span class="mensaje"><strong>${mens.nombre}</strong> dice: <i>${mens.mensaje}</i></span><br>`;
            divMensajes.scrollTop = divMensajes.scrollHeight; // eso sirve para que si son muchos mensajes no se pierdan cuando se baje de scroll
        });
    })

    socket.on("saleUsuario", nombre=>{
        console.log(nombre)
        divMensajes.innerHTML+= `<span class="mensaje"><strong>${nombre}</strong> ha salido del chat... :(</span><br>`;
    })

    inputMensaje.addEventListener("keyup", event=>{
        event.preventDefault(); // lo primero es que si hay alguna accion asociada a keyup no se ejecute
        //console.log(event, event.target.value)
        if(event.code==='Enter' && event.target.value.trim().length > 0){ 
        //si presionamos la tecla enter y lo que escriba sin espacios atras o adelante sea mayor que 0 ...
            // trim le corta los espacios a lo que esta escrito adelante y atras
            socket.emit("mensaje", nombre, event.target.value.trim()); 
            // voy a enviar un mensaje con su nombre y lo que se escriba (event.target....)
            event.target.value = " "; // lo voy a borrar, para no tener que borrarlo a mano
            event.target.focus(); // y voy a querer que se pare otra vez en la ventana del input
        }  
    })

    socket.on("nuevoMensaje", (nombre, mensaje)=>{ // aca va a recibir 2 cosas ... nombre y mensaje
        divMensajes.innerHTML+= `<span class="mensaje"><strong>${nombre}</strong> dice: <i>${mensaje}</i></span><br>` 
        divMensajes.scrollTop = divMensajes.scrollHeight; 
        //aca escribimos sobre el div que esta en chat.handlebars, += para que concatene
        // y concatenamos un parrafo (p) en negrita (strong) el nombre y lo que dice con letra italica (i) 
    });

    }) // fin del sweet alert


