parallelogram = require('./parallelogram');

FaceContainer.prototype = Object.create(parallelogram.Parallelogram.prototype);
FaceContainer.prototype.constructor = FaceContainer;

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
    var vectorOriginOO = this.vertices.OO.x;
};

module.exports = {
    FaceContainer: FaceContainer
};