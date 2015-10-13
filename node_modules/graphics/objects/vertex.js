/*globals module*/
/* @class Vertex2D
 * As it name implies a vertex or point
 * structure for 2 Dimensional Polygons
 * @property {number} x The x-axis position of the point
 * @property {number} y The y-axis position of the point
 * */
function Vertex2D(x, y) {
    'use strict';
    this.x = x;
    this.y = y;
    this.equals = function(other) {
        return other.x === this.x && other.y === this.y;
    };
    this.copy = function(other) {
        this.x = other.x;
        this.y = other.y;
    };
    this.reset = function(x, y) {
        this.x = x;
        this.y = y;
    };
}

module.exports = {
  Vertex2D: Vertex2D
};