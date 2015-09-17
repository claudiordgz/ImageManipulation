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

function isPointInsideSpace() {

}

function trackingJsFromLocalImage(imageElement, imageContainer, imgUrl,  width, height, imgClass) {
    var tracker = new tracking.ObjectTracker(['face']);
    tracker.sourceElement = new ImagePack(width, height, '.' + imgClass, imageContainer);
    tracker.setStepSize(1.7);
    tracking.track(imageElement, tracker);
    tracker.on('track', function(event) {
        if (event.data.length === 0) {
            console.log('No elements found');
        } else {
            var faces = [];
            for(var i = 0; i != event.data.length; ++i) {
                var data = event.data[i];
                var rectangle = new Parallelogram(data.width, data.height);
                rectangle.offsetX = data.x;
                rectangle.offsetY = data.y;
                rectangle.sourceWidth = this.sourceElement.width;
                rectangle.sourceHeight = this.sourceElement.height;
                var containerProperties = util.getProperties(this.sourceElement.elementContainingImage[0]);
                rectangle.targetWidth = containerProperties.width;
                rectangle.targetHeight = containerProperties.height;
                faces.push(rectangle);
            }
            console.log(faces);
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