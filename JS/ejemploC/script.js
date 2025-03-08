const fileInput = document.getElementById('fileInput');
const overlayContainer = document.getElementById('overlayContainer');
const overlayImage = document.getElementById('overlayImage');
const resizeHandle = document.getElementById('resizeHandle');
const shirtType = document.getElementById('shirtType');
const shirtBase = document.getElementById('shirtBase');
const saveButton = document.getElementById('saveButton');
const confirmSaveButton = document.getElementById('confirmSaveButton');
const previewImage = document.getElementById('previewImage');
const progressBar = document.getElementById('progressBar');
const marker = document.getElementById('marker');

shirtType.addEventListener('change', function() {
    const selectedType = shirtType.value;
    if (selectedType === 'hombre') {
        shirtBase.src = '../textures/hombre.jpg';
    } else if (selectedType === 'mujer') {
        shirtBase.src = '../textures/mujer.jpg';
    }
    // Quitar el diseño de la imagen seleccionada
    overlayImage.src = '';
    overlayContainer.style.display = 'none';
    marker.style.display = 'none';
});

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                overlayImage.src = canvas.toDataURL('image/png');
                overlayContainer.style.display = 'block';
                overlayImage.style.width = '100px'; // Tamaño inicial
                overlayImage.style.height = 'auto';
                marker.style.display = 'block';
                marker.style.left = `${overlayContainer.offsetLeft}px`;
                marker.style.top = `${overlayContainer.offsetTop}px`;
                Swal.fire({
                    title: 'Ubicación de la Imagen',
                    text: `X: ${overlayContainer.offsetLeft}, Y: ${overlayContainer.offsetTop}`,
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

let isDragging = false;
let isResizing = false;
let startX, startY, initialX, initialY, initialWidth, initialHeight;

overlayContainer.addEventListener('mousedown', function(event) {
    if (event.target === resizeHandle) {
        isResizing = true;
        startX = event.clientX;
        startY = event.clientY;
        initialWidth = overlayImage.offsetWidth;
        initialHeight = overlayImage.offsetHeight;
    } else {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialX = overlayContainer.offsetLeft;
        initialY = overlayContainer.offsetTop;
    }
    event.preventDefault();
});

document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        overlayContainer.style.left = `${initialX + dx}px`;
        overlayContainer.style.top = `${initialY + dy}px`;
        marker.style.left = `${initialX + dx}px`;
        marker.style.top = `${initialY + dy}px`;
    } else if (isResizing) {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        overlayImage.style.width = `${initialWidth + dx}px`;
        overlayImage.style.height = `${initialHeight + dy}px`;
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
    isResizing = false;
});

saveButton.addEventListener('click', function() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const shirtWidth = shirtBase.width;
    const shirtHeight = shirtBase.height;

    canvas.width = shirtWidth;
    canvas.height = shirtHeight;

    context.drawImage(shirtBase, 0, 0, shirtWidth, shirtHeight);
    const overlayX = overlayContainer.offsetLeft - shirtBase.offsetLeft;
    const overlayY = overlayContainer.offsetTop - shirtBase.offsetTop;
    const overlayWidth = overlayImage.width;
    const overlayHeight = overlayImage.height;

    context.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight);

    // Mostrar la vista previa en el modal
    previewImage.src = canvas.toDataURL();
    $('#confirmModal').modal('show');
});

confirmSaveButton.addEventListener('click', function() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const shirtWidth = shirtBase.width;
    const shirtHeight = shirtBase.height;

    canvas.width = shirtWidth;
    canvas.height = shirtHeight;

    context.drawImage(shirtBase, 0, 0, shirtWidth, shirtHeight);
    const overlayX = overlayContainer.offsetLeft - shirtBase.offsetLeft;
    const overlayY = overlayContainer.offsetTop - shirtBase.offsetTop;
    const overlayWidth = overlayImage.width;
    const overlayHeight = overlayImage.height;

    context.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight);

    // Mostrar la barra de progreso
    progressBar.style.width = '0%';
    progressBar.setAttribute('aria-valuenow', '0');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
        if (progress >= 100) {
            clearInterval(interval);

            const link = document.createElement('a');
            link.download = 'diseño_camiseta.png';
            link.href = canvas.toDataURL();
            link.click();

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
    }, 100);
});