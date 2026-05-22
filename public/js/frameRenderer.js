function createFramePreview(frame, selectedPhoto) {
    if (frame.type === 'png' || frame.type === 'custom') {
        return `
                <div class="frame-preview-content">
                    <img src="${frame.imageUrl}" alt="Moldura" class="frame-preview-frame">
                    <img src="${selectedPhoto}" alt="Preview" class="frame-preview-photo ${frame.shape === 'circle' ? 'frame-preview-photo--circle' : ''}" style="--frame-preview-inset: ${frame.previewInset || '20%'};">
                </div>
            `;
    }

    return `<img src="${selectedPhoto}" alt="Preview" class="basic-frame-preview ${frame.shape === 'circle' ? 'basic-frame-preview--circle' : ''}" style="--frame-border-width: ${frame.borderWidth}px; --frame-border-color: ${frame.borderColor};">`;
}

function createFrameCard(frame, selectedPhoto, onSelectFrame) {
    const div = document.createElement('div');
    div.className = 'frame-card';
    div.setAttribute('data-category', frame.category);

    div.innerHTML = `
                <div class="frame-preview ${frame.shape === 'circle' ? 'circular' : ''}">
                    ${createFramePreview(frame, selectedPhoto)}
                </div>
                <h4>${frame.name}</h4>
                <span class="frame-category">${frame.category}</span>
            `;

    div.addEventListener('click', () => onSelectFrame(frame, div));
    return div;
}

export function renderCategoryFilters(categoryFilters, categories, onFilterFrames) {
    categories.forEach((category, index) => {
        const button = document.createElement('button');
        button.className = `category-filter ${index === 0 ? 'active' : ''}`;
        button.textContent = category;
        button.addEventListener('click', () => onFilterFrames(category, button));
        categoryFilters.appendChild(button);
    });
}

export function filterFrameCards(category, button) {
    document.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.frame-card').forEach(card => {
        if (category === 'Todas' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

export function renderFrameGrid(frameGrid, frames, selectedPhoto, onSelectFrame) {
    frameGrid.innerHTML = '';

    frames.forEach(frame => {
        const frameCard = createFrameCard(frame, selectedPhoto, onSelectFrame);
        frameGrid.appendChild(frameCard);
    });
}
