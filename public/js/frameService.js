export function getFrameShape(typeFrame) {
    return typeFrame === 'circle' ? 'circle' : 'square';
}

export function createCustomFrame(imageUrl, typeFrame, customFrameCount) {
    return {
        id: `custom-${Date.now()}`,
        name: `Personalizada ${customFrameCount + 1}`,
        category: 'Personalizada',
        shape: getFrameShape(typeFrame),
        type: 'custom',
        imageUrl: imageUrl
    };
}

export function getAllFrames(frames, customFrames) {
    return [...frames, ...customFrames];
}
