/*globals module, console, require*/
var partitioning = require('./partitioning');

/*  @function squareOverlap
    Find where is the faceBox (the square containing ALL the faces)
    in the image, the offsets of the facebook are already applied.
    The origin 0,0 is the image's top-left corner.
    @param {FaceContainer} faceBox the square that collects faces found
    @returns {FaceBoxCollisionMap}
 */
function squareOverlap(faceBox) {
    'use strict';
    var subSquares = partitioning.partitionSquareIntoFour({width: faceBox.sourceWidth, height: faceBox.sourceHeight});
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
    concentricParallelogramCollision: concentricParallelogramCollision
};