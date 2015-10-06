/*globals module, console, require*/
var parallelograms = require('./graphics');

/*  @function partitionSquareIntoFour
    Cuts the parallelogram into four pieces, origin 0,0 is the top-left corner
    @param {Object} parallelogram must have a width and height property
    @returns {ParallelogramVertexSet[]}
 */
function partitionSquareIntoFour(parallelogram){
    'use strict';
    var R1 = new parallelograms.Parallelogram().fromVertices(0, (parallelogram.width/2) - 1, 0, (parallelogram.height/2) - 1),
        R2 = new parallelograms.Parallelogram().fromVertices(parallelogram.width/2, parallelogram.width, 0, (parallelogram.height/2) - 1),
        R3 = new parallelograms.Parallelogram().fromVertices(0, (parallelogram.width/2) - 1, parallelogram.height/2, parallelogram.height),
        R4 = new parallelograms.Parallelogram().fromVertices(parallelogram.width/2, parallelogram.width, parallelogram.height/2, parallelogram.height);
    return {
        TopLeft: R1, TopRight: R2, LowerLeft: R3, LowerRight: R4
    };
}

/** @typedef {Object<string,string>} FaceBoxCollisionMap
 * The Parallelograms are as follows:
 *  @property {string} TopLeft
 *  @property {TopLeft.collisions.Vertex2D[]} Array of vertices from the faceBox in the TopLeft Quadrant
 *  @property {TopLeft.properties.Parallelogram} Sub Parallelogram properties
 *  @property {string} TopRight
 *  @property {TopRight.collisions.Vertex2D[]} Array of vertices from the faceBox in the TopRight Quadrant
 *  @property {TopRight.properties.Parallelogram} Sub Parallelogram properties
 *  @property {string} LowerLeft
 *  @property {LowerLeft.collisions.Vertex2D[]} Array of vertices from the faceBox in the LowerLeft Quadrant
 *  @property {LowerLeft.properties.Parallelogram} Sub Parallelogram properties
 *  @property {string} LowerRight
 *  @property {LowerRight.collisions.Vertex2D[]} Array of vertices from the faceBox in the LowerRight Quadrant
 *  @property {LowerRight.properties.Parallelogram} Sub Parallelogram properties
 */

/*  @function squareOverlap
    Find where is the faceBox (the square containing ALL the faces)
    in the image, the offsets of the facebook are already applied.
    The origin 0,0 is the image's top-left corner.
    @param {FaceContainer} faceBox the square that collects faces found
    @returns {FaceBoxCollisionMap}
 */
function squareOverlap(faceBox) {
    'use strict';
    var subSquares = partitionSquareIntoFour({width: faceBox.sourceWidth, height: faceBox.sourceHeight});
    var faceBoxCollisionMap = concentricParallelogramCollision(subSquares, faceBox);
    for(var key in subSquares) {
        if (faceBoxCollisionMap[key] !== undefined && subSquares[key] !== undefined) {
            faceBoxCollisionMap[key].properties = subSquares[key];
        }
    }
    return faceBoxCollisionMap;
}

function range(start, count) {
    'use strict';
    return Array.apply(0, new Array(count))
        .map(function (element, index) {
            return index + start;
        });
}


/** @function concentricParallelogramCollision
 * Iterate through all the faceBox vertices and calculate the vectors between them.
 *  @returns {FaceBoxCollisionMap}
 */
function concentricParallelogramCollision(subSquares, faceBox) {
    'use strict';
    faceBox.recalculateVerticesWithOffset();
    var quadrantsPack = {};
    var vertices = range(0, faceBox.vertices.pMembers.length);
    for(var key in subSquares){
        if(subSquares[key] !== undefined){
            var max = vertices.length;
            var i = 0;
            while(i !== max){
                if(faceBox.vertices[faceBox.vertices.pMembers[i]] !== undefined){
                    var vertex = faceBox.vertices[faceBox.vertices.pMembers[vertices[i]]];
                    var isInside = subSquares[key].isPointInside(vertex);
                    if(isInside) {
                        vertex.identifier = vertex.identifier || '';
                        vertex.identifier = faceBox.vertices.pMembers[vertices[i]].toString();
                        vertices.splice(i,1);
                        max = vertices.length;
                        quadrantsPack[key] = quadrantsPack[key] || {};
                        quadrantsPack[key].collisions = quadrantsPack[key].collisions || [];
                        quadrantsPack[key].collisions.push(vertex);
                    } else {
                        i++;
                    }
                }
            }
            if(!vertices.length) {
                break;
            }
        }
    }
    return quadrantsPack;
}

module.exports = {
    squareOverlap: squareOverlap,
    partitionSquareIntoFour: partitionSquareIntoFour,
    concentricParallelogramCollision: concentricParallelogramCollision
};