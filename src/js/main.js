const textInput = document.getElementById('textInput');
const closeInputBtn = document.getElementById('closeText');
const addTextBtn = document.getElementById('addTextBtn');
const resteBtn = document.getElementById('reset');
const allSizeBtn = document.querySelectorAll('.size-btn');
const allThicknessBtn = document.querySelectorAll('.thickness-btn');
const downloadBtn = document.getElementById('downloadBtn');
const collagePhoto = document.querySelector('.collage-frame');
const iminus = document.getElementById('iminus');
const iplus = document.getElementById('iplus');
const fontFamilyOptions = document.getElementById('fontStyleSelect');
let uploadedImagesCount = 0;
let totalImages = 0;
let activeTextBox = null;

document.querySelectorAll(".small-img, .big-img").forEach((slot) => {
    totalImages = document.querySelectorAll(".small-img, .big-img").length;

    const input = slot.querySelector("input");
    const placeholder = slot.querySelector("p");
    const previewImage = slot.querySelector("img");

    slot.addEventListener("click", () => {
        input.click();
    });

    input.addEventListener("change", () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImage.src = reader.result;
                previewImage.style.display = "block";
                placeholder.style.display = "none";
                input.disabled = true;
                setActiveImage(previewImage);
                incrementUploadedImages();
            };
            reader.readAsDataURL(file);
        }
    });

    previewImage.addEventListener("click", () => {
        setActiveImage(previewImage);
    });

});

function incrementUploadedImages() {
    uploadedImagesCount++;
    if (totalImages === uploadedImagesCount) {
        downloadBtn.style.display = "block";
    }
}

function setActiveImage(imageElement) {
    removeExistingHandles();
    makeDraggable(imageElement, { resize: 'resize', rotate: 'rotate' });
    addResizeHandle(imageElement);
    addRotateHandle(imageElement);
}

function removeExistingHandles() {
    document.querySelectorAll(".resize, .rotate").forEach((handle) => handle.remove());
}

function addResizeHandle(imageElement) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize';
    resizeHandle.innerHTML = '+';

    collagePhoto.style.position = 'relative';
    collagePhoto.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const initialWidth = imageElement.offsetWidth;
        const initialMouseX = e.clientX;

        function resize(e) {
            const newWidth = initialWidth + (e.clientX - initialMouseX);
            imageElement.style.width = newWidth + 'px';
        }

        function stopResizing() {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResizing);
        }

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
    });
}

function addRotateHandle(imageElement) {
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'rotate';
    rotateHandle.innerHTML = '&#8635;';

    collagePhoto.style.position = 'relative';
    collagePhoto.appendChild(rotateHandle);

    rotateHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const rect = imageElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function rotate(e) {
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const degree = (angle * (180 / Math.PI)) % 360;
            imageElement.style.transform = `rotate(${degree}deg)`;
        }

        function stopRotating() {
            document.removeEventListener('mousemove', rotate);
            document.removeEventListener('mouseup', stopRotating);
        }

        document.addEventListener('mousemove', rotate);
        document.addEventListener('mouseup', stopRotating);
    });
}

//=======================================================
// Add text functionality
//=======================================================

function updatePreview() {
    if (activeTextBox) {
        const text = document.getElementById('textInput').value || 'New Custom Text';
        const textColor = document.getElementById('textColor').value;

        activeTextBox.innerText = text;
        activeTextBox.style.color = textColor;
        attachHandles(activeTextBox);
    }
}

function attachHandles(element) {
    if (!element.querySelector('.resize-handle')) {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.right = '-11.3px';
        resizeHandle.style.bottom = '-6.5px';
        resizeHandle.style.fontSize = '24px';
        resizeHandle.style.cursor = 'crosshair';
        resizeHandle.innerText = '+';
        resizeHandle.style.display = 'none';

        element.appendChild(resizeHandle);

        resizeHandle.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            const initialWidth = element.offsetWidth;
            const initialMouseX = e.clientX;

            function resize(e) {
                const newSize = initialWidth + (e.clientX - initialMouseX);
                element.style.fontSize = newSize + 'px';
            }
            function stopResizing() {
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResizing);
            }

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResizing);
        });
    }

    if (!element.querySelector('.rotate-handle')) {
        const rotateHandle = document.createElement('div');
        rotateHandle.className = 'rotate-handle';
        rotateHandle.style.position = 'absolute';
        rotateHandle.style.top = '-30px';
        rotateHandle.style.left = '50%';
        rotateHandle.style.transform = 'translateX(-50%)';
        rotateHandle.style.cursor = 'pointer';
        rotateHandle.style.fontSize = '24px';
        rotateHandle.innerHTML = '&#8635;';
        rotateHandle.style.display = 'none';

        element.appendChild(rotateHandle);

        rotateHandle.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            function rotate(e) {
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                const degree = (angle * (180 / Math.PI) + 90) % 360;
                element.style.transform = `translate(-50%, -50%) rotate(${degree}deg)`;
            }

            function stopRotating() {
                document.removeEventListener('mousemove', rotate);
                document.removeEventListener('mouseup', stopRotating);
            }

            document.addEventListener('mousemove', rotate);
            document.addEventListener('mouseup', stopRotating);
        });
    }
}

function makeDraggable(element, handle) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('click', function (e) {
        const resizeHandle = document.querySelector(`.${handle.resize}`);
        const rotateHandle = document.querySelector(`.${handle.rotate}`);

        if (resizeHandle && rotateHandle) {
            resizeHandle.style.display = 'block';
            rotateHandle.style.display = 'block';
        }

        element.style.border = '2px dashed #248EE6';
    })
    element.addEventListener('mousedown', function (e) {
        const resizeHandle = document.querySelector(`.${handle.resize}`);
        const rotateHandle = document.querySelector(`.${handle.rotate}`);

        if (resizeHandle && rotateHandle) {
            resizeHandle.style.display = 'block';
            rotateHandle.style.display = 'block';
        }
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';

    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            element.style.left = e.clientX - offsetX + 'px';
            element.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        element.style.cursor = 'move';
    });

    document.addEventListener('mousedown', function (e) {
        if (!element.contains(e.target)) {
            element.style.border = 'none';

            const resizeHandle = document.querySelector(`.${handle.resize}`);
            const rotateHandle = document.querySelector(`.${handle.rotate}`);

            if (resizeHandle) resizeHandle.style.display = 'none';
            if (rotateHandle) rotateHandle.style.display = 'none';
        }
    });
}

document.getElementById('addTextBtn').addEventListener('click', function () {
    textInput.style.display = 'block';
    closeInputBtn.style.display = 'block';
    fontFamilyOptions.style.display = 'block';
    if (!activeTextBox) {
        const textColor = document.getElementById('textColor').value;

        activeTextBox = document.createElement('div');
        activeTextBox.className = 'text-box';
        activeTextBox.innerText = 'New Custom Text';
        activeTextBox.style.color = textColor;
        document.querySelector('.collage-frame').appendChild(activeTextBox);

        attachHandles(activeTextBox);
        makeDraggable(activeTextBox, { resize: 'resize-handle', rotate: 'rotate-handle' });
    }
});

document.getElementById('closeText').addEventListener('click', function () {
    const previewText = document.querySelector('.text-box.preview');
    if (previewText) previewText.remove();
    document.getElementById('textInput').value = '';
    if (activeTextBox) {
        activeTextBox.remove();
        activeTextBox = null;
        document.getElementById('textInput').value = '';
    }
    textInput.style.display = 'none';
    closeInputBtn.style.display = 'none';
});

allSizeBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        allSizeBtn.forEach(button => button.classList.remove('active'));
        this.classList.add('active');
    });
});

allThicknessBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        allThicknessBtn.forEach(button => button.classList.remove('active'));
        this.classList.add('active');
    });
});

downloadBtn.addEventListener('click', () => {
    html2canvas(collagePhoto, { backgroundColor: null }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'customized-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

iminus.addEventListener('click', function () {
    if (activeTextBox) {
        const currentFontSize = parseInt(window.getComputedStyle(activeTextBox).fontSize);
        activeTextBox.style.fontSize = (currentFontSize - 5) + 'px';
        attachHandles(activeTextBox);
    }
});

iplus.addEventListener('click', function () {
    if (activeTextBox) {
        const currentFontSize = parseInt(window.getComputedStyle(activeTextBox).fontSize);
        activeTextBox.style.fontSize = (currentFontSize + 5) + 'px';
        attachHandles(activeTextBox);
    }
});

function changeFontFamily() {
    const selectedFont = document.getElementById('fontStyleSelect').value;
    if (activeTextBox) {
        activeTextBox.style.fontFamily = selectedFont;
    }
}

resteBtn.addEventListener('click', () => {
    location.reload();
});