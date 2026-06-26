const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 5e7
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('[CONECTADO] Cliente ID:', socket.id);

    socket.on('unirse-a-sala', ({ usuario, sala }) => {
        if (socket.salaActual) {
            socket.leave(socket.salaActual);
            socket.to(socket.salaActual).emit('aviso-sala', { texto: `${usuario} salió de la sala.`, sonido: true });
        }

        socket.join(sala);
        socket.usuario = usuario;
        socket.salaActual = sala;

        socket.to(sala).emit('aviso-sala', { texto: `${usuario} se unió a la sala ${sala}.`, sonido: true });
    });

    socket.on('enviar-mensaje', (paquete) => {
        if (!socket.salaActual) return;

        const mensaje = {
            id: Date.now(),
            emisor: socket.usuario,
            sala: socket.salaActual,
            texto: paquete.texto,
            archivo: paquete.archivo || null,
            nombreArchivo: paquete.nombreArchivo || null,
            tipoArchivo: paquete.tipoArchivo || null,
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        io.to(socket.salaActual).emit('mensaje-recibido', mensaje);
    });

    socket.on('disconnect', () => {
        if (socket.salaActual && socket.usuario) {
            socket.to(socket.salaActual).emit('aviso-sala', { texto: `${socket.usuario} se desconectó.`, sonido: true });
        }
    });
});

server.listen(3000, () => console.log('Servidor listo en http://localhost:3000'));