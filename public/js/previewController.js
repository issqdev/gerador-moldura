import { getFrame, getPhoto } from './apiClient.js';
import { renderToCanvas } from './canvasRenderer.js';

let selectedFrame = null;
let selectedPhoto = null;
let imageScale = 100;
let imageRotation = 0;
let imagePosition = { x: 0, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
const btVoltar = document.getElementById('backBtn');
const canvas = document.getElementById('previewCanvas');

btVoltar.addEventListener('click', () => {
    window.location.href = '/moldura';
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    isDragging = true;
    dragStart.x = e.clientX - rect.left - imagePosition.x;
    dragStart.y = e.clientY - rect.top - imagePosition.y;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    imagePosition.x = e.clientX - rect.left - dragStart.x;
    imagePosition.y = e.clientY - rect.top - dragStart.y;
    renderCanvas();
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

document.addEventListener('DOMContentLoaded', async function () {
    const scaleSlider = document.getElementById('scaleSlider');
    const rotateSlider = document.getElementById('rotateSlider');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const startOverBtn = document.getElementById('startOverBtn');

    try {
        const data = await getFrame();
        selectedFrame = data.frame;
    } catch (error) {
        console.error('Erro ao buscar a foto selecionada:', error);
    }

    try {
        const data = await getPhoto();
        selectedPhoto = data.photoUrl;
    } catch (error) {
        console.error('Erro ao buscar a foto selecionada:', error);
    }

    if (selectedFrame && selectedPhoto) {
        renderCanvas();
    }

    document.getElementById('selectedFrameName').textContent = `${selectedFrame.name} (${selectedFrame.category})`;

    scaleSlider.addEventListener('input', (e) => {
        imageScale = parseInt(e.target.value);
        document.getElementById('scaleValue').textContent = imageScale + '%';
        renderCanvas();
    });

    rotateSlider.addEventListener('input', (e) => {
        imageRotation = parseInt(e.target.value);
        document.getElementById('rotateValue').textContent = imageRotation + '°';
        renderCanvas();
    });

    resetBtn.addEventListener('click', resetAdjustments);
    downloadBtn.addEventListener('click', downloadImage);
    startOverBtn.addEventListener('click', startOver);
});

function renderCanvas() {
    const ctx = canvas.getContext('2d');
    const size = canvas.width;

    if (!selectedPhoto || !selectedFrame) return;

    renderToCanvas(ctx, size, {
        canvasSize: canvas.width,
        imagePosition,
        imageRotation,
        imageScale,
        selectedFrame,
        selectedPhoto
    });
}

function resetAdjustments() {
    imageScale = 100;
    imageRotation = 0;
    imagePosition = { x: 0, y: 0 };
    document.getElementById('scaleSlider').value = 100;
    document.getElementById('rotateSlider').value = 0;
    document.getElementById('scaleValue').textContent = '100%';
    document.getElementById('rotateValue').textContent = '0°';
    renderCanvas();
}

function downloadImage() {
    const format = document.getElementById('formatSelect').value;
    const size = parseInt(document.getElementById('sizeSelect').value);

    // Create a new canvas with the selected size
    const downloadCanvas = document.createElement('canvas');
    const ctx = downloadCanvas.getContext('2d');
    downloadCanvas.width = size;
    downloadCanvas.height = size;

    renderToCanvas(ctx, size, {
        canvasSize: canvas.width,
        imagePosition,
        imageRotation,
        imageScale,
        selectedFrame,
        selectedPhoto
    });

    setTimeout(() => {
        const link = document.createElement('a');
        link.download = `foto-moldura-${Date.now()}.${format}`;
        link.href = format === 'jpg'
            ? downloadCanvas.toDataURL('image/jpeg', 0.9)
            : downloadCanvas.toDataURL('image/png');
        link.click();
    }, 500)
}

function startOver() {
    selectedPhoto = null;
    selectedFrame = null;
    imageScale = 100;
    imageRotation = 0;

    window.location.href = '/';
}
