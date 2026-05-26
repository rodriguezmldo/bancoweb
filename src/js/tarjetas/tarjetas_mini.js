document.addEventListener("DOMContentLoaded", () => {
    let tarjetaSeleccionada = 'debito';
    
    function obtenerTodasTarjetas() {
        if (typeof datosTarjetas === 'undefined') {
            console.warn("⚠️ datosTarjetas no está definido");
            return { debito: null, credito: null, virtual: null };
        }
        return {
            debito: datosTarjetas.debito || null,
            credito: datosTarjetas.credito || null,
            virtual: datosTarjetas.virtual || null
        };
    }
    
    function obtenerTarjetaActiva(tipo = tarjetaSeleccionada) {
        const todas = obtenerTodasTarjetas();
        return todas[tipo] || todas.debito;
    }
    
    function obtenerSaldo(tarjeta, tipo) {
        if (tipo === 'credito') {
            const limite = tarjeta.limiteCredito || 0;
            const saldoActual = tarjeta.saldoActual || 0;
            return limite - saldoActual;
        } else {
            return tarjeta.saldo || 0;
        }
    }
    
    function obtenerTextoMoneda(tipo) {
        switch(tipo) {
            case 'credito': return 'disponible';
            case 'virtual': return 'virtual';
            default: return '/mes';
        }
    }
    
    function formatearNumeroTarjeta(numero) {
        if (!numero) return "**** ****";
        const limpio = numero.replace(/\s/g, '');
        const ultimos4 = limpio.slice(-4);
        return `**** ${ultimos4}`;
    }
    
    function obtenerUltimos4Digitos(numero) {
        if (!numero) return "****";
        const limpio = numero.replace(/\s/g, '');
        return limpio.slice(-4);
    }
    
    function formatearSaldo(saldo) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(saldo);
    }
    
    function actualizarTarjetaMini(tipo = tarjetaSeleccionada) {
        const tarjeta = obtenerTarjetaActiva(tipo);
        
        if (!tarjeta) {
            console.warn(`No se encontraron datos para tarjeta ${tipo}`);
            return;
        }
        
        const tarjetasMini = document.querySelectorAll('.tarjeta');
        
        if (tarjetasMini.length === 0) {
            console.warn("No se encontraron elementos .tarjeta en la página");
            return;
        }
        
        const saldoMostrar = obtenerSaldo(tarjeta, tipo);
        const textoMoneda = obtenerTextoMoneda(tipo);
        
        tarjetasMini.forEach((tarjetaElement) => {
            const numeroParrafo = tarjetaElement.querySelector('div:first-child p');
            if (numeroParrafo) {
                numeroParrafo.textContent = formatearNumeroTarjeta(tarjeta.numero);
            }
            
            const saldoParrafo = tarjetaElement.querySelector('div:last-child p');
            if (saldoParrafo) {
                const saldoFormateado = formatearSaldo(saldoMostrar);
                const monedaSpan = saldoParrafo.querySelector('.moneda');
                if (monedaSpan) {
                    monedaSpan.textContent = textoMoneda;
                    saldoParrafo.innerHTML = `${saldoFormateado} <span class="moneda">${textoMoneda}</span>`;
                } else {
                    saldoParrafo.innerHTML = `${saldoFormateado} <span class="moneda">${textoMoneda}</span>`;
                }
            }
            
            tarjetaElement.classList.remove('debito', 'credito', 'virtual');
            tarjetaElement.classList.add(tipo);
            
            const eyeImg = tarjetaElement.querySelector('#eye_img');
            if (eyeImg) {
                eyeImg.setAttribute('data-saldo', saldoMostrar);
                eyeImg.setAttribute('data-tipo', tipo);
                if (tipo === 'credito') {
                    eyeImg.setAttribute('data-limite', tarjeta.limiteCredito || 0);
                    eyeImg.setAttribute('data-saldo-actual', tarjeta.saldoActual || 0);
                }
            }
        });
        
        actualizarCLABE(tarjeta);
        actualizarSelectoresCuenta(tarjeta, tipo);
        actualizarFondosDisponibles(tarjeta, tipo);
        
        console.log(`✅ Tarjeta ${tipo} actualizada - Saldo: ${formatearSaldo(saldoMostrar)}`);
    }
    
    function actualizarCLABE(tarjeta) {
        const clabeElement = document.querySelector('.clabe_numero');
        if (clabeElement && tarjeta.clabe) {
            clabeElement.textContent = tarjeta.clabe;
            const btnCopy = document.querySelector('.btn_copy');
            if (btnCopy) {
                const clabeLimpia = tarjeta.clabe.replace(/\s/g, '');
                btnCopy.setAttribute('data-copy', clabeLimpia);
            }
        }
    }
    
    function actualizarSelectoresCuenta(tarjetaActual, tipoActual) {
        const selectCuenta = document.getElementById('cuentaOrigen');
        if (!selectCuenta) return;
        
        const todas = obtenerTodasTarjetas();
        
        while (selectCuenta.options.length > 1) {
            selectCuenta.remove(1);
        }
        
        if (todas.debito) {
            const option = document.createElement('option');
            option.value = 'debito';
            option.textContent = `Débito **** ${obtenerUltimos4Digitos(todas.debito.numero)}`;
            if (tipoActual === 'debito') option.selected = true;
            selectCuenta.appendChild(option);
        }
        
        if (todas.credito) {
            const option = document.createElement('option');
            option.value = 'credito';
            option.textContent = `Crédito **** ${obtenerUltimos4Digitos(todas.credito.numero)}`;
            if (tipoActual === 'credito') option.selected = true;
            selectCuenta.appendChild(option);
        }
        
        if (todas.virtual) {
            const option = document.createElement('option');
            option.value = 'virtual';
            option.textContent = `Virtual **** ${obtenerUltimos4Digitos(todas.virtual.numero)}`;
            if (tipoActual === 'virtual') option.selected = true;
            selectCuenta.appendChild(option);
        }
    }
    
    function actualizarFondosDisponibles(tarjeta, tipo) {
        let fondosContainer = document.querySelector('.fondos-disponibles');
        const campoMonto = document.querySelector('.campo:has(input[type="text"]), .campo:has(input[type="number"])');
        
        if (campoMonto && window.location.href.includes('pago_servicios.html')) {
            if (!fondosContainer) {
                fondosContainer = document.createElement('div');
                fondosContainer.className = 'campo fondos-disponibles';
                fondosContainer.style.cssText = 'margin-top: 10px; padding: 10px; background: #e8f5e9; border-radius: 8px;';
                const label = document.createElement('label');
                label.textContent = 'Fondos disponibles:';
                label.style.fontWeight = 'bold';
                const valorSpan = document.createElement('span');
                valorSpan.className = 'fondos-valor';
                valorSpan.style.cssText = 'margin-left: 10px; color: #2ecc71; font-weight: bold;';
                fondosContainer.appendChild(label);
                fondosContainer.appendChild(valorSpan);
                campoMonto.insertAdjacentElement('afterend', fondosContainer);
            }
            
            const fondosValor = fondosContainer.querySelector('.fondos-valor');
            if (fondosValor) {
                const saldoMostrar = obtenerSaldo(tarjeta, tipo);
                fondosValor.innerHTML = formatearSaldo(saldoMostrar);
            }
        }
    }
    
    function crearSelectorTarjetaRetiro() {
        if (!window.location.href.includes('retirar.html')) return;
        if (document.querySelector('.selector-tarjeta-retiro')) return;
        
        const contenedorPrincipal = document.querySelector('.contenedor_principal');
        const tarjetaElement = document.querySelector('.contenedor_principal .tarjeta');
        
        if (!contenedorPrincipal || !tarjetaElement) return;
        
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'selector-tarjeta-retiro';
        selectorContainer.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        selectorContainer.innerHTML = `
            <label style="display: block; margin-bottom: 10px; font-weight: bold; color: #333;">
                Seleccionar tarjeta:
            </label>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button type="button" class="btn-selector-tarjeta" data-tipo="debito" 
                    style="padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; 
                           background: #0a192f; color: white; font-weight: bold; transition: all 0.3s;">
                    💳 Débito
                </button>
                <button type="button" class="btn-selector-tarjeta" data-tipo="credito" 
                    style="padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; 
                           background: #1a472a; color: white; font-weight: bold; transition: all 0.3s;">
                    💳 Crédito
                </button>
                <button type="button" class="btn-selector-tarjeta" data-tipo="virtual" 
                    style="padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; 
                           background: #2d1b4e; color: white; font-weight: bold; transition: all 0.3s;">
                    💳 Virtual
                </button>
            </div>
        `;
        
        tarjetaElement.insertAdjacentElement('afterend', selectorContainer);
        
        contenedorPrincipal.style.display = 'flex';
        contenedorPrincipal.style.gap = '30px';
        contenedorPrincipal.style.alignItems = 'flex-start';
        contenedorPrincipal.style.flexWrap = 'wrap';
        
        const botones = selectorContainer.querySelectorAll('.btn-selector-tarjeta');
        botones.forEach(btn => {
            btn.addEventListener('click', () => {
                const tipo = btn.getAttribute('data-tipo');
                tarjetaSeleccionada = tipo;
                actualizarTarjetaMini(tipo);
                actualizarSelectoresCuenta(obtenerTarjetaActiva(tipo), tipo);
                
                botones.forEach(b => {
                    b.style.opacity = '0.7';
                    b.style.transform = 'scale(0.95)';
                });
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            btn.addEventListener('mouseleave', () => {
                if (!btn.style.opacity || btn.style.opacity === '1') {
                    btn.style.transform = 'translateY(0)';
                }
            });
        });
        
        const btnDebito = selectorContainer.querySelector('.btn-selector-tarjeta[data-tipo="debito"]');
        if (btnDebito) {
            btnDebito.style.opacity = '1';
            btnDebito.style.transform = 'scale(1)';
        }
    }
    
    function initToggleSaldo() {
        const ojos = document.querySelectorAll('#eye_img');
        ojos.forEach(ojo => {
            ojo.removeEventListener('click', manejarClickOjo);
            ojo.addEventListener('click', manejarClickOjo);
        });
    }
    
    function manejarClickOjo(event) {
        const ojo = event.currentTarget;
        const tarjetaElement = ojo.closest('.tarjeta');
        if (!tarjetaElement) return;
        
        const saldoParrafo = tarjetaElement.querySelector('div:last-child p');
        if (!saldoParrafo) return;
        
        const tipo = ojo.getAttribute('data-tipo') || tarjetaSeleccionada;
        const tarjeta = obtenerTarjetaActiva(tipo);
        
        const estaOculto = saldoParrafo.textContent.includes('*******');
        
        if (estaOculto) {
            const saldoMostrar = obtenerSaldo(tarjeta, tipo);
            const textoMoneda = obtenerTextoMoneda(tipo);
            const saldoFormateado = formatearSaldo(saldoMostrar);
            const monedaSpan = saldoParrafo.querySelector('.moneda');
            if (monedaSpan) {
                monedaSpan.textContent = textoMoneda;
                saldoParrafo.innerHTML = `${saldoFormateado} <span class="moneda">${textoMoneda}</span>`;
            }
            ojo.style.opacity = '1';
        } else {
            const monedaSpan = saldoParrafo.querySelector('.moneda');
            const textoMoneda = monedaSpan ? monedaSpan.textContent : '/mes';
            saldoParrafo.innerHTML = `******* <span class="moneda">${textoMoneda}</span>`;
            ojo.style.opacity = '0.6';
        }
    }
    
    window.copiarCLABE = function() {
        const btn = event?.currentTarget;
        const textoACopiar = btn?.getAttribute('data-copy');
        
        if (textoACopiar) {
            navigator.clipboard.writeText(textoACopiar).then(() => {
                const textoOriginal = btn.innerHTML;
                btn.innerHTML = '<span>✓ Copiado!</span>';
                setTimeout(() => {
                    btn.innerHTML = textoOriginal;
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar:', err);
                alert('No se pudo copiar el texto');
            });
        }
    };
    
    function initSelectorCuenta() {
        const selectCuenta = document.getElementById('cuentaOrigen');
        if (selectCuenta) {
            selectCuenta.addEventListener('change', (e) => {
                const tipo = e.target.value;
                if (tipo && tipo !== '') {
                    tarjetaSeleccionada = tipo;
                    actualizarTarjetaMini(tipo);
                }
            });
        }
    }
    
    function initCodigoRetiro() {
        const btnSolicitar = document.getElementById('btnSolicitarCodigo');
        if (btnSolicitar) {
            btnSolicitar.addEventListener('click', () => {
                const codigoContainer = document.getElementById('codigoContainer');
                const codigoGeneradoSpan = document.getElementById('codigoGenerado');
                
                if (codigoContainer && codigoGeneradoSpan) {
                    const codigo = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
                    const codigoFormateado = `${codigo.slice(0,4)}-${codigo.slice(4,8)}-${codigo.slice(8,12)}`;
                    codigoGeneradoSpan.textContent = codigoFormateado;
                    codigoContainer.style.display = 'block';
                    
                    const btnCopiarCodigo = document.getElementById('btnCopiarCodigo');
                    if (btnCopiarCodigo) {
                        btnCopiarCodigo.onclick = () => {
                            navigator.clipboard.writeText(codigoFormateado);
                            alert('Código copiado');
                        };
                    }
                    
                    const btnDescargarPDF = document.getElementById('btnDescargarPDF');
                    if (btnDescargarPDF) {
                        btnDescargarPDF.onclick = () => {
                            alert('Función de descarga PDF en desarrollo');
                        };
                    }
                }
            });
        }
    }
    
    function init() {
        const url = window.location.href;
        
        if (url.includes('depositar.html')) {
            tarjetaSeleccionada = 'debito';
            actualizarTarjetaMini('debito');
        } 
        else if (url.includes('transferir.html')) {
            actualizarTarjetaMini('debito');
            initSelectorCuenta();
        }
        else if (url.includes('retirar.html')) {
            actualizarTarjetaMini('debito');
            crearSelectorTarjetaRetiro();
            initCodigoRetiro();
        }
        else if (url.includes('pago_servicios.html')) {
            actualizarTarjetaMini('debito');
            initSelectorCuenta();
        }
        else {
            actualizarTarjetaMini('debito');
        }
        
        initToggleSaldo();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
});

window.actualizarTarjetaMini = function(tipo = 'debito') {
    location.reload();
};