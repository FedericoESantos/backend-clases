const socket = io();

let productosContainer = document.getElementById("productos");

socket.on("nuevoProd", producto => {
    productosContainer.innerHTML += `
        <div id="card">
            <p><strong>Nombre:</strong> ${producto.name}</p>
            <p><strong>Description:</strong> ${producto.description}</p>
            <p><strong>Stock:</strong> ${producto.stock}</p>
            <p><strong>Price:</strong> ${producto.price}</p>
            <button onclick="Comprar('${producto._id}')" id="carrito">Agregar a Carrito</button>
        </div>
    `;
});