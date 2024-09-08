let logout = async (evento) => {
    evento.preventDefault(); 
    try {
        let respuesta = await fetch("/logout", { method: "GET" });
        if (!respuesta.ok) {
            console.log('Error al intentar hacer el logout');
            return;
        }
        window.location.href = "/login"; 
    } catch (error) {
        console.error("Error al enviar la solicitud: ", error.message);
    }
};