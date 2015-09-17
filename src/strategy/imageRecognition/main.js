util = require('../../util');
plot = require('./square_debugging');

function ImagePack (width, height, imageClassName, elementContainingImage) {
    this.width = width;
    this.height = height;
    this.imageClassName = imageClassName;
    this.elementContainingImage = elementContainingImage;
}

/* @class Vertex2D
    As it name implies a vertex structure
    for 2 Dimensional Polygons */
function Vertex2D(x, y) {
    this.x = x;
    this.y = y;
}

/* @class Parallelogram with the following
   vertices
  OO _______ OA
    |       |
    |_______|
  OB         OC */
function Parallelogram(width, height) {
    this.width = width;
    this.height = height;
    this.vertices = function() {
        var OO = new Vertex2D(0, 0), //Origin
            OA = new Vertex2D(0 + this.width, 0),
            OB = new Vertex2D(0, 0 + this.height),
            OC = new Vertex2D(0 + this.width, 0 + this.height);
        return [OO, OA, OB, OC]
    }
}

function isPointInsideSquare() {

}

function trackingJsFromLocalImage(imageElement, imageContainer, imgUrl,  width, height, imgClass) {
    var tracker = new tracking.ObjectTracker(['face']);
    tracker.sourceElement = new ImagePack(width, height, '.' + imgClass, imageContainer);
    tracker.setStepSize(1.7);
    tracking.track(imageElement, tracker);
    tracker.on('track', function(event) {
        event.sourceElement = this.sourceElement;
        if (event.data.length === 0) {
            console.log('No elements found');
        } else {
            event.data.forEach(function(rect) {
                console.log(event.sourceElement.imageClassName);
                plot.plotSquare(event.sourceElement, rect.x, rect.y, rect.width, rect.height);
            });
        }
    });
    return util.format('background-image: url(\'{0}\');  no-repeat center center fixed; \
        -webkit-background-size: cover; \
        -moz-background-size: cover; \
        -o-background-size: cover; \
        background-size: cover;', imgUrl);
}

module.exports = {
    policy: trackingJsFromLocalImage
};