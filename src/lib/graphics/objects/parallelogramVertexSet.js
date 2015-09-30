/*globals require, module*/
var vertex = require('./vertex');


/* @class ParallelogramVertexSet
 * @constructor
 * A Parallelogram Vertex set is a set of points that
 * together form a Parallelogram
 * @property {number} A Top Right corner
 * @property {number} B Top Left corner
 * @property {number} C Lower Right corner
 * @property {number} D Lower Left corner
 */
function ParallelogramVertexSet() {
    'use strict';
    this.pMembers = ['A','B','C','D'];
    this.A = new vertex.Vertex2D(0, 0);
    this.B = new vertex.Vertex2D(0, 0);
    this.C = new vertex.Vertex2D(0, 0);
    this.D = new vertex.Vertex2D(0, 0);
}

/* @class ParallelogramVertexSet
 * @constructor
 * A Parallelogram Vertex constructed from width and height
 * @param {number} width The width of the parallelogram
 * @param {number} height The height of the parallelogram
 */
ParallelogramVertexSet.prototype.fromWidthAndHeight = function(width, height) {
    'use strict';
    this.A.reset(0, 0);
    this.B.reset(0 + width, 0);
    this.C.reset(0, 0 + height);
    this.D.reset(0 + width, 0 + height);
    return this;
};

/* @class ParallelogramVertexSet
 * @constructor
 * A Parallelogram Vertex constructed from coordinates
 * @param {number} X1 first vertex x axis coordinate
 * @param {number} X2 second vertex x axis coordinate
 * @param {number} Y1 first vertex y axis coordinate
 * @param {number} Y2 second vertex y axis coordinate
 */
ParallelogramVertexSet.prototype.fromVertices = function(X1, X2, Y1, Y2) {
    'use strict';
    this.A.reset(X1, Y1);
    this.B.reset(X2, Y1);
    this.C.reset(X1, Y2);
    this.D.reset(X2, Y2);
    return this;
};


/* @public
 * @function equals
 * Check if two objects of ParallelogramVertexSet are equal
 * @memberOf ParallelogramVertexSet
 */
ParallelogramVertexSet.prototype.equals = function(other) {
    "use strict";
    return other.A.equals(this.A) && other.B.equals(this.B) && other.C.equals(this.C) && other.D.equals(this.D);
};

/* @public
 * @function copy
 * Copy constructor
 * @memberOf ParallelogramVertexSet
 */
ParallelogramVertexSet.prototype.copy = function(other) {
    'use strict';
    this.A.copy(other.A);
    this.B.copy(other.A);
    this.C.copy(other.C);
    this.D.copy(other.D);
};

module.exports = {
    ParallelogramVertexSet: ParallelogramVertexSet
};