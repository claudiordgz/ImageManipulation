/*globals require, module*/
var parallelogram = require('./parallelogram');

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
    'use strict';
    parallelogram.Parallelogram.call(this);
    this.fromWidthAndHeight(width, height);
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.sourceWidth = imageWidth;
    this.sourceHeight = imageHeight;
    this.targetWidth = containerWidth;
    this.targetHeight = containerHeight;
}

function recalculateVertices(parallelogramVertexSet, offsetX, offsetY) {
    'use strict';
    for (var i=0; i!==parallelogramVertexSet.pMembers.length;++i) {
        var key = parallelogramVertexSet.pMembers[i];
        if (parallelogramVertexSet[key] !== undefined) {
            parallelogramVertexSet[key].x += offsetX;
            parallelogramVertexSet[key].y += offsetY;
        }
    }
}

FaceContainer.prototype.recalculateVerticesWithOffset = function() {
    'use strict';
    this.backupVertices(this.vertices);
    recalculateVertices(this.vertices, this.offsetX, this.offsetY);
};

FaceContainer.prototype.copy = function() {
    'use strict';
    return new FaceContainer(this.width, this.height, this.offsetX, this.offsetY,
        this.sourceWidth, this.sourceHeight,
        this.targetWidth, this.targetHeight);
};

FaceContainer.prototype.getOrientation = function() {
    'use strict';
    var orientation = 'square';
    if (this.sourceWidth > this.sourceHeight) {
        orientation = 'landscape';
    } else if (this.sourceWidth < this.sourceHeight) {
        orientation = 'portrait';
    }
    return orientation;
};

module.exports = {
    FaceContainer: FaceContainer
};