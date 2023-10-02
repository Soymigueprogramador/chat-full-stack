const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const { Server } = require('socket.io');
const port = 3000;
const app = express();

app.engine('handlebars', engine());

app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, '/vistas'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.status(200).render('home');
});

app.get('/chat', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.status(200).render('chat');
});

const servidor = app.listen(port, () => {
    console.log(`Hola chat, estamos en el puerto ${port}`);
});

const nombreDelProyecto = 'MG lo quiero 3D';

const mensaje = [{
    emisor: 'servidor',
    mensaje: `Bienvenido al chat de ${nombreDelProyecto}`
}];

let usuarios = [];

const io = new Server(servidor);

io.on('connection', (socket) => {
    console.log(`AH!! se conectó un nuevo cliente ID ${socket.id}`);
    usuarios.push({
        id: socket.id,
        nombre: '' // Aquí falta definir el nombre del usuario.
    });
    
    socket.emit('Bienvenido', mensaje);
    socket.broadcast.emit('nuevoUsuario', 'Nuevo usuario'); // Debes definir el nombre del nuevo usuario aquí.
    
    socket.on('nuevoMensaje', (nuevoMensaje) => {
        mensaje.push(nuevoMensaje);
        io.emit('llegoMensaje', nuevoMensaje);
    });
    
    socket.on('desconeccion', () => {
        console.log(`UPS!! se desconectó un ID ${socket.id}`);
        const indice = usuarios.findIndex((user) => user.id === socket.id);
        const usuarioDesconectado = usuarios[indice];
        io.emit('usuarioDesconectado', usuarioDesconectado);
        console.log(usuarioDesconectado);
        usuarios.splice(indice, 1);
    });
});