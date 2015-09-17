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

module.exports = {
    FaceContainer: FaceContainer
};