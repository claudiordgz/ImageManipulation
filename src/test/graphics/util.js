/*globals require, describe, it*/
var expect    = require("chai").expect;
var utilities = require("graphics/util");
var graphics = require('graphics');

var R1 = new graphics.ParallelogramVertexSetFromVertices(0, parallelogram.width/2, 0, parallelogram.height/2),
    R2 = new graphics.ParallelogramVertexSetFromVertices(parallelogram.width/2, parallelogram.width,0, parallelogram.height/2),
    R3 = new graphics.ParallelogramVertexSetFromVertices(0,parallelogram.width/2, parallelogram.height/2, parallelogram.height);

var results100by200 = [
    {X1: 0,X2: 50,Y1: 0,Y2: 100},
    {X1: 50,X2: 100,Y1: 0,Y2: 100},
    {X1: 0,X2: 50,Y1: 100,Y2: 200},
    {X1: 50,X2: 100,Y1: 100,Y2: 200}
];
var results200by100 = [
    {X1: 0,X2: 100,Y1: 0,Y2: 50},
    {X1: 100,X2: 200,Y1: 0,Y2: 50},
    {X1: 0,X2: 100,Y1: 50,Y2: 100},
    {X1: 100,X2: 200,Y1: 50,Y2: 100}
];
var results200by200 = [
    {X1: 0,X2: 100,Y1: 0,Y2: 100},
    {X1: 100,X2: 200,Y1: 0,Y2: 100},
    {X1: 0,X2: 100,Y1: 100,Y2: 200},
    {X1: 100,X2: 200,Y1: 100,Y2: 200}
];

describe("Image partitioning process", function() {
    'use strict';
    describe("partitionSquareIntoFour", function() {
        it("Returns 4 parallelograms in the form of a ParallelogramVertexSet", function() {
            var portraitParallelograms = utilities.partitionSquareIntoFour({width: 100, height: 200});
            var landscapeParallelograms = utilities.partitionSquareIntoFour({width: 200, height: 100});
            var squareParallelograms = utilities.partitionSquareIntoFour({width: 200, height: 200});
            var testbed = [portraitParallelograms, landscapeParallelograms, squareParallelograms];
            var results = [results100by200, results200by100, results200by200];
            for(var j = 0;j !== testbed.length; ++j) {
                var currentTest = testbed[j];
                var currentResults = results[j];
                for (var i = 0; i !== currentResults.length; ++i) {
                    var resultParallelogram = currentResults[i];
                    var parallelogram = currentTest[i];
                    for (var key in resultParallelogram) {
                        if (resultParallelogram.hasOwnProperty(key)) {
                            expect(parallelogram[key]).to.equal(resultParallelogram[key]);
                        }
                    }
                }
            }
        });
    });

    describe("squareOverlap", function() {
        it("Checks overlapping squares of a concentric square", function() {
            var faceBox = new graphics.FaceContainer(100, 50, 50, 50, 200, 150, 100, 100);
            utilities.squareOverlap(faceBox);
        });
    });
});