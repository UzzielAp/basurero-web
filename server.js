const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const http = require('http');
const socketIo = require('socket.io');

// Configura el puerto serial (ajusta el nombre del puerto según el tuyo)
const port = new SerialPort('COM3', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Configura el servidor HTTP y Socket.io
const server = http.createServer();
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Enviar datos del Arduino al cliente web
    parser.on('data', (line) => {
        const data = parseData(line);
        socket.emit('basureroData', data);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

function parseData(line) {
    // Analizar los datos enviados desde Arduino
    const distMatch = line.match(/Distancia:(\d+)/);
    const llenoMatch = line.match(/Lleno:(\d)/);

    return {
        distancia: distMatch ? parseInt(distMatch[1]) : null,
        lleno: llenoMatch ? parseInt(llenoMatch[1]) === 1 : false
    };
}
