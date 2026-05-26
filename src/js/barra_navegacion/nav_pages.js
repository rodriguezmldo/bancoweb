// ============================================
// MENÚ DESPLEGABLE PARA NAV PAGES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Crear estructura para submenús
    const menuItems = [
        {
            id: 'operaciones',
            texto: 'Operaciones',
            submenu: [
                { nombre: 'Depósito', url: '/src/pages/operaciones/depositar.html' },
                { nombre: 'Transferencia', url: '/src/pages/operaciones/transferir.html' },
                { nombre: 'Retiro', url: '/src/pages/operaciones/retirar.html' },
                { nombre: 'Pago de Servicios', url: '/src/pages/servicios/pago_servicios.html' }
            ]
        },
        {
            id: 'tarjetas',
            texto: 'Tarjetas',
            submenu: [
                { nombre: 'Tarjeta de Débito', url: '/src/pages/tarjetas/tarjeta_debito.html' },
                { nombre: 'Tarjeta Virtual', url: '/src/pages/tarjetas/tarjeta_virtual.html' },
                { nombre: 'Tarjeta de Crédito', url: '/src/pages/tarjetas/tarjeta_credito.html' }
            ]
        },
        {
            id: 'cuenta',
            texto: 'Cuenta',
            submenu: [
                { nombre: 'Más detalles', url: '/src/pages/cuenta/cuenta.html' },
                { nombre: 'Estado de Cuenta', url: '/src/pages/estado_cuenta/estado_cuenta.html' },
                { nombre: 'Cerrar sesión', url: '/src/pages/login/login.html',
                    esCerrarSesion: true  
                }
            ]
        },
        {
            id: 'mas',
            texto: 'Más',
            submenu: [
                { nombre: 'Quiénes somos', url: 'info/quienes_somos.html' },
                { nombre: 'Soporte', url: 'info/soporte.html' },
                { nombre: 'Términos y condiciones', url: 'info/terminos.html' }
            ]
        }
    ];

    // Obtener el ul de la navegación
    const navUl = document.querySelector('.nav_pages ul');
    if (!navUl) return;

    // Convertir los li existentes en elementos con submenú
    const lis = navUl.querySelectorAll('li');

    menuItems.forEach((item, index) => {

        // Saltar el primer li (Inicio)
        const li = lis[index + 1];

        if (li) {

            // Agregar clase para identificar
            li.classList.add('menu-item');
            li.setAttribute('data-menu', item.id);

            // Crear submenú
            const submenuDiv = document.createElement('div');
            submenuDiv.className = 'submenu';

            submenuDiv.innerHTML = `
                <ul>
                    ${item.submenu.map(sub => `
                        <li>
                            <a href="${sub.url}" ${sub.esCerrarSesion ? 'class="cerrar-sesion-btn"' : ''}>
                                ${sub.nombre}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            `;

            li.appendChild(submenuDiv);
        }
    });
    
    // ============================================
    // FUNCIONALIDAD DE CERRAR SESIÓN
    // ============================================
    
    // Función para cerrar sesión
    function cerrarSesion() {
        // Mostrar confirmación opcional
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            // Limpiar todo el localStorage
            localStorage.clear();
            
            // Opcional: limpiar sessionStorage también
            sessionStorage.clear();
            
            console.log('Sesión cerrada - LocalStorage limpiado');
            
            // Redirigir a la página de inicio de sesión
            // CAMBIA ESTA URL POR LA DE TU PÁGINA DE LOGIN
            window.location.href = '/src/pages/login/login.html'; 
            
        }
    }
    
    // Agregar event listeners a los botones de cerrar sesión
    function agregarEventoCerrarSesion() {
        const botonesCerrar = document.querySelectorAll('.cerrar-sesion-btn');
        botonesCerrar.forEach(boton => {
            boton.addEventListener('click', function(e) {
                e.preventDefault(); 
                cerrarSesion();
            });
        });
    }
    
    // Inicializar eventos después de crear los elementos
    setTimeout(agregarEventoCerrarSesion, 100);
    
    // También podemos usar MutationObserver para asegurar que los eventos se apliquen
    const observer = new MutationObserver(function(mutations) {
        agregarEventoCerrarSesion();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    const styles = `
        /* Estilos para el menú con submenú */
        .nav_pages li.menu-item {
            position: relative;
        }
        
        .nav_pages .submenu {
            position: absolute;
            top: 100%;
            left: 0;
            background-color: #2f2f33;
            min-width: 2.5em;
            border-radius: 12px;
            padding: 8px 0;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 1000;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            margin-top: 5px;
        }
        
        .nav_pages li.menu-item:hover .submenu {
            opacity: 1;
            visibility: visible;
            margin-top: 0;
        }
        
        .nav_pages .submenu ul {
            display: flex;
            flex-direction: column;
            gap: 0;
            width: 100%;
        }
        
        .nav_pages .submenu li {
            width: 100%;
        }
        
        .nav_pages .submenu a {
            display: block;
            padding: 10px 16px;
            font-size: 0.85rem;
            color: #cccccc;
            background: transparent;
            border-radius: 0;
            white-space: nowrap;
            text-decoration: none;
        }
        
        .nav_pages .submenu a:hover {
            background-color: #4a4a4e;
            color: white;
        }
        
        /* Estilo especial para el botón de cerrar sesión */
        .nav_pages .submenu .cerrar-sesion-btn {
            color: #ff6b6b;
            border-top: 1px solid #4a4a4e;
            margin-top: 4px;
        }
        
        .nav_pages .submenu .cerrar-sesion-btn:hover {
            background-color: #ff6b6b;
            color: white;
        }
        
        .nav_pages .submenu li:first-child a {
            border-radius: 12px 12px 0 0;
        }
        
        .nav_pages .submenu li:last-child a {
            border-radius: 0 0 12px 12px;
        }
        
        /* Flecha indicadora */
        .menu-item > a::after {
            content: ' ▼';
            font-size: 10px;
            opacity: 0.6;
            transition: transform 0.2s;
            display: inline-block;
        }
        
        .menu-item:hover > a::after {
            transform: rotate(180deg);
            opacity: 1;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
});