const express = require('express'); // Importar Express
const SerialPort = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Importar CORS

// Crear una aplicación Express
const app = express();
app.use(cors({ origin: 'http://127.0.0.1:5500' })); // Permitir solicitudes desde esta URL

// Configura el puerto serial (ajusta el nombre del puerto según el tuyo)
const port = new SerialPort.SerialPort({ path: 'COM3', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Configura el servidor HTTP y Socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Mantener un registro de los basureros
const basureros = [
    { id: 1, lleno: false, sensorFuego: false, enUso: true, encendido: true, peso: 0 },
    { id: 2, lleno: false, sensorFuego: false, enUso: false, encendido: true, peso: 0 },
    { id: 3, lleno: false, sensorFuego: false, enUso: false, encendido: true, peso: 0 },
];

// Función para analizar los datos enviados desde Arduino
function parseData(line) {
    const data = {};
    line.split(',').forEach(item => {
        const [key, value] = item.split(':');
        data[key] = value === '1';
    });
    return data;
}

io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.emit('updateBasureros', basureros);

    parser.on('data', (line) => {
        const data = parseData(line);
        
        // Actualizar el primer basurero con los datos recibidos
        basureros[0].lleno = data.Lleno;
        basureros[0].enUso = data.EnUso;
        basureros[0].encendido = data.Encendido;

        io.emit('updateBasureros', basureros);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
