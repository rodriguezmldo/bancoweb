document.addEventListener("DOMContentLoaded", () => {
    const contenedorCorreo = document.getElementById("contenedorCorreo");
    const contenedorPassword = document.getElementById("contenedorPassword");
    
    const formSolicitarCorreo = document.getElementById("formSolicitarCorreo");
    const formNuevaPassword = document.getElementById("formNuevaPassword");
    const emailInput = document.getElementById("email");
    const nuevaPasswordInput = document.getElementById("nuevaPassword");

    const btnCancelarCorreo = document.getElementById("btnCancelarCorreo");
    const btnCancelarPassword = document.getElementById("btnCancelarPassword");

    let idUsuarioEnProceso = null;

    async function inicializarBaseDatos() {
        if (!localStorage.getItem("db_credenciales")) {
            try {
                const respuesta = await fetch("../../data/credenciales.json");
                const credenciales = await respuesta.json();
                localStorage.setItem("db_credenciales", JSON.stringify(credenciales));
            } catch (error) {
                console.error("Error cargando el JSON inicial:", error);
            }
        }
    }
    
    inicializarBaseDatos();

    formSolicitarCorreo.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const correoIngresado = emailInput.value.trim();

        const dbLocal = JSON.parse(localStorage.getItem("db_credenciales")) || [];

        const usuarioEncontrado = dbLocal.find(user => user.correo === correoIngresado);

        if (usuarioEncontrado) {
            idUsuarioEnProceso = usuarioEncontrado.id_usuario;

            alert(`Enlace de recuperación enviado con éxito a: ${correoIngresado}`);

            setTimeout(() => {
                alert("Correo confirmado con éxito. Por favor, ingresa tu nueva contraseña.");
                
                contenedorCorreo.classList.add("oculto");
                contenedorPassword.classList.remove("oculto");
            }, 1000); // Espera 1 segundo para simular el proceso

        } else {
            alert("El correo ingresado no se encuentra registrado en nuestro sistema.");
        }
    });

    formNuevaPassword.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const nuevaContrasena = nuevaPasswordInput.value.trim();

        if (idUsuarioEnProceso !== null) {
            let dbLocal = JSON.parse(localStorage.getItem("db_credenciales"));

            const indexUsuario = dbLocal.findIndex(user => user.id_usuario === idUsuarioEnProceso);
            
            if (indexUsuario !== -1) {
                dbLocal[indexUsuario].password = nuevaContrasena;
                
                localStorage.setItem("db_credenciales", JSON.stringify(dbLocal));

                alert("Su contraseña ha sido restablecida con éxito. Ya puede iniciar sesión.");
                
                // Redirigir al inicio de sesión
                window.location.href = "login.html"; // Ajusta la ruta a tu archivo de login
            }
        }
    });

    // --- BOTONES DE CANCELAR ---
    btnCancelarCorreo.addEventListener("click", () => {
        window.location.href = "login.html"; // Ajusta la ruta a tu archivo de login
    });

    btnCancelarPassword.addEventListener("click", () => {
        // Reiniciar el proceso
        contenedorPassword.classList.add("oculto");
        contenedorCorreo.classList.remove("oculto");
        emailInput.value = "";
        nuevaPasswordInput.value = "";
        idUsuarioEnProceso = null;
    });
});