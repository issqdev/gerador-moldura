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
        const response = await fetch('/api/frame');
        const data = await response.json();
        selectedFrame = data.frame;
    } catch (error) {
        console.error('Erro ao buscar a foto selecionada:', error);
    }

    try {
        const response = await fetch('/api/photo');
        const data = await response.json();
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

    renderToCanvas(ctx, size);
}

function renderToCanvas(ctx, size) {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
        const inset = getFrameInset(size);
        const drawArea = getDrawArea(size, inset);

        if (selectedFrame.shape === 'circle') {
            ctx.save();
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, (size / 2) - (selectedFrame.borderWidth || 0), 0, 2 * Math.PI);
            ctx.clip();
        } else if (inset > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(drawArea.x, drawArea.y, drawArea.size, drawArea.size);
            ctx.clip();
        }

        ctx.clearRect(0, 0, size, size);

        // Draw image with transformations
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((imageRotation * Math.PI) / 180);
        ctx.scale(imageScale / 100, imageScale / 100);

        const imgSize = drawArea.size;
        const scaleFactor = size / canvas.width;
        ctx.drawImage(
            img,
            drawArea.x - size / 2 + imagePosition.x * scaleFactor,
            drawArea.y - size / 2 + imagePosition.y * scaleFactor,
            imgSize,
            imgSize
        );
        ctx.restore();

        if (selectedFrame.shape === 'circle' || inset > 0) {
            ctx.restore();
        }

        if (selectedFrame.type === 'png' || selectedFrame.type === 'custom') {
            const frameImg = new Image();
            frameImg.crossOrigin = 'anonymous';
            frameImg.onload = () => {
                ctx.drawImage(frameImg, 0, 0, size, size);
            };
            frameImg.src = selectedFrame.imageUrl;
        } else {
            drawBasicFrame(ctx, size);
        }
    };

    img.src = selectedPhoto;
}

function getFrameInset(size) {
    if (!selectedFrame.previewInset) return 0;

    const inset = parseFloat(selectedFrame.previewInset);
    return Number.isNaN(inset) ? 0 : (size * inset) / 100;
}

function getDrawArea(size, inset) {
    return {
        x: inset,
        y: inset,
        size: size - inset * 2
    };
}

function drawBasicFrame(ctx, size) {
    const borderWidth = selectedFrame.borderWidth || 8;
    const scaledBorderWidth = (borderWidth * size) / 400;

    const applyGradient = (type) => {
        const colors = selectedFrame.gradient;
        if (!colors || colors.length < 2) return null;

        if (type === 'radial') {
            const center = size / 2;
            const outerRadius = center;
            const innerRadius = outerRadius - scaledBorderWidth;
            const gradient = ctx.createRadialGradient(center, center, innerRadius, center, center, outerRadius);
            colors.forEach((color, i) => {
                gradient.addColorStop(i / (colors.length - 1), color);
            });
            return gradient;
        } else {
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            colors.forEach((color, i) => {
                gradient.addColorStop(i / (colors.length - 1), color);
            });
            return gradient;
        }
    };

    if (selectedFrame.shape === 'circle') {
        const center = size / 2;
        const outerRadius = center;
        const innerRadius = outerRadius - scaledBorderWidth;

        ctx.fillStyle = applyGradient('radial') || selectedFrame.borderColor;

        ctx.beginPath();
        ctx.arc(center, center, outerRadius, 0, 2 * Math.PI);
        ctx.arc(center, center, innerRadius, 0, 2 * Math.PI, true);
        ctx.fill();
    } else {
        ctx.strokeStyle = applyGradient('linear') || selectedFrame.borderColor;
        ctx.lineWidth = scaledBorderWidth;
        ctx.strokeRect(
            scaledBorderWidth / 2,
            scaledBorderWidth / 2,
            size - scaledBorderWidth,
            size - scaledBorderWidth
        );
    }
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

    renderToCanvas(ctx, size);

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
