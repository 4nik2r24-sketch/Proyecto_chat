const miApodo = localStorage.getItem('chat_app_usuario');
if (!miApodo) window.location.href = 'index.html';

document.getElementById('nombre-usuario').textContent = miApodo;
const socket = io();

const conversorEmoji = new EmojiConvertor();
conversorEmoji.replace_mode = 'unified';
conversorEmoji.allow_native = true;

const cajaMensajes = document.getElementById('caja-mensajes');
const inputMsj = document.getElementById('input-msj');
const btnEnviar = document.getElementById('btn-enviar');
const inputBuscador = document.getElementById('input-buscador');
const inputArchivo = document.getElementById('input-archivo');
const botonesSala = document.querySelectorAll('.btn-sala');
const pickerEmoji = document.getElementById('emoji-picker');

let salaActual = 'General';
let historialSalas = JSON.parse(localStorage.getItem('chat_historial_v1')) || {};
let limiteMensajes = 15;

function generarBip(frecuencia = 587.33, tipo = 'sine') {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = tipo; osc.frequency.value = frecuencia;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.12);
    } catch(e) {}
}

const catalogoShortcodes = [':grin:', ':joy:', ':sunglasses:', ':heart_eyes:', ':wink:', ':fire:', ':+1:', ':tada:', ':rocket:', ':computer:', ':heart:', ':pizza:'];

catalogoShortcodes.forEach(codigo => {
    const span = document.createElement('span');
    span.className = 'emoji-item';
    span.dataset.code = codigo;
    span.innerHTML = conversorEmoji.replace_colons(codigo);
    
    span.addEventListener('click', () => {
        inputMsj.value += codigo + ' ';
        pickerEmoji.style.display = 'none';
        inputMsj.focus();
    });
    
    pickerEmoji.appendChild(span);
});

cambiarSala('General');

botonesSala.forEach(btn => {
    btn.addEventListener('click', () => {
        botonesSala.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cambiarSala(btn.dataset.sala);
    });
});

function cambiarSala(nuevaSala) {
    salaActual = nuevaSala;
    document.getElementById('titulo-sala').textContent = `Sala ${nuevaSala}`;
    limiteMensajes = 15;
    inputBuscador.value = '';
    socket.emit('unirse-a-sala', { usuario: miApodo, sala: salaActual });
    renderizarDOM();
}

btnEnviar.addEventListener('click', enviarPaquete);
inputMsj.addEventListener('keypress', (e) => { if(e.key === 'Enter') enviarPaquete(); });

function enviarPaquete() {
    const texto = inputMsj.value.trim();
    const archivoSeleccionado = inputArchivo.files[0];

    if (!texto && !archivoSeleccionado) return;

    if (archivoSeleccionado) {
        const lector = new FileReader();
        lector.onload = function(evt) {
            socket.emit('enviar-mensaje', {
                texto: texto,
                archivo: evt.target.result,
                nombreArchivo: archivoSeleccionado.name,
                tipoArchivo: archivoSeleccionado.type
            });
            inputArchivo.value = '';
        };
        lector.readAsDataURL(archivoSeleccionado);
    } else {
        socket.emit('enviar-mensaje', { texto: texto });
    }
    inputMsj.value = '';
}

socket.on('mensaje-recibido', (msg) => {
    if (!historialSalas[msg.sala]) historialSalas[msg.sala] = [];
    historialSalas[msg.sala].push(msg);
    localStorage.setItem('chat_historial_v1', JSON.stringify(historialSalas));

    if (msg.sala === salaActual) {
        if (msg.emisor !== miApodo) generarBip(659.25, 'triangle');
        renderizarDOM();
    }
});

socket.on('aviso-sala', (aviso) => {
    if(aviso.sonido) generarBip(440, 'sine');
    const divAviso = document.createElement('div');
    divAviso.className = 'aviso-sala';
    divAviso.textContent = aviso.texto;
    cajaMensajes.appendChild(divAviso);
    cajaMensajes.scrollTop = cajaMensajes.scrollHeight;
});

inputBuscador.addEventListener('input', () => renderizarDOM());

cajaMensajes.addEventListener('scroll', () => {
    if (cajaMensajes.scrollTop === 0) {
        const mensajesSala = historialSalas[salaActual] || [];
        if (limiteMensajes < mensajesSala.length) {
            limiteMensajes += 10;
            const alturaAnterior = cajaMensajes.scrollHeight;
            renderizarDOM(false);
            cajaMensajes.scrollTop = cajaMensajes.scrollHeight - alturaAnterior;
        }
    }
});

function renderizarDOM(autoScroll = true) {
    cajaMensajes.innerHTML = '';
    const filtro = inputBuscador.value.toLowerCase();
    let lista = historialSalas[salaActual] || [];

    if (filtro) {
        lista = lista.filter(m => m.texto.toLowerCase().includes(filtro) || (m.nombreArchivo && m.nombreArchivo.toLowerCase().includes(filtro)));
    }

    const listaPaginada = lista.slice(-limiteMensajes);

    listaPaginada.forEach(msg => {
        const esPropio = msg.emisor === miApodo;
        const div = document.createElement('div');
        div.className = `mensaje ${esPropio ? 'propio' : 'ajeno'}`;

        let htmlContenido = `<span class="meta-msj">${esPropio ? 'Tú' : msg.emisor} • ${msg.hora}</span>`;
        
        if (msg.texto) {
            const textoConEmojis = conversorEmoji.replace_colons(msg.texto);
            htmlContenido += `<div>${textoConEmojis}</div>`;
        }
        
        if (msg.archivo) {
            if (msg.tipoArchivo && msg.tipoArchivo.startsWith('image/')) {
                htmlContenido += `<img src="${msg.archivo}" class="img-adjunta" alt="Adjunto">`;
            } else {
                htmlContenido += `<a href="${msg.archivo}" download="${msg.nombreArchivo}" class="archivo-adjunto">[Archivo] ${msg.nombreArchivo}</a>`;
            }
        }

        div.innerHTML = htmlContenido;
        cajaMensajes.appendChild(div);
    });

    if (autoScroll) cajaMensajes.scrollTop = cajaMensajes.scrollHeight;
}

document.getElementById('btn-emoji').addEventListener('click', () => {
    pickerEmoji.style.display = pickerEmoji.style.display === 'grid' ? 'none' : 'grid';
});

function cerrarSesion() {
    localStorage.removeItem('chat_app_usuario');
    window.location.href = 'index.html';
}