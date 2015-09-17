vertex = require('./vertex');


function ParallelogramVertexSet(width, height) {
    this.OO = new vertex.Vertex2D(0, 0);
    this.OA = new vertex.Vertex2D(0 + width, 0);
    this.OB = new vertex.Vertex2D(0, 0 + height);
    this.OC = new vertex.Vertex2D(0 + width, 0 + height);
    this.equals = function(other) {
        return other.OO.equals(this.OO) && other.OA.equals(this.OA) && other.OB.equals(this.OB) && other.OC.equals(this.OC);
    };
    this.copy = function(other) {
        this.OO.copy(other.OO);
        this.OA.copy(other.OA);
        this.OB.copy(other.OB);
        this.OC.copy(other.OC);
    }
}


/* @class Parallelogram with the following
 vertices
 OO _______ OA
 |       |
 |_______|
 OB         OC */
function Parallelogram(width, height) {
    this.width = width;
    this.height = height;
    this.vertices = new ParallelogramVertexSet(width, height);
    this.__previousStateVertices = new ParallelogramVertexSet(width, height);
}

Parallelogram.prototype.resetVertices = function() {
    if(!this.vertices.equals(this.__previousStateVertices)){
        var localCopy = new ParallelogramVertexSet(this.width, this.height);
        localCopy.copy(this.vertices);
        this.vertices.copy(this.__previousStateVertices);
        this.__previousStateVertices.copy(localCopy);
    }
};

Parallelogram.prototype.backupVertices = function (vertices) {
    if(!this.__previousStateVertices.equals(vertices)){
        this.__previousStateVertices.copy(vertices);
    }
};

module.exports = {
    Parallelogram: Parallelogram
};