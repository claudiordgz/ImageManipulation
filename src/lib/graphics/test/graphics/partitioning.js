/*globals require, describe, it, console, assert*/
var chai    = require("chai");
var partitioning = require("../../partitioning");
var graphics = require('../../graphics');

describe("Image partitioning process", function() {
    'use strict';
    describe("partitionParallelogramIntoFour", function () {
        var checkPartitioning = function (test, expected) {
            var currentTest = test.vertices;
            var currentResults = expected.vertices;
            for (var key in currentResults) {
                if (currentResults[key] !== undefined && currentTest[key] !== undefined) {
                    chai.expect(currentTest[key]).to.be(currentResults[key]);
                }
            }
        };

        it("Return four quadrants for a 100X200 image", function () {
            var results100by200 = {
                TopLeft: new graphics.Parallelogram().fromVertices(0, 50, 0, 100),
                TopRight: new graphics.Parallelogram().fromVertices(50, 100, 0, 100),
                LowerLeft: new graphics.Parallelogram().fromVertices(0, 50, 100, 200),
                LowerRight: new graphics.Parallelogram().fromVertices(50, 100, 100, 200)
            };
            var portraitParallelograms = partitioning.partitionSquareIntoFour({width: 100, height: 200});
            checkPartitioning(portraitParallelograms, results100by200);
        });

        it("Return four quadrants for a 200X200 image", function () {
            var results200by200 = {
                TopLeft: new graphics.Parallelogram().fromVertices(0, 100, 0, 100),
                TopRight: new graphics.Parallelogram().fromVertices(100, 200, 0, 100),
                LowerLeft: new graphics.Parallelogram().fromVertices(0, 100, 100, 200),
                LowerRight: new graphics.Parallelogram().fromVertices(100, 200, 100, 200)
            };
            var squareParallelograms = partitioning.partitionSquareIntoFour({width: 200, height: 200});
            checkPartitioning(squareParallelograms, results200by200);
        });

        it("Return four quadrants for a 200X100 image", function () {
            var results200by100 = {
                TopLeft: new graphics.Parallelogram().fromVertices(0, 100, 0, 50),
                TopRight: new graphics.Parallelogram().fromVertices(100, 200, 0, 50),
                LowerLeft: new graphics.Parallelogram().fromVertices(0, 100, 50, 100),
                LowerRight: new graphics.Parallelogram().fromVertices(100, 200, 50, 100)
            };
            var landscapeParallelograms = partitioning.partitionSquareIntoFour({width: 200, height: 100});
            checkPartitioning(landscapeParallelograms, results200by100);
        });
    });
});