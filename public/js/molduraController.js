import { getPhoto, saveFrame } from './apiClient.js';
import { frames, categories } from './frameCatalog.js';
import { filterFrameCards, renderCategoryFilters, renderFrameGrid } from './frameRenderer.js';
import { createCustomFrame, getAllFrames } from './frameService.js';
import { samplePhotos } from './samplePhotos.js';

let selectedPhoto = '';
let selectedFrame = null;
let typeFrame = null;
let customFrames = [];
const btContinuar = document.getElementById('continueBtn');
const btVoltar = document.getElementById('backBtn');
const popup = document.getElementById('popup');


document.addEventListener('DOMContentLoaded', async function () {
    const categoryFilters = document.getElementById('categoryFilters');
    const uploadCustomFrame = document.getElementById('uploadCustomFrame');
    const uploadSquareFrame = document.getElementById('uploadSquareFrame');
    const uploadCircleFrame = document.getElementById('uploadCircleFrame');
    const choiceFrameInput = document.getElementById('choiceFrameInput');
    const closeBt = document.getElementById('closeBt');

    try {
        const data = await getPhoto();
        selectedPhoto = data.photoUrl; // supondo que o backend retorna { photoUrl: '...' }
    } catch (error) {
        console.error('Erro ao buscar a foto selecionada:', error);
        selectedPhoto = samplePhotos[1]; // fallback
    }

    renderCategoryFilters(categoryFilters, categories, filterFrames);

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

        saveFrame(selectedFrame).then(data => {
            console.log('Moldura enviada com sucesso: ', data);
            window.location.href = '/preview';
        }).catch(error => {
            console.error('Erro no envio:', error);
            alert('Não foi possível enviar a moldura. Tente Novamente.');
        })
    });
});





function filterFrames(category, button) {
    filterFrameCards(category, button);
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
    renderFrameGrid(frameGrid, getAllFrames(frames, customFrames), selectedPhoto, selectFrame);
}

function handleCustomFrameUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target.result;
            const customFrame = createCustomFrame(imageUrl, typeFrame, customFrames.length);

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
