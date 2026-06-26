#  Proyecto: Aplicación de Chat Avanzado en Tiempo Real

## Descripción General
Aplicación web de mensajería instantánea enfocada en el desarrollo frontend avanzado y la comunicación bidireccional de baja latencia mediante WebSockets. El sistema permite el intercambio persistente de mensajes multimedia en canales temáticos, destacando por una interfaz moderna en modo oscuro, optimización de usabilidad e historial persistente del lado del cliente.

---

##  Características y Funcionalidades

* **Sistema de Acceso Básico:** Ingreso rápido mediante registro de alias en la memoria local (`localStorage`), restringiendo el acceso no autorizado a las salas sin necesidad de bases de datos relacionales externas.
* **Salas Temáticas Alternables:** Capacidad de unirse, participar y cambiar fluidamente entre distintas salas de conversación (*Sala General*, *Sala Gaming* y *Sala Desarrollo*).
* **Comunicación en Tiempo Real:** Emisión y recepción instantánea de paquetes de datos utilizando el motor **Socket.IO**.
* **Soporte Multimedia y Adjuntos:** Conversión y envío nativo de documentos e imágenes mediante cadenas Base64 directamente a través del canal WebSocket.
* **Procesamiento Dinámico de Emojis:** Integración de la biblioteca `iamcal/emoji-js` para interpretar *shortcodes* de texto (ej: `:rocket:`, `:fire:`) y dibujarlos como pictogramas nativos universales en el DOM.
* **Sistema de Alertas:** Emisión de avisos visuales en el contenedor del chat y notificaciones sonoras sintetizadas (*Web Audio API*) ante el ingreso/salida de usuarios o la recepción de nuevos mensajes.
* **Historial Local con Buscador:** Almacenamiento de las conversaciones en el navegador del cliente con una barra de filtrado en tiempo real por coincidencias de texto o nombre de archivo.
* **Scroll Infinito:** Paginación progresiva hacia atrás de mensajes anteriores a medida que el usuario desplaza la barra de desplazamiento hacia el tope superior de la sala.

---

## Stack Tecnológico

* **Entorno de Ejecución / Backend:** Node.js, Express.js, HTTP nativo.
* **Motor de Tiempo Real:** Socket.IO v4.
* **Frontend:** HTML5, CSS3 (Diseño responsivo con Flexbox/Grid), JavaScript ES6+ (Manipulación del DOM y FileReader API).
* **Librerías de Terceros:** `emoji-js` (vía CDN).


