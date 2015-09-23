
function partitionSquareIntoFour(square){
    'use strict';
    var R1 = {
        X1: 0,
        X2: square.width/2,
        Y1: 0,
        Y2: square.height/2
    };
    var R2 = {
        X1: square.width/2,
        X2: square.width,
        Y1: 0,
        Y2: square.height/2
    };
    var R3 = {
        X1: 0,
        X2: square.width/2,
        Y1: square.height/2,
        Y2: square.height
    };
    var R4 = {
        X1: square.width/2,
        X2: square.width,
        Y1: square.height/2,
        Y2: square.height
    };
    return [
      R1, R2, R3, R4
    ];
}

function squareOverlap(originalImage, faceBox) {
    'use strict';
    partitionSquareIntoFour(originalImage);
}

module.exports = {
    squareOverlap: squareOverlap
};