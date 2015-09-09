
function plotSquare(imageElement, className, x, y, w, h) {
    var rect = document.createElement('div');
    document.querySelector(className).appendChild(rect);
    rect.classList.add('rect');
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    console.log(imageElement.offsetLeft + ' ' + imageElement.offsetTop);
    rect.style.left = (imageElement.offsetLeft + x) + 'px';
    rect.style.top = (imageElement.offsetTop + y) + 'px';
}

module.exports = {
    plotSquare: plotSquare
};