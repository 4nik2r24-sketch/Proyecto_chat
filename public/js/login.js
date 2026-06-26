const formulario = document.getElementById('form-login');
const inputApodo = document.getElementById('apodo');

if (localStorage.getItem('chat_app_usuario')) {
    window.location.href = 'chat.html';
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    
    const nombreLimpio = inputApodo.value.trim();
    
    if (nombreLimpio) {
        localStorage.setItem('chat_app_usuario', nombreLimpio);
        window.location.href = 'chat.html';
    }
});