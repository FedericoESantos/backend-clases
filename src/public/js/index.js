const socket = io; // aca conecto el serversocket


socket.on("productos", productos =>{ // aca recibe la peticion del cliente desde app.js
    const tbody = document.getElementById("productos-tbody"); // llamo al tbody desde su id en realTime...handlebars
    const prod = productos.productos;

    tbody.innerHTML = `
        <td>${prod.title}</td>
        <td>${prod.description}</td>
        <td>${prod.code}</td>
        <td>${prod.price}</td>
        <td>${prod.stock}</td>
        <td>${prod.category}/td>
    `;
}); 

//aca configuro el formulario de INICIO

const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function (e){ 
    e.preventDefault(); // con esto se posiciona en el primer item
    // Para obtener los valores del formulario:
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;

    // luego me creo un objeto con todas esas variables
    // Envia el nuevo producto al sevidor a traves de socket
    const producto = {
        title: title,
        description: description,
        code: code,
        price: price,
        stock: stock,
        category: category
    }

    // y ahora voy a enviar una peticion al backend (app.js)
    socket.emit("agregarProducto", producto);
    formulario.requestFullscreen(); // con esto reseteo el formulario
})
