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
function Parallelogram() {
    'use strict';
    this.width = 0;
    this.height = 0;
}

/* @class Parallelogram with the following
 * @constructor
 * @param {number} width The width of the parallelogram
 * @param {number} height The height of the parallelogram
 */
Parallelogram.prototype.fromWidthAndHeight = function(width, height) {
    'use strict';
    this.width = width;
    this.height = height;
    this.vertices = new vertices.ParallelogramVertexSet().fromWidthAndHeight(width, height);
    this.__previousStateVertices = new vertices.ParallelogramVertexSet().fromWidthAndHeight(width, height);
    return this;
};

/* @class Parallelogram
 * @constructor
 * From 4 vertices generate a parallelogram
 * @param {number} X1 first vertex x axis coordinate
 * @param {number} X2 second vertex x axis coordinate
 * @param {number} Y1 first vertex y axis coordinate
 * @param {number} Y2 second vertex y axis coordinate
 */
Parallelogram.prototype.fromVertices = function(X1, X2, Y1, Y2) {
    'use strict';
    this.width = Math.abs(X2 - X1);
    this.height = Math.abs(Y2 - Y1);
    this.vertices = new vertices.ParallelogramVertexSet().fromVertices(X1, X2, Y1, Y2);
    this.__previousStateVertices = new vertices.ParallelogramVertexSet().fromVertices(X1, X2, Y1, Y2);
    return this;
};

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