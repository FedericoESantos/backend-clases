const comprar = async (pid) => {
    let inputCarrito = document.getElementById("IDcarrito");
    let cid = inputCarrito.value;
    
    try {
        let respuesta = await fetch(`/api/carts/${cid}/product/${pid}`,{ method:"post" });
        if(respuesta.status == 400){
            let datos = await respuesta.json();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: datos.error,
            });
        }
        if(respuesta.status === 200){
            let datos = await respuesta.json();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `Producto Agregado al carrito`,
                text: `Producto ${pid} agregado al carrito ${cid}`,
                showConfirmButton: false,
                timer: 3000
            });
            
            }else{
                let datos = await respuesta.json();
                alert(datos.error);
            }
    } catch(error){ error.menssage }
}