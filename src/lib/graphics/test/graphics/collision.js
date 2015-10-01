/*globals require, describe, it, console, assert*/
var chai    = require("chai");
var utilities = require("../..//collision");
var graphics = require('../../graphics');

var results100by200 = {
    TopLeft: new graphics.Parallelogram().fromVertices(0, 50, 0, 100),
    TopRight: new graphics.Parallelogram().fromVertices(50, 100, 0, 100),
    LowerLeft: new graphics.Parallelogram().fromVertices(0, 50, 100, 200),
    LowerRight: new graphics.Parallelogram().fromVertices(50, 100, 100, 200)
};
var results200by100 = {
    TopLeft: new graphics.Parallelogram().fromVertices(0, 100, 0, 50),
    TopRight: new graphics.Parallelogram().fromVertices(100, 200, 0, 50),
    LowerLeft: new graphics.Parallelogram().fromVertices(0, 100, 50, 100),
    LowerRight: new graphics.Parallelogram().fromVertices(100, 200, 50, 100)
};
var results200by200 = {
    TopLeft: new graphics.Parallelogram().fromVertices(0, 100, 0, 100),
    TopRight: new graphics.Parallelogram().fromVertices(100, 200, 0, 100),
    LowerLeft: new graphics.Parallelogram().fromVertices(0, 100, 100, 200),
    LowerRight: new graphics.Parallelogram().fromVertices(100, 200, 100, 200)
};

describe("Image partitioning process", function() {
    'use strict';
    describe("partitionParallelogramIntoFour", function() {
        it("Returns 4 parallelograms in the form of a ParallelogramVertexSet", function() {
            var portraitParallelograms = utilities.partitionSquareIntoFour({width: 100, height: 200});
            var landscapeParallelograms = utilities.partitionSquareIntoFour({width: 200, height: 100});
            var squareParallelograms = utilities.partitionSquareIntoFour({width: 200, height: 200});
            var testbed = [portraitParallelograms, landscapeParallelograms, squareParallelograms];
            var results = [results100by200, results200by100, results200by200];
            for(var j = 0;j !== testbed.length; ++j) {
                var currentTest = testbed[j].vertices;
                var currentResults = results[j].vertices;
                for (var key in currentResults) {
                    if(currentResults.hasOwnProperty(key) && currentTest.hasOwnProperty(key)){
                        chai.assert.ok(currentTest[key].equals(currentResults[key]));
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