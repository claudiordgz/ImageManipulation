/*globals module, console, require*/
var parallelograms = require('./graphics');

/*  @function partitionSquareIntoFour
    Cuts the parallelogram into four pieces, origin 0,0 is the top-left corner
    @param {Object} parallelogram must have a width and height property
    @returns {ParallelogramVertexSet[]}
 */
function partitionSquareIntoFour(parallelogram){
    'use strict';
    var R1 = new parallelograms.Parallelogram().fromVertices(0, parallelogram.width/2, 0, parallelogram.height/2),
        R2 = new parallelograms.Parallelogram().fromVertices(parallelogram.width/2, parallelogram.width,0, parallelogram.height/2),
        R3 = new parallelograms.Parallelogram().fromVertices(0,parallelogram.width/2, parallelogram.height/2, parallelogram.height),
        R4 = new parallelograms.Parallelogram().fromVertices(parallelogram.width/2, parallelogram.width, parallelogram.height/2, parallelogram.height);
    return {
        TopLeft: R1, TopRight: R2, LowerLeft: R3, LowerRight: R4
    };
}

/*  @function squareOverlap
    Find where is the faceBox (the square containing ALL the faces)
    in the image, the offsets of the facebook are already applied.
    The origin 0,0 is the image's top-left corner.
    @param {Object} originalImage the properties of the original image
    @param {Object} faceBox the square that collects faces found
 */
function squareOverlap(faceBox) {
    'use strict';
    var subSquares = partitionSquareIntoFour({width: faceBox.sourceWidth, height: faceBox.sourceHeight});
    concentricParallelogramCollision(subSquares, faceBox);
}

function range(start, count) {
    'use strict';
    return Array.apply(0, new Array(count))
        .map(function (element, index) {
            return index + start;
        });
}

/* @function concentricParallelogramCollision
 * Iterate through all the faceBox vertices and calculate the vectors between them.
 *
 */
function concentricParallelogramCollision(subSquares, faceBox) {
    'use strict';
    faceBox.recalculateVerticesWithOffset();
    var quadrantsPack = {};
    var vertices = range(0, faceBox.vertices.pMembers.length);
    for(var key in subSquares){
        if(subSquares.hasOwnProperty(key)){
            if(!quadrantsPack.hasOwnProperty(key)){
                quadrantsPack[key] = [];
            }
            for(var i=0; i!==vertices.length;++i){
                if(faceBox.vertices.hasOwnProperty(faceBox.vertices.pMembers[i])){
                    var vertex = faceBox.vertices[faceBox.vertices.pMembers[vertices[i]]];
                    var isInside = subSquares[key].isPointInside(vertex);
                    if(isInside) {
                        vertices.splice(i,1);
                        quadrantsPack[key].push(vertex);
                        break;
                    }
                }
            }
            if(!vertices.length) {
                break;
            }
        }
    }
    console.log(quadrantsPack);
}

module.exports = {
    squareOverlap: squareOverlap,
    partitionSquareIntoFour: partitionSquareIntoFour
};