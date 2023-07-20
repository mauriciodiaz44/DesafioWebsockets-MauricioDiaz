const socket = io();

socket.on("saludo", (data) => {
  console.log(`su cliente ha sido conectado: ${data}`);
});

socket.on("addProduct", (data) => {
  let log = document.getElementById("log");
  log.innerHTML += `
    <ul id=${data.id}>
        <li><b>ID: </b>${data.id}</li>
        <li><b>Titulo: </b>${data.title}</li>
        <li><b>Descripcion: </b>${data.description}</li>
        <li><b>Precio: </b>${data.price}</li>
        <li><b>Categoria: </b>${data.category}</li>
        <li><b>Stock: </b>${data.stock}</li>
    </ul>
    `;
});

socket.on("removeProduct", (data) => {
  document.getElementById(data).remove();
});
