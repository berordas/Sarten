const productos = [
    { nombre: "Sartén de Hierro Fundido", imagen: "data/sarten1.jpg", enlace: "auction1.html" },
    { nombre: "Sartén Antiadherente Premium", imagen: "data/sarten1.jpg", enlace: "auction2.html" },
    { nombre: "Sartén de Cobre Profesional", imagen: "data/sarten1.jpg", enlace: "auction3.html" }
];

function buscarProducto() {
    const input = document.getElementById("buscarInput").value.toLowerCase();
    const resultados = document.getElementById("resultados");
    resultados.innerHTML = "";

    const productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(input)
    );

    productosFiltrados.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <section class="producto-content">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <a href="${producto.enlace}" class="cta-button-bid">Ver Subasta</a>
            </section>
        `;

        resultados.appendChild(div);
    });
}
