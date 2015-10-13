/*globals require, module*/

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

module.exports = {
    partitionSquareIntoFour: partitionSquareIntoFour
};