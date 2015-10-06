/*globals require, module*/
var vertices = require('./parallelogramVertexSet');
var vectorOps = require('../utilities/vectorOperations');

/**
 * @typedef {Object<string,Victor>} ParallelogramVectors
 * @property {Victor} AB Vector from A to B
 * @property {Victor} AD Vector from A to D
 */

/* @class Parallelogram with the following
 vertices
 A _______ B
  |       |
  |_______|
 D         C
 * @public @property {number} width
 * @public @property {number} height
 * @public @property {ParallelogramVertexSet} vertices The points in space of our rectangle
 * @private @property {ParallelogramVertexSet} __previousStateVertices
 */
function Parallelogram() {
    'use strict';
    this.width = 0;
    this.height = 0;
    this.vertices = new vertices.ParallelogramVertexSet();
    this.__previousStateVertices = new vertices.ParallelogramVertexSet();
    this.__isReady = false;
}

/** @function innerVectors
 * Whatever vectors we need to do our algorithm to find a point inside
 * the Parallelogram
 * (0<AM⋅AB<AB⋅AB)∧(0<AM⋅AD<AD⋅AD)
 * @return {ParallelogramVectors}
 */
Parallelogram.prototype.innerVectors = function(){
    'use strict';
    this.AB = vectorOps.getVector(this.vertices.A,  this.vertices.B);
    this.AD = vectorOps.getVector(this.vertices.A,  this.vertices.D);
    this.__isReady = true;
};

Parallelogram.prototype.area = function(){
    'use strict';
    return this.width * this.height;
};


/** @function isPointInside
 * Check if point is inside the parallelogram
 * (0<AM⋅AB<AB⋅AB)∧(0<AM⋅AD<AD⋅AD)
 * NOTE: If it touches the edges it will return true
 * @param {Point} point The point we want to check if it is inside or not
 * @return {Boolean} Whether it is inside or not
 */
Parallelogram.prototype.isPointInside = function(point){
    'use strict';
    var returnValue = false;
    if(this.__isReady) {
        var AM = vectorOps.getVector(this.vertices.A, point);
        var AMAB = AM.dot(this.AB);
        var ABAB = this.AB.dot(this.AB);
        var AMAD = AM.dot(this.AD);
        var ADAD = this.AD.dot(this.AD);
        if(((0 <= AMAB) && (AMAB <= ABAB)) && ((0 <= AMAD) && (AMAD <= ADAD))) {
            returnValue = true;
        }
    } else {
        this.innerVectors();
        returnValue = this.isPointInside(point);
    }
    return returnValue;
};


/* @class Parallelogram with the following
 * @constructor
 * @param {number} width The width of the parallelogram
 * @param {number} height The height of the parallelogram
 */
Parallelogram.prototype.fromWidthAndHeight = function(width, height) {
    'use strict';
    this.width = width;
    this.height = height;
    this.vertices.fromWidthAndHeight(width, height);
    this.__previousStateVertices.fromWidthAndHeight(width, height);
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
    this.vertices.fromVertices(X1, X2, Y1, Y2);
    this.__previousStateVertices.fromVertices(X1, X2, Y1, Y2);
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
