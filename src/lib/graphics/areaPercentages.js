/*globals require, module*/
var slicing = require('./sliceDetection');

function applyCalculation(areaSwitch, faceBox, squareName, faceBoxCollisionSquare) {
    'use strict';
    var probabilities = {};
    for(var i =0; i!==faceBoxCollisionSquare.collisions.length; ++i) {
        var currentCollision = faceBoxCollisionSquare.collisions[i];
        areaSwitch[currentCollision.identifier](probabilities, faceBox, squareName, currentCollision, faceBoxCollisionSquare.properties);
    }
    return probabilities[squareName];
}

function calculateAreasAllQuadrants(faceBox, squareName, faceBoxCollisionSquare) {
    'use strict';
    var areaSwitch = {
        initSquare : function(probabilities) {
            probabilities[squareName] = probabilities[squareName] || {};
        },
        'A' : function(probabilities, faceBox, squareName, squareCollision, containerSquare) {
            this.initSquare(probabilities);
            var width = containerSquare.width - squareCollision.x;
            var height = containerSquare.height - squareCollision.y;
            var area = width * height;
            probabilities[squareName].percent = area / faceBox.area();
        },
        'B' : function (probabilities, faceBox, squareName, squareCollision, containerSquare) {
            this.initSquare(probabilities);
            var width = squareCollision.x - containerSquare.vertices.A.x;
            var height = containerSquare.height - squareCollision.y;
            var area = width * height;
            probabilities[squareName].percent = area / faceBox.area();
        },
        'C' : function (probabilities, faceBox, squareName, squareCollision, containerSquare) {
            this.initSquare(probabilities);
            var width = squareCollision.x - containerSquare.vertices.A.x;
            var height = squareCollision.y - containerSquare.vertices.A.y;
            var area = width * height;
            probabilities[squareName].percent = area / faceBox.area();
        },
        'D' : function(probabilities, faceBox, squareName, squareCollision, containerSquare) {
            this.initSquare(probabilities);
            var width = containerSquare.width - squareCollision.x;
            var height = squareCollision.y - containerSquare.vertices.A.y;
            var area = width * height;
            probabilities[squareName].percent = area / faceBox.area();
        }
    };
    return applyCalculation(areaSwitch, faceBox, squareName, faceBoxCollisionSquare);
}

function calculateAreasXAxisSlicedQuadrants(faceBox, squareName, faceBoxCollisionSquare) {
    'use strict';
    var areaSwitch = {
        Top: function(probabilities, faceBox, squareName, squareCollision, containerSquare) {
            probabilities[squareName] = probabilities[squareName] || {};
            var width = faceBox.width;
            var height = containerSquare.height - squareCollision.y;
            var area = width * height;
            probabilities[squareName].percent = area / faceBox.area();
        },
        Bottom: function(probabilities, faceBox, squareName, squareCollision, containerSquare) {
            probabilities[squareName] = probabilities[squareName] || {};
            var width = faceBox.width;
            var height = squareCollision.y - containerSquare.vertices.A.y;
            var area = width * height;
            probabilities[squareName].percent = area / faceBox.area();
        },
        'A' : function(probabilities, faceBox, squareName, squareCollision, containerSquare) {
            this.Top(probabilities, faceBox, squareName, squareCollision, containerSquare);
        },
        'B' : function (probabilities, faceBox, squareName, squareCollision, containerSquare) {
            if(probabilities[squareName] === undefined) {
                this.Top(probabilities, faceBox, squareName, squareCollision, containerSquare);
            }
        },
        'C' : function (probabilities, faceBox, squareName, squareCollision, containerSquare) {
            this.Bottom(probabilities, faceBox, squareName, squareCollision, containerSquare);
        },
        'D' : function(probabilities, faceBox, squareName, squareCollision, containerSquare) {
            if(probabilities[squareName] === undefined) {
                this.Bottom(probabilities, faceBox, squareName, squareCollision, containerSquare);
            }
        }
    };
    return applyCalculation(areaSwitch, faceBox, squareName, faceBoxCollisionSquare);
}

function calculateAreasYAxisSlicedQuadrants(faceBox, squareName, faceBoxCollisionSquare) {
    'use strict';
    var areaSwitch = {
        Left: function(probabilities, faceBox, squareName, squareCollision, containerSquare) {
            probabilities[squareName] = probabilities[squareName] || {};
            var width = containerSquare.width - squareCollision.x;
            var height = faceBox.height;
            var area = width * height;
            probabilities[squareName].percent = area / faceBox.area();
        },
        Right: function(probabilities, faceBox, squareName, squareCollision, containerSquare) {
            probabilities[squareName] = probabilities[squareName] || {};
            var width = squareCollision.x - containerSquare.vertices.A.x;
            var height = faceBox.height;
            var area = width * height;
            probabilities[squareName].percent = area / faceBox.area();
        },
        'A' : function(probabilities, faceBox, squareName, squareCollision, containerSquare) {
            this.Left(probabilities, faceBox, squareName, squareCollision, containerSquare);
        },
        'B' : function (probabilities, faceBox, squareName, squareCollision, containerSquare) {
            this.Right(probabilities, faceBox, squareName, squareCollision, containerSquare);
        },
        'C' : function (probabilities, faceBox, squareName, squareCollision, containerSquare) {
            if(probabilities[squareName] === undefined) {
                this.Right(probabilities, faceBox, squareName, squareCollision, containerSquare);
            }
        },
        'D' : function(probabilities, faceBox, squareName, squareCollision, containerSquare) {
            if(probabilities[squareName] === undefined) {
                this.Left(probabilities, faceBox, squareName, squareCollision, containerSquare);
            }
        }
    };
    return applyCalculation(areaSwitch, faceBox, squareName, faceBoxCollisionSquare);
}

/** @function calculateAreas
 * @param {FaceContainer} faceBox The parallelogram containing all the faces found
 * @param {FaceBoxCollisionMap} faceBoxCollisionMap Location of vertices per quadrant
 * @returns {FaceBoxCollisionMap} Fills Area Percentages
 */
function calculateAreasForPoints(faceBox, faceBoxCollisionMap) {
    'use strict';
    var slices = slicing.getSlices(faceBoxCollisionMap);
    var probabilities = {};
    /*jshint -W089*/
    if(slices.noSlice !== false) {
        for(var name in faceBoxCollisionMap) {
            probabilities[name] = probabilities[name] || {};
            probabilities[name].percent = 1.00;
        }
    } else {
        /*jshint +W089*/
        for (var key in faceBoxCollisionMap) {
            if (faceBoxCollisionMap[key] !== undefined) {
                if(slices.xSlice && slices.ySlice) {
                    probabilities[key] = calculateAreasAllQuadrants(faceBox, key, faceBoxCollisionMap[key]);
                } else if(slices.xSlice) {
                    probabilities[key] = calculateAreasXAxisSlicedQuadrants(faceBox, key, faceBoxCollisionMap[key]);
                } else if(slices.ySlice) {
                    probabilities[key] = calculateAreasYAxisSlicedQuadrants(faceBox, key, faceBoxCollisionMap[key]);
                }
            }
        }
    }
    return probabilities;
}

module.exports = {
    calculateAreasForPoints: calculateAreasForPoints
};