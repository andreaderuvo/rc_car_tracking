getMousePos = (canvas, zoom, event) => {
    var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width / zoom,
        scaleY = canvas.height / rect.height / zoom;
    return {
        x: (event.clientX - rect.left),
        y: (event.clientY - rect.top)
    }
}