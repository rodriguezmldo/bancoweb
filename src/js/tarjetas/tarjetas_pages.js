// Función para formatear números como moneda
function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
}

// Función para obtener el tipo de página actual
function obtenerTipoPagina() {
    const path = window.location.pathname;
    if (path.includes('tarjeta_credito')) return 'credito';
    if (path.includes('tarjeta_virtual')) return 'virtual';
    if (path.includes('tarjeta_debito')) return 'debito';
    return null;
}

// Función principal para cargar los datos de la tarjeta
function cargarDatosTarjeta() {
    const tipoPagina = obtenerTipoPagina();
    if (!tipoPagina) return;

    const datos = datosTarjetas[tipoPagina];
    if (!datos) return;

    // Actualizar tipo de tarjeta en el encabezado
    const tipoTarjetaSpan = document.querySelector('.tarjeta_encabezado .tipo_tarjeta');
    if (tipoTarjetaSpan) {
        if (tipoPagina === 'credito') {
            tipoTarjetaSpan.innerHTML = '💳 Tarjeta Crédito';
        } else if (tipoPagina === 'debito') {
            tipoTarjetaSpan.innerHTML = '💳 Tarjeta Débito';
        } else if (tipoPagina === 'virtual') {
            tipoTarjetaSpan.innerHTML = '💳 Tarjeta Virtual';
        }
    }

    // Actualizar titular
    const titularSpan = document.querySelector('.tarjeta_titular span');
    if (titularSpan) titularSpan.textContent = datos.titular;

    // Actualizar número de tarjeta (los 4 bloques)
    const numeroSpans = document.querySelectorAll('.tarjeta_numero .numero_unico span');
    if (numeroSpans.length === 4 && datos.numero) {
        const partes = datos.numero.split(' ');
        partes.forEach((parte, index) => {
            if (numeroSpans[index]) numeroSpans[index].textContent = parte;
        });
    }

    // Actualizar fecha de validez
    const fechaSpan = document.querySelector('.tarjeta_fecha span');
    if (fechaSpan) fechaSpan.textContent = datos.fechaValidez;

    // Actualizar número de tarjeta en detalles
    const numeroDetalleSpan = document.querySelector('.dato_tarjeta:first-child .dato_valor span');
    if (numeroDetalleSpan) numeroDetalleSpan.textContent = datos.numero;

    // Actualizar botón de copiar con el número compacto
    const btnCopy = document.querySelector('.btn_copy');
    if (btnCopy && datos.numeroCompacto) {
        btnCopy.setAttribute('data-copy', datos.numeroCompacto);
    }

    // Datos específicos por tipo de tarjeta
    if (tipoPagina === 'debito') {
        // CLABE
        const clabeSpan = document.querySelector('.dato_tarjeta:nth-child(2) .dato_valor span');
        if (clabeSpan && datos.clabe) clabeSpan.textContent = datos.clabe;

        // Actualizar el botón de copiar CLABE
        const btnCopyClabe = document.querySelectorAll('.btn_copy')[1];
        if (btnCopyClabe && datos.clabe) {
            const clabeCompacta = datos.clabe.replace(/\s/g, '');
            btnCopyClabe.setAttribute('data-copy', clabeCompacta);
        }

        // Saldo
        const saldoStrong = document.querySelector('.dato_tarjeta:nth-child(3) .dato_valor strong');
        if (saldoStrong) saldoStrong.textContent = formatearMoneda(datos.saldo);

        // Límites - CORREGIDO: retiro en lugar de retivo
        const limiteRetiro = document.querySelector('.limites_valores span:first-child strong');
        const limiteCompras = document.querySelector('.limites_valores span:last-child strong');
        if (limiteRetiro) limiteRetiro.textContent = formatearMoneda(datos.limites.retiro);
        if (limiteCompras) limiteCompras.textContent = formatearMoneda(datos.limites.compras);
    }

    if (tipoPagina === 'virtual') {
        // Saldo
        const saldoStrong = document.querySelector('.dato_tarjeta:nth-child(2) .dato_valor strong');
        if (saldoStrong) saldoStrong.textContent = formatearMoneda(datos.saldo);

        // Límites - CORREGIDO: retiro en lugar de retivo
        const limiteRetiro = document.querySelector('.limites_valores span:first-child strong');
        const limiteCompras = document.querySelector('.limites_valores span:last-child strong');
        if (limiteRetiro) limiteRetiro.textContent = formatearMoneda(datos.limites.retiro);
        if (limiteCompras) limiteCompras.textContent = formatearMoneda(datos.limites.compras);
    }

    if (tipoPagina === 'credito') {
        // Límite de crédito
        const limiteSpan = document.querySelector('.dato_tarjeta:nth-child(2) .dato_valor strong');
        if (limiteSpan) limiteSpan.textContent = formatearMoneda(datos.limiteCredito);

        // Saldo actual
        const saldoActualSpan = document.querySelector('.dato_tarjeta:nth-child(3) .saldo_deuda');
        if (saldoActualSpan) saldoActualSpan.textContent = formatearMoneda(datos.saldoActual);

        // Saldo disponible
        const saldoDisponibleSpan = document.querySelector('.dato_tarjeta:nth-child(4) .dato_valor strong');
        if (saldoDisponibleSpan) {
            const disponible = datos.limiteCredito - datos.saldoActual;
            saldoDisponibleSpan.textContent = formatearMoneda(disponible);
        }

        // Próximo pago
        const pagoMinimoSpan = document.querySelector('.dato_tarjeta:nth-child(5) .limites_valores span:first-child strong');
        const pagoTotalSpan = document.querySelector('.dato_tarjeta:nth-child(5) .limites_valores span:last-child strong');
        if (pagoMinimoSpan) pagoMinimoSpan.textContent = formatearMoneda(datos.pagoMinimo);
        if (pagoTotalSpan) pagoTotalSpan.textContent = formatearMoneda(datos.saldoActual);

        // Fechas importantes
        const fechaCorteSpan = document.querySelector('.dato_tarjeta:nth-child(6) .limites_valores span:first-child strong');
        const fechaPagoSpan = document.querySelector('.dato_tarjeta:nth-child(6) .limites_valores span:last-child strong');
        if (fechaCorteSpan) fechaCorteSpan.textContent = datos.fechaCorte;
        if (fechaPagoSpan) fechaPagoSpan.textContent = datos.fechaPago;

        // Tasa de interés
        const tasaSpan = document.querySelector('.dato_tarjeta:nth-child(7) .dato_valor strong');
        if (tasaSpan) tasaSpan.textContent = `${datos.tasaInteres}%`;

        // Límites de tarjeta de crédito
        const limiteRetiroSpan = document.querySelector('.dato_tarjeta:nth-child(8) .limites_valores span:first-child strong');
        const limiteComprasIntlSpan = document.querySelector('.dato_tarjeta:nth-child(8) .limites_valores span:last-child strong');
        if (limiteRetiroSpan) limiteRetiroSpan.textContent = formatearMoneda(datos.limites.retiroEfectivo);
        if (limiteComprasIntlSpan) limiteComprasIntlSpan.textContent = formatearMoneda(datos.limites.comprasInternacionales);
    }

    // Guardar PIN en data attribute para uso posterior
    document.body.setAttribute('data-pin-tarjeta', datos.pin);
}

// Función para manejar el CVV
function initCVV() {
    const tipoPagina = obtenerTipoPagina();
    const datos = datosTarjetas[tipoPagina];
    if (!datos) return;

    const btnVerCVV = document.querySelector('.btn_ver_cvv');
    const cvvSpan = document.querySelector('.tarjeta_cvv span');

    if (btnVerCVV && cvvSpan) {
        btnVerCVV.addEventListener('click', () => {
            if (cvvSpan.textContent === '***') {
                cvvSpan.textContent = datos.cvv;
                const eyeImg = btnVerCVV.querySelector('img');
                if (eyeImg) eyeImg.src = 'https://cdn-icons-png.flaticon.com/128/2767/2767147.png';
            } else {
                cvvSpan.textContent = '***';
                const eyeImg = btnVerCVV.querySelector('img');
                if (eyeImg) eyeImg.src = 'https://cdn-icons-png.flaticon.com/128/2767/2767146.png';
            }
        });
    }
}

// Función para manejar el toggle de saldo/límite
function initToggleSaldo() {
    const toggleBtn = document.getElementById('toggleLimite') || document.getElementById('toggleSaldo');
    if (!toggleBtn) return;

    const tipoPagina = obtenerTipoPagina();
    const datos = datosTarjetas[tipoPagina];
    if (!datos) return;

    let valorOriginal = '';
    let oculto = false;

    if (tipoPagina === 'credito') {
        const limiteSpan = document.querySelector('.dato_tarjeta:nth-child(2) .dato_valor strong');
        if (limiteSpan) valorOriginal = limiteSpan.textContent;
    } else {
        const saldoStrong = document.querySelector('.dato_tarjeta:nth-child(2) .dato_valor strong, .dato_tarjeta:nth-child(3) .dato_valor strong');
        if (saldoStrong) valorOriginal = saldoStrong.textContent;
    }

    toggleBtn.addEventListener('click', () => {
        if (tipoPagina === 'credito') {
            const limiteSpan = document.querySelector('.dato_tarjeta:nth-child(2) .dato_valor strong');
            if (limiteSpan) {
                if (!oculto) {
                    limiteSpan.textContent = '•••••••';
                    oculto = true;
                } else {
                    limiteSpan.textContent = valorOriginal;
                    oculto = false;
                }
            }
        } else {
            const saldoStrong = document.querySelector('.dato_tarjeta:nth-child(2) .dato_valor strong, .dato_tarjeta:nth-child(3) .dato_valor strong');
            if (saldoStrong) {
                if (!oculto) {
                    saldoStrong.textContent = '•••••••';
                    oculto = true;
                } else {
                    saldoStrong.textContent = valorOriginal;
                    oculto = false;
                }
            }
        }
    });
}

// Función para manejar el cambio de estado (Activo/Inactivo)
function initCambiarEstado() {
    const btnEstado = document.getElementById('btnCambiarEstado');
    if (!btnEstado) return;

    const estadoActivo = document.querySelector('.estado.activo');
    const estadoInactivo = document.querySelector('.estado.inactivo');

    btnEstado.addEventListener('click', () => {
        if (estadoActivo && estadoInactivo) {
            if (estadoActivo.style.display !== 'none') {
                estadoActivo.style.display = 'none';
                estadoInactivo.style.display = 'inline';
                btnEstado.textContent = 'Encender';
                btnEstado.style.background = '#28a745';
            } else {
                estadoActivo.style.display = 'inline';
                estadoInactivo.style.display = 'none';
                btnEstado.textContent = 'Apagar';
                btnEstado.style.background = '#dc3545';
            }
        }
    });
}

// Función para manejar el PIN (mejorada)
function initPIN() {
    const btnConsultar = document.getElementById('btnConsultarPin');
    const btnGestionar = document.getElementById('btnGestionarPin');
    const panelPin = document.getElementById('panelPin');
    const tipoPagina = obtenerTipoPagina();
    const datos = datosTarjetas[tipoPagina];

    if (!datos) return;

    // Ocultar panel por defecto
    if (panelPin) {
        panelPin.style.display = 'none';
    }

    // Consultar PIN - solo muestra el PIN actual sin opción de cambio
    if (btnConsultar) {
        btnConsultar.addEventListener('click', () => {
            if (panelPin) {
                // Mostrar solo la sección de PIN actual
                const pinActualDiv = document.querySelector('.pin_actual');
                const pinCambioDiv = document.querySelector('.pin_cambio');
                
                if (pinActualDiv) pinActualDiv.style.display = 'flex';
                if (pinCambioDiv) pinCambioDiv.style.display = 'none';
                
                panelPin.style.display = 'block';
            }
        });
    }

    // Gestionar PIN - muestra tanto el PIN actual como la opción de cambiarlo
    if (btnGestionar) {
        btnGestionar.addEventListener('click', () => {
            if (panelPin) {
                // Mostrar ambas secciones
                const pinActualDiv = document.querySelector('.pin_actual');
                const pinCambioDiv = document.querySelector('.pin_cambio');
                
                if (pinActualDiv) pinActualDiv.style.display = 'flex';
                if (pinCambioDiv) pinCambioDiv.style.display = 'flex';
                
                panelPin.style.display = 'block';
            }
        });
    }

    // Ver PIN
    const btnVerPin = document.querySelector('.btn_ver_pin');
    const pinSpan = document.querySelector('.pin_actual span');

    if (btnVerPin && pinSpan) {
        btnVerPin.addEventListener('click', () => {
            if (pinSpan.textContent === '****') {
                pinSpan.textContent = datos.pin;
                btnVerPin.textContent = '🙈';
            } else {
                pinSpan.textContent = '****';
                btnVerPin.textContent = '👁️';
            }
        });
    }

    // Cambiar PIN
    const btnCambiarPin = document.getElementById('btnCambiarPin');
    const nuevoPinInput = document.getElementById('nuevoPin');

    if (btnCambiarPin && nuevoPinInput) {
        btnCambiarPin.addEventListener('click', () => {
            const nuevoPin = nuevoPinInput.value.trim();
            if (nuevoPin.length === 4 && /^\d+$/.test(nuevoPin)) {
                datos.pin = nuevoPin;
                document.body.setAttribute('data-pin-tarjeta', nuevoPin);
                alert(`PIN cambiado exitosamente a: ${nuevoPin}`);
                nuevoPinInput.value = '';
                // Resetear la visualización del PIN si estaba visible
                if (pinSpan && pinSpan.textContent !== '****') {
                    pinSpan.textContent = '****';
                    if (btnVerPin) btnVerPin.textContent = '👁️';
                }
            } else {
                alert('Por favor ingresa un PIN de 4 dígitos numéricos');
            }
        });
    }
}

// Función para copiar texto (mejorada)
function copiarTexto(texto, elemento) {
    navigator.clipboard.writeText(texto).then(() => {
        const originalHTML = elemento.innerHTML;
        elemento.innerHTML = '<span>✓ Copiado!</span>';
        setTimeout(() => {
            elemento.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
        alert('No se pudo copiar el texto');
    });
}

// Inicializar todos los componentes
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosTarjeta();
    initCVV();
    initToggleSaldo();
    initCambiarEstado();
    initPIN();

    // Copiar número de tarjeta (primer botón copiar)
    const btnsCopy = document.querySelectorAll('.btn_copy');
    btnsCopy.forEach((btn, index) => {
        const textoACopiar = btn.getAttribute('data-copy');
        if (textoACopiar) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                copiarTexto(textoACopiar, btn);
            });
        }
    });
});