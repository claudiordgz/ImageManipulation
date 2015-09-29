/*globals require, module*/
var vertices = require('./parallelogramVertexSet');


/* @class Parallelogram with the following
 vertices
 OO _______ OA
 |       |
 |_______|
 OB         OC
 * @public @property {number} width
 * @public @property {number} height
 * @public @property {ParallelogramVertexSet} vertices The points in space of our rectangle
 * @private @property {ParallelogramVertexSet} __previousStateVertices
 */
function Parallelogram(width, height) {
    'use strict';
    this.width = width;
    this.height = height;
    this.vertices = new vertices.ParallelogramVertexSet().fromWidthAndHeight(width, height);
    this.__previousStateVertices = new vertices.ParallelogramVertexSet().fromWidthAndHeight(width, height);
}

Parallelogram.prototype.resetVertices = function() {
    'use strict';
    if(!this.vertices.equals(this.__previousStateVertices)){
        var localCopy = new vertices.ParallelogramVertexSet().fromWidthAndHeight(this.width, this.height);
        localCopy.copy(this.vertices);
        this.vertices.copy(this.__previousStateVertices);
        this.__previousStateVertices.copy(localCopy);
    }
};

Parallelogram.prototype.backupVertices = function (vertices) {
    'use strict';
    if(!this.__previousStateVertices.equals(vertices)){
        this.__previousStateVertices.copy(vertices);
    }
};

module.exports = {
    Parallelogram: Parallelogram
};