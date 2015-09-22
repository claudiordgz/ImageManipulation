parallelogram = require('./parallelogram');

FaceContainer.prototype = Object.create(parallelogram.Parallelogram.prototype);
FaceContainer.prototype.constructor = FaceContainer;

/* @class FaceContainer
 * As it name implies a vertex or point
 * structure for 2 Dimensional Polygons
 * @property {number} width The width of the image from the source before any transformation
 * @property {number} height The height of the image from the source before any transformation
 * @property {string} imageClassName The class name style we have to alter
 * @property {Object} elementContainingImage The dom object that contains the image background
 * */
function FaceContainer(width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight) {
    parallelogram.Parallelogram.call(this, width, height);
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.sourceWidth = imageWidth;
    this.sourceHeight = imageHeight;
    this.targetWidth = containerWidth;
    this.targetHeight = containerHeight;
}

function recalculateVertices(parallelogramVertexSet, offsetX, offsetY) {
    for (var i=0; i!=parallelogramVertexSet.pMembers.length;++i) {
        var key = parallelogramVertexSet.pMembers[i];
        if (parallelogramVertexSet.hasOwnProperty(key)) {
            parallelogramVertexSet[key].x += offsetX;
            parallelogramVertexSet[key].y += offsetY;
        }
    }
}

FaceContainer.prototype.recalculateVerticesWithOffset = function() {
    this.backupVertices(this.vertices);
    recalculateVertices(this.vertices, this.offsetX, this.offsetY);
};

FaceContainer.prototype.copy = function() {
    return new FaceContainer(this.width, this.height, this.offsetX, this.offsetY,
        this.sourceWidth, this.sourceHeight,
        this.targetWidth, this.targetHeight);
};

FaceContainer.prototype.isFaceInsideImage = function() {

};

module.exports = {
    FaceContainer: FaceContainer
};