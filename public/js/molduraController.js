let selectedPhoto = '';
let selectedFrame = null;
let typeFrame = null;
let customFrames = [];
const btContinuar = document.getElementById('continueBtn');
const btVoltar = document.getElementById('backBtn');
const popup = document.getElementById('popup');

const samplePhotos = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
];

const frames = [
    // Molduras básicas
    {
        id: 'white',
        name: 'Branco Clássico',
        category: 'Clássica',
        borderWidth: 8,
        borderColor: '#ffffff',
        shadow: true,
        shape: 'square',
        type: 'basic'
    },
    {
        id: 'black',
        name: 'Preto Elegante',
        category: 'Clássica',
        borderWidth: 8,
        borderColor: '#000000',
        shadow: true,
        shape: 'square',
        type: 'basic'
    },
    {
        id: 'gold',
        name: 'Ouro Luxo',
        category: 'Premium',
        borderWidth: 12,
        borderColor: '#ffd700',
        shadow: true,
        shape: 'square',
        type: 'basic'
    },
    {
        id: 'silver',
        name: 'Prata Moderna',
        category: 'Moderna',
        borderWidth: 6,
        borderColor: '#c0c0c0',
        shadow: true,
        shape: 'square',
        type: 'basic'
    },
    // Molduras redondas
    {
        id: 'circle-white',
        name: 'Branco Redondo',
        category: 'Redonda',
        borderWidth: 8,
        borderColor: '#ffffff',
        shadow: true,
        shape: 'circle',
        type: 'basic'
    },
    {
        id: 'circle-black',
        name: 'Preto Redondo',
        category: 'Redonda',
        borderWidth: 8,
        borderColor: '#000000',
        shadow: true,
        shape: 'circle',
        type: 'basic'
    },
    // Molduras PNG padrão
    {
        id: 'modelo-BB',
        name: 'Teste BB',
        category: 'PNG',
        shape: 'square',
        type: 'png',
        imageUrl: '../frames/moldura-BB.png'
    },
    {
        id: 'lider-digital',
        name: 'Líder Digital',
        category: 'PNG',
        shape: 'square',
        type: 'png',
        imageUrl: '../frames/moldura-LiderDigital.png'
    },
    {
        id: 'modelo-BB2',
        name: 'Fui Certificado',
        category: 'Redonda',
        shape: 'circle',
        type: 'png',
        imageUrl: '../frames/foto-humanograma.png'
    },
    {
        id: 'lider-digital-circular-preta',
        name: 'Líder Digital',
        category: 'Redonda',
        shape: 'circle',
        type: 'png',
        imageUrl: '../frames/moldura-Lider-Digital-circular-preta.png'
    },
    {
        id: 'lider-digital-circular-azul',
        name: 'Líder Digital',
        category: 'Redonda',
        shape: 'circle',
        type: 'png',
        imageUrl: '../frames/moldura-Lider-Digital-circular-azul.png'
    },
    {
        id: 'lider-digital-quadrada-preta',
        name: 'Líder Digital',
        category: 'PNG',
        shape: 'square',
        type: 'png',
        imageUrl: '../frames/moldura-Lider-Digital-quadrada-preta.png'
    },
    {
        id: 'lider-digital-quadrada-azul',
        name: 'Líder Digital',
        category: 'PNG',
        shape: 'square',
        type: 'png',
        imageUrl: '../frames/moldura-Lider-Digital-quadrada-azul.png'
    },
    {
        id: 'lider-digital-quadrada-preta2',
        name: 'Líder Digital',
        category: 'PNG',
        shape: 'square',
        type: 'png',
        imageUrl: '../frames/moldura-Lider-Digital-quadrada-preta2.png'
    },
    {
        id: 'lider-digital-quadrada-azul2',
        name: 'Líder Digital',
        category: 'PNG',
        shape: 'square',
        type: 'png',
        imageUrl: '../frames/moldura-Lider-Digital-quadrada-azul2.png'
    }
];

const categories = ['Todas', 'Clássica', 'Moderna', 'Premium', 'Redonda', 'PNG', 'Personalizada'];

document.addEventListener('DOMContentLoaded', async function () {
    const categoryFilters = document.getElementById('categoryFilters');
    const uploadCustomFrame = document.getElementById('uploadCustomFrame');
    const uploadSquareFrame = document.getElementById('uploadSquareFrame');
    const uploadCircleFrame = document.getElementById('uploadCircleFrame');
    const choiceFrameInput = document.getElementById('choiceFrameInput');
    const closeBt = document.getElementById('closeBt');

    try {
        const response = await fetch('/api/photo'); // ajuste a rota conforme seu backend
        const data = await response.json();
        selectedPhoto = data.photoUrl; // supondo que o backend retorna { photoUrl: '...' }
    } catch (error) {
        console.error('Erro ao buscar a foto selecionada:', error);
        selectedPhoto = samplePhotos[1]; // fallback
    }

    // Create category filters
    categories.forEach((category, index) => {
        const button = document.createElement('button');
        button.className = `category-filter ${index === 0 ? 'active' : ''}`;
        button.textContent = category;
        button.addEventListener('click', () => filterFrames(category, button));
        categoryFilters.appendChild(button);
    });

    btVoltar.classList.remove('hidden');
    btVoltar.addEventListener('click', () => {
        window.location.href = '/';
    });

    document.getElementById('selectedPhotoPreview').src = selectedPhoto;
    // Update frame previews with selected photo
    document.querySelectorAll('.frame-preview img').forEach(img => {
        img.src = selectedPhoto;
    });

    uploadCustomFrame.addEventListener('click', () => {
        popup.classList.remove('hidden');
    })

    closeBt.addEventListener('click', () => {
        popup.classList.add('hidden');
    })

    uploadSquareFrame.addEventListener('click', () => {
        typeFrame = 'square';
        choiceFrameInput.click()

    });

    uploadCircleFrame.addEventListener('click', () => {
        typeFrame = 'circle';
        choiceFrameInput.click()
    });

    choiceFrameInput.addEventListener('change', handleCustomFrameUpload);

    updateFrameGrid();

    btContinuar.addEventListener('click', () => {
        if (!selectedFrame) return;

        fetch('/api/frame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ frame: selectedFrame })
        }).then(response => {
            if (!response.ok) throw new Error('Erro ao enviar moldura!')
            return response.json();
        }).then(data => {
            console.log('Moldura enviada com sucesso: ', data);
            window.location.href = '/preview';
        }).catch(error => {
            console.error('Erro no envio:', error);
            alert('Não foi possível enviar a moldura. Tente Novamente.');
        })
    });
});




function createFrameCard(frame) {
    const div = document.createElement('div');
    div.className = 'frame-card';
    div.setAttribute('data-category', frame.category);

    div.innerHTML = `
                <div class="frame-preview ${frame.shape === 'circle' ? 'circular' : ''}">
                    ${createFramePreview(frame)}
                </div>
                <h4>${frame.name}</h4>
                <span class="frame-category">${frame.category}</span>
            `;

    div.addEventListener('click', () => selectFrame(frame, div));
    return div;
}

function createFramePreview(frame) {
    if (frame.type === 'png' || frame.type === 'custom') {
        // Para molduras PNG, mostra a moldura com a foto dentro
        return `
                <div class="frame-preview-content">
                    <img src="${frame.imageUrl}" alt="Moldura" class="frame-preview-frame">
                    <img src="${selectedPhoto}" alt="Preview" class="frame-preview-photo ${frame.shape === 'circle' ? 'frame-preview-photo--circle' : ''}">
                </div>
            `;
    } else {
        // Para molduras básicas, mostra apenas a foto com a borda
        return `<img src="${selectedPhoto}" alt="Preview" class="basic-frame-preview ${frame.shape === 'circle' ? 'basic-frame-preview--circle' : ''}" style="--frame-border-width: ${frame.borderWidth}px; --frame-border-color: ${frame.borderColor};">`;
    }
}

function filterFrames(category, button) {
    // Update active button
    document.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Filter frames
    document.querySelectorAll('.frame-card').forEach(card => {
        if (category === 'Todas' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function selectFrame(frame, element) {
    // Remove previous selection
    document.querySelectorAll('.frame-card').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    selectedFrame = frame;
    document.getElementById('continueBtn').classList.remove('hidden');
}

function updateFrameGrid() {
    const frameGrid = document.getElementById('frameGrid');
    frameGrid.innerHTML = '';

    const allFrames = [...frames, ...customFrames];
    allFrames.forEach(frame => {
        const frameCard = createFrameCard(frame);
        frameGrid.appendChild(frameCard);
    });
}

function handleCustomFrameUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target.result;
            const shape = (typeFrame === 'circle') ? 'circle' : 'square';
            const customFrame = {
                id: `custom-${Date.now()}`,
                name: `Personalizada ${customFrames.length + 1}`,
                category: 'Personalizada',
                shape: shape,
                type: 'custom',
                imageUrl: imageUrl
            };

            customFrames.push(customFrame);
            updateFrameGrid();

            // Show success message
            const successMsg = document.getElementById('uploadSuccess');
            successMsg.classList.remove('hidden');
            setTimeout(() => successMsg.classList.add('hidden'), 3000);

            // Switch to Personalizada category
            filterFrames('Personalizada', document.querySelector('[data-category="Personalizada"]'));
            closePopup();
        };
        reader.readAsDataURL(file);
    }
    e.target.value = ''; // Reset input
}

function closePopup() {
    popup.classList.add('hidden');
}
