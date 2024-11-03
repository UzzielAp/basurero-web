const SerialPort = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const http = require('http');
const socketIo = require('socket.io');

// Configura el puerto serial (ajusta el nombre del puerto según el tuyo)
const port = new SerialPort({ path: 'COM3', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Configura el servidor HTTP y Socket.io
const server = http.createServer();
const io = socketIo(server);

// Mantener un registro de los basureros
const basureros = [
    { id: 1, lleno: false, sensorFuego: false, enUso: true, encendido: true, peso: 0 },
    { id: 2, lleno: false, sensorFuego: false, enUso: false, encendido: true, peso: 0 },
    { id: 3, lleno: false, sensorFuego: false, enUso: false, encendido: true, peso: 0 },
];

// Función para analizar los datos enviados desde Arduino
function parseData(line) {
    // Aquí debes adaptar el patrón según el formato que uses
    const distMatch = line.match(/Distancia:(\d+)/);
    const llenoMatch = line.match(/Lleno:(\d)/);

    return {
        distancia: distMatch ? parseInt(distMatch[1]) : null,
        lleno: llenoMatch ? parseInt(llenoMatch[1]) === 1 : false,
        sensorFuego: false,
        peso: 0
    };
}

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Enviar datos iniciales de los basureros al cliente
    socket.emit('updateBasureros', basureros);

    // Enviar datos del Arduino al cliente web
    parser.on('data', (line) => {
        const data = parseData(line);
        
        // Aquí deberías actualizar los basureros según los datos recibidos
        basureros.forEach(basurero => {
            // Lógica para actualizar cada basurero (por ejemplo, usando ID o algo similar)
            if (basurero.id === data.id) { // Asegúrate de que tienes la id en los datos
                basurero.lleno = data.lleno; // Actualiza la propiedad "lleno"
                // Puedes agregar más propiedades aquí según sea necesario
            }
        });

        // Emitir la actualización de los basureros a todos los clientes conectados
        io.emit('updateBasureros', basureros);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
