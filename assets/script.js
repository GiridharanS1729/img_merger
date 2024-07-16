document.getElementById('dropZone').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', handleFiles);
const dropZone = document.getElementById('dropZone');

// Prevent default behavior for drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop zone when dragging over
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

// Unhighlight drop zone when dragging leaves
['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

dropZone.addEventListener('drop', handleDrop);

document.getElementById('mergeHorizontallyBtn').addEventListener('click', () => mergeImages('horizontal'));
document.getElementById('mergeVerticallyBtn').addEventListener('click', () => mergeImages('vertical'));

function preventDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
}

function highlight() {
    dropZone.classList.add('highlight');
}

function unhighlight() {
    dropZone.classList.remove('highlight');
}

let selectedFiles = [];

function handleFiles() {
    const input = document.getElementById('fileInput');
    processFiles(input.files);
}

function handleDrop(event) {
    const dt = event.dataTransfer;
    const files = dt.files;
    processFiles(files);
}

function processFiles(files) {
    selectedFiles = [];
    const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
    for (let i = 0; i < files.length; i++) {
        if (validExtensions.includes(files[i].type)) {
            selectedFiles.push(files[i]);
        } else {
            alert('Invalid file type. Only .png, .jpg, and .jpeg are accepted.');
        }
    }
}

function mergeImages(direction) {
    if (selectedFiles.length === 0) {
        alert('Please select images to merge.');
        return;
    }

    const images = [];
    let loadedImages = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function () {
                images.push(img);
                loadedImages++;
                if (loadedImages === selectedFiles.length) {
                    if (direction === 'horizontal') {
                        drawHorizontalImage(images);
                    } else {
                        drawVerticalImage(images);
                    }
                }
            }
        };
        reader.readAsDataURL(selectedFiles[i]);
    }
}

function drawHorizontalImage(images) {
    const canvas = document.createElement('canvas');
    let totalWidth = 0, maxHeight = 0;

    images.forEach(img => {
        totalWidth += img.width;
        maxHeight = Math.max(maxHeight, img.height);
    });

    canvas.width = totalWidth;
    canvas.height = maxHeight;
    const ctx = canvas.getContext('2d');

    let offsetX = 0;
    images.forEach(img => {
        ctx.drawImage(img, offsetX, 0);
        offsetX += img.width;
    });

    const resultDiv = document.getElementById('horizontalResult');
    const imageContainer = resultDiv.querySelector('.image-container');
    imageContainer.innerHTML = '';
    const mergedImg = new Image();
    mergedImg.src = canvas.toDataURL();
    imageContainer.appendChild(mergedImg);

    const downloadBtn = document.getElementById('downloadHorizontalBtn');
    downloadBtn.style.display = 'block';
    downloadBtn.href = mergedImg.src;
    downloadBtn.download = 'horizontally_merged_image.png';
}

function drawVerticalImage(images) {
    const canvas = document.createElement('canvas');
    let totalHeight = 0, maxWidth = 0;

    images.forEach(img => {
        totalHeight += img.height;
        maxWidth = Math.max(maxWidth, img.width);
    });

    canvas.width = maxWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');

    let offsetY = 0;
    images.forEach(img => {
        ctx.drawImage(img, 0, offsetY);
        offsetY += img.height;
    });

    const resultDiv = document.getElementById('verticalResult');
    const imageContainer = resultDiv.querySelector('.image-container');
    imageContainer.innerHTML = '';
    const mergedImg = new Image();
    mergedImg.src = canvas.toDataURL();
    imageContainer.appendChild(mergedImg);

    const downloadBtn = document.getElementById('downloadVerticalBtn');
    downloadBtn.style.display = 'block';
    downloadBtn.href = mergedImg.src;
    downloadBtn.download = 'vertically_merged_image.png';
}
