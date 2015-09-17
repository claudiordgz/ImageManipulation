/* @class Vertex2D
 As it name implies a vertex structure
 for 2 Dimensional Polygons */
function Vertex2D(x, y) {
    this.x = x;
    this.y = y;
    this.equals = function(other) {
        return other.x == this.x && other.y == this.y;
    };
    this.copy = function(other) {
        this.x = other.x;
        this.y = other.y;
    }
}

module.exports = {
  Vertex2D: Vertex2D
};