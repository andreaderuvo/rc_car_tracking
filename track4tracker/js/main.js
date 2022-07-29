document.addEventListener("DOMContentLoaded", function () {
    var fileSelector = document.getElementById('fileSelector');
    var canvas = document.getElementById('canvas');
    var imageElement = document.getElementById('img');
    var textareaElement = document.getElementById('textarea');
    var clearSelectionButton = document.getElementById("clearSelection");
    var nextImageButton = document.getElementById("nextImage");
    var previousImageButton = document.getElementById("previousImage");
    var clearSessionButton = document.getElementById("clearSession");
    var downloadLogButton = document.getElementById("downloadLog");

    // todo...
    /* 
        var zoomElement = document.getElementById("zoom");
        zoomElement.value;
    */

    var context = canvas.getContext('2d');
    var i = 0;
    var imageList;
    var log = {};
    var startX, startY;
    var isDown = false;
    var zoom = 1;

    var writeDebug = () => {
        if (log) {
            textareaElement.innerHTML = JSON.stringify(log, null, '\t');
        } else {
            textareaElement.innerHTML = '';
        }
    }

    if (sessionStorage && sessionStorage.getItem(SESSION_KEY)) {
        log = JSON.parse(sessionStorage.getItem(SESSION_KEY));
        writeDebug();
    }

    var writeLog = function (file, x, y, w, h) {
        log[file.name] = [x / zoom, y / zoom, w / zoom, h / zoom];
    }

    var updateRect = () => {
        session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
        if (session && session[imageList[i].name]) {
            obj = session[imageList[i].name];
            drawRect(obj[0], obj[1], obj[2], obj[3]);
        }
    }

    var readImage = (file) => {
        if (file.type && !file.type.startsWith('image/')) {
            console.log('File is not an image.', file.type, file);
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            (async () => {
                await loadImage(event.target.result, imageElement).then((imageElement) => {
                    canvas.width = imageElement.width * zoom;
                    canvas.height = imageElement.height * zoom;
                    imageElement.width = canvas.width;
                    imageElement.height = canvas.height;
                    updateRect();
                    updateStatus();
                });
            })();
        });
        reader.readAsDataURL(file);
    }

    function handleMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        coords = getMousePos(canvas, zoom, event);
        startX = coords.x;
        startY = coords.y;
        isDown = true;
    }

    function handleMouseUp(event) {
        event.preventDefault();
        event.stopPropagation();
        isDown = false;
    }

    function handleMouseOut(event) {
        event.preventDefault();
        event.stopPropagation();
        isDown = false;
    }

    function updateStatus() {
        document.getElementById("status").innerHTML = `Image (${imageList[i].name}) n. ${i + 1}/${imageList.length}`;
    }

    function handleMouseMove(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!isDown) {
            return;
        }
        coords = getMousePos(canvas, zoom, event);
        width = (coords.x - startX);
        height = (coords.y - startY);
        if (width < 0 || height < 0) {
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawRect(startX, startY, width, height);
        writeLog(imageList[i], startX, startY, width, height);
        writeSession(log);
        writeDebug();
    }

    var drawRect = (x, y, w, h, color = RECT_COLOR, width = RECT_WIDTH) => {
        context.strokeStyle = color;
        context.lineWidth = width;
        context.strokeRect(x, y, w, h);
    }

    /* zoomElement.addEventListener('change', (event) => {
          zoom = event.target.value;
    }); */

    clearSelectionButton.addEventListener('click', (event) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (imageList) {
            delete log[imageList[i].name];
            updateSession(imageList[i].name);
        }
        writeDebug();
    });

    clearSessionButton.addEventListener('click', (event) => {
        sessionStorage.removeItem(SESSION_KEY);
        writeDebug();
    });

    nextImageButton.addEventListener('click', (event) => {
        if (i < imageList.length - 1) {
            readImage(imageList[++i]);
        }
    });

    previousImageButton.addEventListener('click', (event) => {
        if (i > 0) {
            readImage(imageList[--i]);
        }
    });

    downloadLogButton.addEventListener('click', (event) => {
        download(textareaElement.innerHTML, DOWNLOAD_FILE_JSON)
    });

    fileSelector.addEventListener('change', (event) => {
        imageList = event.target.files;
        i = 0;
        readImage(imageList[i]);
    });

    canvas.addEventListener('mousedown', (event) => {
        handleMouseDown(event);
    });

    canvas.addEventListener('mousemove', (event) => {
        handleMouseMove(event);
    });

    canvas.addEventListener('mouseup', (event) => {
        handleMouseUp(event);
    });

    canvas.addEventListener('mouseout', (event) => {
        handleMouseOut(event);
    });
});