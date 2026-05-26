document.addEventListener("DOMContentLoaded", () => {
    
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginForm.addEventListener("submit", async (evento) => {
        
        evento.preventDefault(); 

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (emailValue === "" || passwordValue === "") {
            alert("Por favor, completa todos los campos antes de continuar.");
            return; 
        }

        try {
            let credenciales = [];
            
            // 1. Verificamos si ya existe una base de datos simulada en la memoria (con posibles contraseñas cambiadas)
            const dbMemoria = localStorage.getItem("db_credenciales");

            if (dbMemoria) {
                // Si existe, usamos esa porque tiene los datos más recientes
                credenciales = JSON.parse(dbMemoria);
            } else {
                // 2. Si no existe en memoria, leemos el archivo original de tu carpeta
                const respuesta = await fetch("../../data/credenciales.json");
                
                if (!respuesta.ok) {
                    throw new Error("No se pudo cargar el archivo JSON.");
                }
                
                credenciales = await respuesta.json();
                
                // Guardamos una copia en memoria para futuros cambios
                localStorage.setItem("db_credenciales", JSON.stringify(credenciales));
            }

            // 3. Validamos al usuario contra la base de datos que acabamos de cargar
            const usuarioValido = credenciales.find(user => 
                (user.correo === emailValue || user.telefono === emailValue) && 
                user.password === passwordValue
            );

            if (usuarioValido) {
                // Guardamos quién inició sesión
                localStorage.setItem("idUsuarioActivo", usuarioValido.id_usuario);
                
                // Redirigimos al dashboard
                window.location.href = "../../index.html"; 
                
            } else {
                alert("Correo o contraseña incorrectos. Inténtalo de nuevo.");
                passwordInput.value = ""; 
            }

        } catch (error) {
            console.error("Error al intentar iniciar sesión:", error);
            alert("Hubo un problema al conectar con la base de datos.");
        }
    });
});