// Obtener referencias a los elementos del DOM
const fileInput = document.getElementById('fileInput'); // Input para seleccionar archivos
const overlayContainer = document.getElementById('overlayContainer'); // Contenedor de la imagen superpuesta
const overlayImage = document.getElementById('overlayImage'); // Imagen superpuesta
const resizeHandle = document.getElementById('resizeHandle'); // Controlador de redimensionamiento
const shirtType = document.getElementById('shirtType'); // Selector de tipo de camiseta
const shirtBase = document.getElementById('shirtBase'); // Imagen base de la camiseta
const saveButton = document.getElementById('saveButton'); // Botón para guardar el diseño
const confirmSaveButton = document.getElementById('confirmSaveButton'); // Botón para confirmar el guardado
const previewImage = document.getElementById('previewImage'); // Imagen de vista previa en el modal
const progressBar = document.getElementById('progressBar'); // Barra de progreso en el modal
const marker = document.getElementById('marker'); // Marcador para la posición de la imagen

// Cambiar la imagen base de la camiseta según el tipo seleccionado
shirtType.addEventListener('change', function() {
    const selectedType = shirtType.value; // Obtener el valor seleccionado
    if (selectedType === 'hombre') {
        shirtBase.src = '../textures/hombre.jpg'; // Cambiar a la imagen de hombre
    } else if (selectedType === 'mujer') {
        shirtBase.src = '../textures/mujer.jpg'; // Cambiar a la imagen de mujer
    }
    // Quitar el diseño de la imagen seleccionada
    overlayImage.src = '';
    overlayContainer.style.display = 'none';
    marker.style.display = 'none';
});

// Cargar y mostrar la imagen seleccionada por el usuario
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
        const reader = new FileReader(); // Crear un lector de archivos
        reader.onload = function(e) {
            const img = new Image(); // Crear una nueva imagen
            img.onload = function() {
                const canvas = document.createElement('canvas'); // Crear un canvas
                const ctx = canvas.getContext('2d'); // Obtener el contexto del canvas
                canvas.width = img.width; // Establecer el ancho del canvas
                canvas.height = img.height; // Establecer la altura del canvas
                ctx.drawImage(img, 0, 0); // Dibujar la imagen en el canvas
                overlayImage.src = canvas.toDataURL('image/png'); // Establecer la imagen superpuesta
                overlayContainer.style.display = 'block'; // Mostrar el contenedor de la imagen superpuesta
                overlayImage.style.width = '100px'; // Tamaño inicial de la imagen superpuesta
                overlayImage.style.height = 'auto';
                marker.style.display = 'block'; // Mostrar el marcador
                marker.style.left = `${overlayContainer.offsetLeft}px`; // Posicionar el marcador
                marker.style.top = `${overlayContainer.offsetTop}px`;
                Swal.fire({
                    title: 'Ubicación de la Imagen',
                    text: `X: ${overlayContainer.offsetLeft}, Y: ${overlayContainer.offsetTop}`,
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            };
            img.src = e.target.result; // Establecer la fuente de la imagen
        };
        reader.readAsDataURL(file); // Leer el archivo como una URL de datos
    }
});

// Variables para el arrastre y redimensionamiento de la imagen
let isDragging = false; // Indica si se está arrastrando la imagen
let isResizing = false; // Indica si se está redimensionando la imagen
let startX, startY, initialX, initialY, initialWidth, initialHeight; // Variables para almacenar las posiciones y tamaños iniciales

// Iniciar el arrastre o redimensionamiento
overlayContainer.addEventListener('mousedown', function(event) {
    if (event.target === resizeHandle) {
        isResizing = true; // Iniciar redimensionamiento
        startX = event.clientX; // Almacenar la posición inicial del ratón
        startY = event.clientY;
        initialWidth = overlayImage.offsetWidth; // Almacenar el tamaño inicial de la imagen
        initialHeight = overlayImage.offsetHeight;
    } else {
        isDragging = true; // Iniciar arrastre
        startX = event.clientX; // Almacenar la posición inicial del ratón
        startY = event.clientY;
        initialX = overlayContainer.offsetLeft; // Almacenar la posición inicial del contenedor
        initialY = overlayContainer.offsetTop;
    }
    event.preventDefault(); // Prevenir el comportamiento predeterminado del evento
});

// Manejar el arrastre o redimensionamiento
document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        const dx = event.clientX - startX; // Calcular el desplazamiento en X
        const dy = event.clientY - startY; // Calcular el desplazamiento en Y
        overlayContainer.style.left = `${initialX + dx}px`; // Mover el contenedor
        overlayContainer.style.top = `${initialY + dy}px`;
        marker.style.left = `${initialX + dx}px`; // Mover el marcador
        marker.style.top = `${initialY + dy}px`;
    } else if (isResizing) {
        const dx = event.clientX - startX; // Calcular el desplazamiento en X
        const dy = event.clientY - startY; // Calcular el desplazamiento en Y
        overlayImage.style.width = `${initialWidth + dx}px`; // Redimensionar la imagen
        overlayImage.style.height = `${initialHeight + dy}px`;
    }
});

// Finalizar el arrastre o redimensionamiento
document.addEventListener('mouseup', function() {
    isDragging = false; // Finalizar arrastre
    isResizing = false; // Finalizar redimensionamiento
});

// Guardar el diseño de la camiseta
saveButton.addEventListener('click', function() {
    const canvas = document.createElement('canvas'); // Crear un canvas
    const context = canvas.getContext('2d'); // Obtener el contexto del canvas
    const shirtWidth = shirtBase.width; // Obtener el ancho de la camiseta
    const shirtHeight = shirtBase.height; // Obtener la altura de la camiseta

    canvas.width = shirtWidth; // Establecer el ancho del canvas
    canvas.height = shirtHeight; // Establecer la altura del canvas

    context.drawImage(shirtBase, 0, 0, shirtWidth, shirtHeight); // Dibujar la camiseta en el canvas
    const overlayX = overlayContainer.offsetLeft - shirtBase.offsetLeft; // Calcular la posición X de la imagen superpuesta
    const overlayY = overlayContainer.offsetTop - shirtBase.offsetTop; // Calcular la posición Y de la imagen superpuesta
    const overlayWidth = overlayImage.width; // Obtener el ancho de la imagen superpuesta
    const overlayHeight = overlayImage.height; // Obtener la altura de la imagen superpuesta

    context.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight); // Dibujar la imagen superpuesta en el canvas

    // Mostrar la vista previa en el modal
    previewImage.src = canvas.toDataURL(); // Establecer la fuente de la imagen de vista previa
    $('#confirmModal').modal('show'); // Mostrar el modal de confirmación
});

// Confirmar y guardar el diseño final
confirmSaveButton.addEventListener('click', function() {
    const canvas = document.createElement('canvas'); // Crear un canvas
    const context = canvas.getContext('2d'); // Obtener el contexto del canvas
    const shirtWidth = shirtBase.width; // Obtener el ancho de la camiseta
    const shirtHeight = shirtBase.height; // Obtener la altura de la camiseta

    canvas.width = shirtWidth; // Establecer el ancho del canvas
    canvas.height = shirtHeight; // Establecer la altura del canvas

    context.drawImage(shirtBase, 0, 0, shirtWidth, shirtHeight); // Dibujar la camiseta en el canvas
    const overlayX = overlayContainer.offsetLeft - shirtBase.offsetLeft; // Calcular la posición X de la imagen superpuesta
    const overlayY = overlayContainer.offsetTop - shirtBase.offsetTop; // Calcular la posición Y de la imagen superpuesta
    const overlayWidth = overlayImage.width; // Obtener el ancho de la imagen superpuesta
    const overlayHeight = overlayImage.height; // Obtener la altura de la imagen superpuesta

    context.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight); // Dibujar la imagen superpuesta en el canvas

    // Mostrar la barra de progreso
    progressBar.style.width = '0%'; // Inicializar la barra de progreso
    progressBar.setAttribute('aria-valuenow', '0');
    let progress = 0; // Inicializar el progreso
    const interval = setInterval(() => {
        progress += 10; // Incrementar el progreso
        progressBar.style.width = `${progress}%`; // Actualizar la barra de progreso
        progressBar.setAttribute('aria-valuenow', progress);
        if (progress >= 100) {
            clearInterval(interval); // Detener el intervalo cuando el progreso llegue al 100%

            const link = document.createElement('a'); // Crear un enlace para la descarga
            link.download = 'diseño_camiseta.png'; // Establecer el nombre del archivo
            link.href = canvas.toDataURL(); // Establecer la fuente del enlace
            link.click(); // Simular un clic para iniciar la descarga

            // Mostrar alerta con SweetAlert
            Swal.fire({
                title: 'Diseño Guardado',
                text: 'Tu diseño ha sido guardado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Cerrar el modal
            $('#confirmModal').modal('hide');
        }
    }, 100); // Intervalo de 100 ms para actualizar la barra de progreso
});