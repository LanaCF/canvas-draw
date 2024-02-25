const doc = document;

const saveBtn = doc.querySelector('.save-btn');
const undoBtn = doc.querySelector('.undo');
const clearBtn = doc.querySelector('.clear');
const colorSelectors = doc.querySelectorAll('.color');
const colorPicker = doc.querySelector('.color-picker');
const penRange = doc.querySelector('.pen-range');
const loadBtn = doc.querySelector('.load');

const canvas = doc.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const cw = canvas.width;
const ch = canvas.height;

let dBg = 'white';
let dColor = 'black';
let dPenW = '2';
let isDrawing = false;
let history = [];
let index = -1;

main();

async function main() {
    clearCanvas();

    canvas.addEventListener('mousedown', start, false);
    canvas.addEventListener('mousemove', draw, false);
    canvas.addEventListener('mouseup', stop, false);
    canvas.addEventListener('mouseout', stop, false);

    undoBtn.onclick = undo;
    clearBtn.onclick = clearCanvas;
    colorSelectors.forEach(selector => selector.addEventListener('click', changeColor));
    colorPicker.addEventListener('change', changeColor);
    penRange.addEventListener('change', changePenWidth);
    loadBtn.addEventListener('click', loadFromFile);
}

// FUNCTIONS

function undo() {
    if (index <= 0) {
        clearCanvas();
        return;
    }

    index -= 1;
    history.pop();
    ctx.putImageData(history[index], 0, 0);
}

function start(e) {
    isDrawing = true;
    const dx = e.clientX - canvas.offsetLeft;
    const dy = e.clientY - canvas.offsetTop;

    ctx.beginPath();
    ctx.moveTo(dx, dy);
}

function draw(e) {
    if (!isDrawing) {
        return;
    }

    const dx = e.clientX - canvas.offsetLeft;
    const dy = e.clientY - canvas.offsetTop;

    ctx.lineTo(dx, dy);
    ctx.strokeStyle = dColor;
    ctx.lineWidth = dPenW;
    ctx.lineCape = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

function stop(e) {
    if (!isDrawing) {
        return;
    }

    ctx.stroke();
    ctx.closePath();
    isDrawing = false;

    const imgData = ctx.getImageData(0, 0, cw, ch);
    history.push(imgData);
    index ++;

    prepareSaveaveToFile();
}

function clearCanvas() {
    ctx.fillStyle = dBg;
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillRect(0, 0, cw, ch);

    history = [];
    index = -1;
}

function prepareSaveaveToFile() {
    const dataUrl = canvas.toDataURL('image/jpg');
    saveBtn.href = dataUrl;
    saveBtn.download = 'myImage.jpg';
}

function changeColor(e) {
    const newColor = e.target.style.background || e.target.value;
    dColor = newColor;
}

function changePenWidth(e) {
    dPenW = e.target.value;
}

function loadFromFile() {
    const fileInput = doc.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = function () {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                clearCanvas();
                ctx.drawImage(img, 0, 0);
            };
            img.src = event.target.result;
        };
    };
    fileInput.click();
}













// function loadImage(src) {
//     return new Promise((resolve) => {
//         const image = new Image();
//         image.src = src;

//         image.onload = () => resolve(image)
//     });
// }