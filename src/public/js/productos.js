const comprar = async (pid)=>{
    console.log(`codigo producto: ${pid}`);
    let inputCarrito = document.getElementById("carrito");
    let cid = inputCarrito.value;   
    console.log(`Codigo producto: ${pid}, Codigo Carrito: ${cid}`)

let respuesta = await fetch(`/api/carts/${cid}/product/${pid}`,{
    method:"post"
    // como segundo argumento del fetch le configuro el metodo post
});
// aca englobamos la respuesta dentro de la ruta del id de carritos
// con el id de productos

if(respuesta.status === 200){ // si el estado de la respuesta es igual a 200
    let datos = await respuesta.json();
    console.log(datos);
}
}