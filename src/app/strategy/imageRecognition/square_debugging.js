/*globals require, module, console*/
var util = require('faceCentering/util/util');

function plotSquare(imageElement, x, y, w, h) {
    'use strict';
    var rect = document.createElement('div');
    document.querySelector(imageElement.imageClassName).appendChild(rect);
    console.log(x + ',' + y + ',' + w + ',' + h);
    console.log(imageElement);
    console.log(util.getProperties(imageElement.elementContainingImage[0]));
    rect.classList.add('rect');
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    rect.style.left = (x) + 'px';
    rect.style.top = (y) + 'px';
}

module.exports = {
    plotSquare: plotSquare
};