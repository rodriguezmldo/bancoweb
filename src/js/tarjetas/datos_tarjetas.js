// Datos centralizados de todas las tarjetas
const datosTarjetas = {
    debito: {
        tipo: "Débito",
        titular: "HECTOR HERNANDEZ PEREZ",
        numero: "9090 9809 8023 2311",
        numeroCompacto: "9090980980232311",
        fechaValidez: "02/34",
        cvv: "123",
        saldo: 15230.50,
        clabe: "9878 9749 8792 8893",
        limites: {
            retiro: 5000,
            compras: 10000
        },
        pin: "1234"
    },
    virtual: {
        tipo: "Virtual",
        titular: "HECTOR HERNANDEZ PEREZ",
        numero: "4444 5555 6666 7777",
        numeroCompacto: "4444555566667777",
        fechaValidez: "08/26",
        cvv: "789",
        saldo: 3250.75,
        limites: {
            retiro: 2000,
            compras: 5000
        },
        pin: "5678"
    },
    credito: {
        tipo: "Crédito",
        titular: "HECTOR HERNANDEZ PEREZ",
        numero: "9090 9809 8023 2311",
        numeroCompacto: "9090980980232311",
        fechaValidez: "02/34",
        cvv: "456",
        limiteCredito: 50000,
        saldoActual: 12450.00,
        pagoMinimo: 1250.00,
        fechaCorte: "15/12/2024",
        fechaPago: "05/01/2025",
        tasaInteres: 45,
        limites: {
            retiroEfectivo: 10000,
            comprasInternacionales: 50000
        },
        pin: "4321"
    }
};