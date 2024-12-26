const textInput = document.getElementById('textInput');
const closeInputBtn = document.getElementById('closeText');
const addTextBtn = document.getElementById('addTextBtn');
const resteBtn = document.getElementById('reset');
let activeTextBox = null;

document.querySelectorAll('.small-img, .big-img').forEach(slot => {
    const input = slot.querySelector('input');
    const placeholder = slot.querySelector('p');
    const previewImage = slot.querySelector('img');

    slot.addEventListener('click', () => {
        input.click();
    });

    input.addEventListener('change', () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImage.src = reader.result;
                previewImage.style.display = 'block';
                placeholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
            input.disabled = true;
            makeDraggable(previewImage, { resize: 'resize', rotate: 'rotate' });
            addResizeHandle(previewImage);

        }
    });
});

function addResizeHandle(imageElement) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '65%';
    resizeHandle.style.bottom = '20%';
    resizeHandle.style.cursor = 'nwse-resize';
    resizeHandle.innerText = '+';
    resizeHandle.style.color = 'blue';
    resizeHandle.style.backgroundColor = 'transparent';

    imageElement.appendChild(resizeHandle);

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
    rotateHandle.style.position = 'absolute';
    rotateHandle.style.top = '15%';
    rotateHandle.style.left = '20%';
    rotateHandle.style.transform = 'translateX(-50%)';
    rotateHandle.style.cursor = 'pointer';
    rotateHandle.innerHTML = '&#8635;';
    rotateHandle.style.color = 'blue';
    rotateHandle.style.backgroundColor = 'transparent';

    imageElement.appendChild(rotateHandle);

    rotateHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const rect = imageElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function rotate(e) {
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const degree = (angle * (180 / Math.PI) + 90) % 360;
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

    element.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';

        element.style.border = '2px dashed #248EE6';

        const resizeHandle = element.querySelector(`.${handle.resize}`);
        const rotateHandle = element.querySelector(`.${handle.rotate}`);

        if (resizeHandle && rotateHandle) {
            resizeHandle.style.display = 'block';
            rotateHandle.style.display = 'block';
        }
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

            const resizeHandle = element.querySelector(`.${handle.resize}`);
            const rotateHandle = element.querySelector(`.${handle.rotate}`);

            if (resizeHandle) resizeHandle.style.display = 'none';
            if (rotateHandle) rotateHandle.style.display = 'none';
        }
    });
}

document.getElementById('addTextBtn').addEventListener('click', function () {
    textInput.style.display = 'block';
    closeInputBtn.style.display = 'block';
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


