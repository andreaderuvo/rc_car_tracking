
async function loadImage(url, imageElement) {
    return new Promise((resolve, reject) => {
        imageElement.removeAttribute('height');
        imageElement.removeAttribute('width');
        imageElement.onload = () => resolve(imageElement);
        imageElement.onerror = reject;
        imageElement.src = url;
    });
}