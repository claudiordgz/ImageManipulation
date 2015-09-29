/*globals module, console, require*/
var Victor = require('victor');
var parallelograms = require('graphics');

/*  @function partitionSquareIntoFour
    Cuts the parallelogram into four pieces, origin 0,0 is the top-left corner
    @param {Object} parallelogram must have a width and height property
    @returns {ParallelogramVertexSet[]}
 */
function partitionSquareIntoFour(parallelogram){
    'use strict';
    var R1 = new parallelograms.ParallelogramVertexSet().fromVertices(0, parallelogram.width/2, 0, parallelogram.height/2),
        R2 = new parallelograms.ParallelogramVertexSet().fromVertices(parallelogram.width/2, parallelogram.width,0, parallelogram.height/2),
        R3 = new parallelograms.ParallelogramVertexSet().fromVertices(0,parallelogram.width/2, parallelogram.height/2, parallelogram.height),
        R4 = new parallelograms.ParallelogramVertexSet().fromVertices(parallelogram.width/2, parallelogram.width, parallelogram.height/2, parallelogram.height);
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

/*

 */
function getVector(coordinatesA, coordinatesB) {
    'use strict';
    return new Victor(coordinatesB.x - coordinatesA.x, coordinatesB.y - coordinatesA.y);
}

/*  @function concentricParallelogramCollision

 */
function concentricParallelogramCollision(subSquares, faceBox) {
    'use strict';
    assembleVectorsFromVertices(subSquares, faceBox);
}

function assembleVectorsFromVertices(subSquares, faceBox) {
    'use strict';
    faceBox.recalculateVerticesWithOffset();
    for(var i=0; i!==faceBox.vertices.pMembers.length;++i){
        if(faceBox.vertices.hasOwnProperty(faceBox.vertices.pMembers[i])){
            var vertex = faceBox.vertices[faceBox.vertices.pMembers[i]];
            //console.log(vertex);
            for(var key in subSquares){
                if(subSquares.hasOwnProperty(key)){
                    var a = 0;
                }
                //console.log('sub square: '+ subSquares[j].X1 + ' ' + subSquares[j].X2+ ' ' + subSquares[j].Y1+ ' ' + subSquares[j].Y2);
                //console.log(getVector({x:subSquares[j].X1, y:subSquares[j].Y1},{x:vertex.x, y:vertex.y}));
            }
        }
    }

}

module.exports = {
    squareOverlap: squareOverlap,
    partitionSquareIntoFour: partitionSquareIntoFour
};