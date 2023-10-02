console.log('ok');
const socket = io();
const mensajes = document.getElementById('mensajes');
const mensaje = document.getElementById('mensaje');
let nombre = '';

mensajes.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') { 
        if (evt.target.value.trim() !== '') {
            socket.emit('nuevoMensaje', { emisor: nombre, mensaje: evt.target.value.trim() });
            evt.target.value = '';
            mensaje.focus(); 
        }
    }
});

swal.fire({
    title: "Ingrese su Nombre",
    input: "text",
    text: "Ingresa tu apodo",
    inputValidation: (value) => {
        return !value && "Tienes que ingresar un nombre"; // Cambiado de 'Tenes' a 'Tienes'
    },
    allowOutsideClick: false
})

.then((resultado) => { // Cambiado de ') =>' a '=>'
    nombre = resultado.value;
    document.title = nombre;
    mensaje.focus(); 
    socket.emit('id', nombre);
    socket.on('Bienvenida', mensaje => {
        let text = '';
        mensaje.forEach(mensaje => { 
            text += `<p class="mensaje"><strong>${mensaje.emisor}</strong>:<i>${mensaje.mensaje}</i></p><br>`;
        });
        mensajes.innerHTML = text;
        mensajes.scrollTop = mensajes.scrollHeight;
    });
    
    socket.on('nuevoUsuario', mensaje => {
        swal.fire({
            text: `${nombre} Se conectó`, 
            toast: true,
            position: "top-right"
        });
        socket.on('llegoMensaje', mensaje => {
            let text = '';
            mensaje.forEach(mensaje => { 
                text += `<p class="mensaje"><strong>${mensaje.emisor}</strong>:<i>${mensaje.mensaje}</i></p><br>`;
            });
            mensajes.innerHTML = text;
            mensajes.scrollTop = mensajes.scrollHeight;
        });
    });
    
    socket.on('usuarioDesconectado', usuario => { 
        swal.fire({
            text: `${usuario.nombre} Se desconectó`, 
            toast: true,
            position: "top-right"
        });
    });
});
module.express = vistas;