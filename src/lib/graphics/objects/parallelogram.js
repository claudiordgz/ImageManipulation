/*globals require, module*/
var vertex = require('./vertex');

/* @class FaceContainer
 * @constructor
 * A Parallelogram Vertex set is a set of points that
 * together form a Parallelogram
 * @property {number} OO The width of the image from the source before any transformation
 * @property {number} OA The height of the image from the source before any transformation
 * @property {number} OB The class name style we have to alter
 * @property {number} OC The dom object that contains the image background
 * @param {number} width The width of the parallelogram
 * @param {number} height The height of the parallelogram
 */
function ParallelogramVertexSet(width, height) {
    'use strict';
    this.pMembers = ['OO','OA','OB','OC'];
    this.OO = new vertex.Vertex2D(0, 0);
    this.OA = new vertex.Vertex2D(0 + width, 0);
    this.OB = new vertex.Vertex2D(0, 0 + height);
    this.OC = new vertex.Vertex2D(0 + width, 0 + height);
}

/* @class FaceContainer
 * @constructor
 * A Parallelogram Vertex set is a set of points that
 * together form a Parallelogram
 * @property {number} OO The width of the image from the source before any transformation
 * @property {number} OA The height of the image from the source before any transformation
 * @property {number} OB The class name style we have to alter
 * @property {number} OC The dom object that contains the image background
 * @param {number} X1 first vertex x axis coordinate
 * @param {number} X2 second vertex x axis coordinate
 * @param {number} Y1 first vertex y axis coordinate
 * @param {number} Y2 second vertex y axis coordinate
 */
function ParallelogramVertexSetFromVertices(X1, X2, Y1, Y2) {
    'use strict';
    this.pMembers = ['OO','OA','OB','OC'];
    this.OO = new vertex.Vertex2D(X1, Y1);
    this.OA = new vertex.Vertex2D(X2, Y1);
    this.OB = new vertex.Vertex2D(X1, Y2);
    this.OC = new vertex.Vertex2D(X2, Y2);
}


/* @public
 * @function equals
 * Check if two objects of ParallelogramVertexSet are equal
 * @memberOf ParallelogramVertexSet
 */
ParallelogramVertexSet.prototype.equals = function(other) {
    return other.OO.equals(this.OO) && other.OA.equals(this.OA) && other.OB.equals(this.OB) && other.OC.equals(this.OC);
};

/* @public
 * @function copy
 * Copy constructor
 * @memberOf ParallelogramVertexSet
 */
ParallelogramVertexSet.prototype.copy = function(other) {
    this.OO.copy(other.OO);
    this.OA.copy(other.OA);
    this.OB.copy(other.OB);
    this.OC.copy(other.OC);
};


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
    this.vertices = new ParallelogramVertexSet(width, height);
    this.__previousStateVertices = new ParallelogramVertexSet(width, height);
}

Parallelogram.prototype.resetVertices = function() {
    'use strict';
    if(!this.vertices.equals(this.__previousStateVertices)){
        var localCopy = new ParallelogramVertexSet(this.width, this.height);
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
    Parallelogram: Parallelogram,
    ParallelogramVertexSetFromVertices: ParallelogramVertexSetFromVertices
};