async function requestJson(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error('Erro na comunicação com a API');
    }

    return response.json();
}

export function getPhoto() {
    return requestJson('/api/photo');
}

export function savePhoto(photo) {
    return requestJson('/api/photo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photo })
    });
}

export function getFrame() {
    return requestJson('/api/frame');
}

export function saveFrame(frame) {
    return requestJson('/api/frame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ frame })
    });
}
