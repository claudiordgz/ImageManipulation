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
    this.equals = function(other) {
        return other.x == this.x && other.y == this.y;
    };
}

function ParallelogramVertexSet(width, height) {
    this.OO = new Vertex2D(0, 0);
    this.OA = new Vertex2D(0 + width, 0);
    this.OB = new Vertex2D(0, 0 + height);
    this.OC = new Vertex2D(0 + width, 0 + height);
    this.equals = function(other) {
        return other.OO.equals(this.OO) && other.OA.equals(this.OA) && other.OB.equals(this.OB) && other.OC.equals(this.OC);
    };
}

function recalculateVertices(parallelogramVertexSet, offsetX, offsetY) {
    for (var key in parallelogramVertexSet) {
        if (parallelogramVertexSet.hasOwnProperty(key)) {
            parallelogramVertexSet[key].x += offsetX;
            parallelogramVertexSet[key].y += offsetY;
        }
    }
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
    this.vertices = new ParallelogramVertexSet(width, height);
    this.__previousStateVertices = null;
    this.resetVertices = function() {
        this.vertices = this.__previousStateVertices;
    };
}

/*
 */
function setupImageFaceInsideContainer(width, height, offsetX, offsetY,
                                       imageWidth, imageHeight,
                                       containerWidth, containerHeight){
    var rectangle = new Parallelogram(width, height);
    rectangle.offsetX = offsetX;
    rectangle.offsetY = offsetY;
    rectangle.sourceWidth = imageWidth;
    rectangle.sourceHeight = imageHeight;
    rectangle.targetWidth = containerWidth;
    rectangle.targetHeight = containerHeight;
    rectangle.recalculateVerticesWithOffset = function() {
        if(!this.__previousStateVertices.equals(this.vertices)){
            this.__previousStateVertices = this.vertices;
        }
        for (var key in this.vertices) {
            if (this.vertices.hasOwnProperty(key)) {
                recalculateVertices(this.vertices, this.offsetX, this.offsetY);
            }
        }

    };
    rectangle.recalculateVerticesWithOffset();
    return rectangle;
}

function isPointInsideSpace() {

}

function calculateOverlay(){

}

function faceTracking(event, imagePack){
    var faces = [];
    for(var i = 0; i != event.data.length; ++i) {
        var data = event.data[i];
        var containerProperties = util.getProperties(imagePack.elementContainingImage[0]);
        faces.push(setupImageFaceInsideContainer(data.width, data.height, data.x, data.y,
            imagePack.width,imagePack.height,
            containerProperties.width, containerProperties.height));
    }

    console.log(faces);
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
            faceTracking(event, this.sourceElement);
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