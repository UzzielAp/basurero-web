const express = require('express');
const SerialPort = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configuración de CORS para Express
app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST"],
  credentials: true
}));

// Configuración de Socket.IO con opciones CORS
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const port = new SerialPort.SerialPort({ path: 'COM3', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

const basureros = [
    { id: 1, lleno: false, sensorFuego: false, enUso: false, encendido: true, peso: 0 }
];

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
        basureros[0].sensorFuego = true;

        console.log('Datos recibidos:', data);

        io.emit('updateBasureros', basureros);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
