export function renderToCanvas(ctx, size, options) {
    const {
        canvasSize,
        imagePosition,
        imageRotation,
        imageScale,
        selectedFrame,
        selectedPhoto
    } = options;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
        const inset = getFrameInset(size, selectedFrame);
        const drawArea = getDrawArea(size, inset);

        clipFrameArea(ctx, size, selectedFrame, inset, drawArea);
        ctx.clearRect(0, 0, size, size);
        drawPhoto(ctx, img, size, canvasSize, drawArea, imagePosition, imageRotation, imageScale);
        restoreFrameArea(ctx, selectedFrame, inset);
        drawFrame(ctx, size, selectedFrame);
    };

    img.src = selectedPhoto;
}

function getFrameInset(size, selectedFrame) {
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

function clipFrameArea(ctx, size, selectedFrame, inset, drawArea) {
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
}

function restoreFrameArea(ctx, selectedFrame, inset) {
    if (selectedFrame.shape === 'circle' || inset > 0) {
        ctx.restore();
    }
}

function drawPhoto(ctx, img, size, canvasSize, drawArea, imagePosition, imageRotation, imageScale) {
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((imageRotation * Math.PI) / 180);
    ctx.scale(imageScale / 100, imageScale / 100);

    const scaleFactor = size / canvasSize;
    ctx.drawImage(
        img,
        drawArea.x - size / 2 + imagePosition.x * scaleFactor,
        drawArea.y - size / 2 + imagePosition.y * scaleFactor,
        drawArea.size,
        drawArea.size
    );
    ctx.restore();
}

function drawFrame(ctx, size, selectedFrame) {
    if (selectedFrame.type === 'png' || selectedFrame.type === 'custom') {
        const frameImg = new Image();
        frameImg.crossOrigin = 'anonymous';
        frameImg.onload = () => {
            ctx.drawImage(frameImg, 0, 0, size, size);
        };
        frameImg.src = selectedFrame.imageUrl;
    } else {
        drawBasicFrame(ctx, size, selectedFrame);
    }
}

function drawBasicFrame(ctx, size, selectedFrame) {
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
        }

        const gradient = ctx.createLinearGradient(0, 0, size, size);
        colors.forEach((color, i) => {
            gradient.addColorStop(i / (colors.length - 1), color);
        });
        return gradient;
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
