document.getElementById("registerForm").addEventListener("submit", function(event) {
    let valid = true;

    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const dni = document.getElementById("dni");
    const correo = document.getElementById("correo");

    function validateField(field, errorId, message) {
        const errorMessage = document.getElementById(errorId);
        if (!field.value.trim()) {
            errorMessage.textContent = message;
            errorMessage.style.color = "red";
            valid = false;
        } else {
            errorMessage.textContent = "";
        }
    }

    validateField(nombre, "error-nombre", "Campo obligatorio vacío");
    validateField(apellidos, "error-apellidos", "Campo obligatorio vacío");
    validateField(dni, "error-dni", "Campo obligatorio vacío");
    validateField(correo, "error-correo", "Campo obligatorio vacío");

    const correoPattern = /^[a-zA-Z0-9._%+-]+@comillas\.edu$/;
    if (correo.value.trim() && !correoPattern.test(correo.value)) {
        document.getElementById("error-correo").textContent = "El correo debe ser usuario@comillas.edu";
        document.getElementById("error-correo").style.color = "red";
        valid = false;
    }

    if (!valid) {
        event.preventDefault();
    }
});

function cargarCiudades() {
    const comunidades = {
        "Madrid": ["Madrid"],
        "Cataluña": ["Barcelona", "Girona", "Tarragona", "Lleida"],
        "Andalucía": ["Sevilla", "Málaga", "Granada", "Córdoba"],
        "Valencia": ["Valencia", "Alicante", "Castellón"],
        "Galicia": ["A Coruña", "Vigo", "Lugo", "Pontevedra", "Santiago de Compostela"],
        "País Vasco": ["Bilbao", "San Sebastián", "Vitoria"],
        "Castilla y León": ["Valladolid", "León", "Salamanca"],
        "Castilla-La Mancha": ["Toledo", "Albacete", "Ciudad Real"],
        "Canarias": ["Las Palmas", "Santa Cruz de Tenerife"],
        "Aragón": ["Zaragoza", "Huesca", "Teruel"],
        "Extremadura": ["Badajoz", "Cáceres"],
        "Baleares": ["Palma de Mallorca"]
    };

    const comunidadSeleccionada = document.getElementById("comunidad").value;
    const ciudadSelect = document.getElementById("ciudad");
    
    ciudadSelect.innerHTML = "<option value=''>Seleccione una ciudad</option>";
    
    if (comunidadSeleccionada && comunidades[comunidadSeleccionada]) {
        comunidades[comunidadSeleccionada].forEach(ciudad => {
            const option = document.createElement("option");
            option.value = ciudad;
            option.textContent = ciudad;
            ciudadSelect.appendChild(option);
        });
    }
}
