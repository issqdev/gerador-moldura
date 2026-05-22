import { savePhoto } from './apiClient.js';
import { samplePhotos } from './samplePhotos.js';

let selectedPhoto = '';
const btContinuar = document.getElementById('continueStep1');
const uploadImg = document.getElementById('uploadedImg');
const uploadContent = document.getElementById('uploadContent');
const uploadPreview = document.getElementById('uploadPreview');

document.addEventListener('DOMContentLoaded', function () {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const sampleGrid = document.getElementById('sampleGrid');
    
    // Create sample photos
    samplePhotos.forEach((photo, index) => {
        const div = document.createElement('div');
        div.className = 'sample-photo';
        div.innerHTML = `<img src="${photo}" alt="Exemplo ${index + 1}">`;
        div.addEventListener('click', () => selectSamplePhoto(photo, div));
        sampleGrid.appendChild(div);
    });
    
    // Upload area events
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    fileInput.addEventListener('change', handleFileSelect);
    
    btContinuar.addEventListener("click", () => {
        if(!selectedPhoto) return;
        // console.log('Enviando foto:', selectedPhoto.substring(0, 100));

        savePhoto(selectedPhoto).then(data => {
            console.log('Foto enviada com sucesso:', data);
            window.location.href = '/moldura';
        }).catch(error => {
            console.error('Erro no envio:', error);
            alert('Não foi possível enviar a foto. Tente Novamente.');
        });
    });
}); 


function selectSamplePhoto(photo, element) {
    // Remove previous selection
    document.querySelectorAll('.sample-photo').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    selectedPhoto = photo;
    
    uploadImg.src = selectedPhoto;
    uploadContent.classList.add('hidden');
    uploadPreview.classList.remove('hidden');

    showContinueButton();
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function processFile(file) {
    console.log('processFile chamado');
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log('Resultado do FileReader:', e.target.result);
        selectedPhoto = e.target.result;
        uploadImg.src = selectedPhoto;
        uploadContent.classList.add('hidden');
        uploadPreview.classList.remove('hidden');

        // Remove sample photo selection
        document.querySelectorAll('.sample-photo').forEach(el => el.classList.remove('selected'));

        showContinueButton();
    };
    reader.readAsDataURL(file);
}

function showContinueButton() {
    btContinuar.classList.remove('hidden');
}
