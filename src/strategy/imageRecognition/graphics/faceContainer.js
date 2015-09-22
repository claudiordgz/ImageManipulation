parallelogram = require('./parallelogram');

FaceContainer.prototype = Object.create(parallelogram.Parallelogram.prototype);
FaceContainer.prototype.constructor = FaceContainer;

/* @class FaceContainer
 * @constructor
 * @extends Parallelogram
 * As it name implies a vertex or point
 * structure for 2 Dimensional Polygons
 * @public @property {number} width (inherited)
 * @public @property {number} height (inherited)
 * @public @property {ParallelogramVertexSet} vertices The points in space of our rectangle (inherited)
 * @public @property {number} offsetX The offset in X-axis to the face in the natural size of the image
 * @public @property {number} offsetY The offset in Y-axis to the face in the natural size of the image
 * @public @property {number} sourceWidth Original natural width
 * @public @property {number} sourceHeight Original natural height
 * @public @property {number} targetWidth The container width in which we must fit the image
 * @public @property {number} targetHeight The container height in which we must fit the image
 * @private @property {ParallelogramVertexSet} __previousStateVertices
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