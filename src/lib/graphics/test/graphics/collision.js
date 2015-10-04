/*globals require, describe, it, console, assert*/
var chai    = require("chai");
var utilities = require("../../collision");
var graphics = require('../../graphics');


describe("Image partitioning process", function() {
    'use strict';
    describe("partitionParallelogramIntoFour", function() {
        var checkPartitioning = function(test, expected) {
            var currentTest = test.vertices;
            var currentResults = expected.vertices;
            for (var key in currentResults) {
                if(currentResults.hasOwnProperty(key) && currentTest.hasOwnProperty(key)){
                    chai.expect(currentTest[key]).to.be(currentResults[key]);
                }
            }
        };

        it("Return four quadrants for a 100X200 image", function() {
            var results100by200 = {
                TopLeft: new graphics.Parallelogram().fromVertices(0, 50, 0, 100),
                TopRight: new graphics.Parallelogram().fromVertices(50, 100, 0, 100),
                LowerLeft: new graphics.Parallelogram().fromVertices(0, 50, 100, 200),
                LowerRight: new graphics.Parallelogram().fromVertices(50, 100, 100, 200)
            };
            var portraitParallelograms = utilities.partitionSquareIntoFour({width: 100, height: 200});
            checkPartitioning(portraitParallelograms, results100by200);
        });

        it("Return four quadrants for a 200X200 image", function() {
            var results200by200 = {
                TopLeft: new graphics.Parallelogram().fromVertices(0, 100, 0, 100),
                TopRight: new graphics.Parallelogram().fromVertices(100, 200, 0, 100),
                LowerLeft: new graphics.Parallelogram().fromVertices(0, 100, 100, 200),
                LowerRight: new graphics.Parallelogram().fromVertices(100, 200, 100, 200)
            };
            var squareParallelograms = utilities.partitionSquareIntoFour({width: 200, height: 200});
            checkPartitioning(squareParallelograms, results200by200);
        });

        it("Return four quadrants for a 200X100 image", function() {
            var results200by100 = {
                TopLeft: new graphics.Parallelogram().fromVertices(0, 100, 0, 50),
                TopRight: new graphics.Parallelogram().fromVertices(100, 200, 0, 50),
                LowerLeft: new graphics.Parallelogram().fromVertices(0, 100, 50, 100),
                LowerRight: new graphics.Parallelogram().fromVertices(100, 200, 50, 100)
            };
            var landscapeParallelograms = utilities.partitionSquareIntoFour({width: 200, height: 100});
            checkPartitioning(landscapeParallelograms, results200by100);
        });
    });

    /** FaceContainer
     * width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight*/
    describe("squareOverlap", function() {
        describe("Concentric square test for 166x250 image", function() {
            var imageWidth = 166;
            var imageHeight = 250;
            var divWidth = 100;
            var divHeight = 100;
            var faceBoxWidth = imageWidth * 0.45;
            var faceBoxHeight = imageHeight * 0.35;

            var concentricSquareTest = function(offsetX, offsetY, test) {
                var faceBox = new graphics.FaceContainer(faceBoxWidth, faceBoxHeight, offsetX, offsetY, imageWidth, imageHeight, divWidth, divHeight);
                var collisions = utilities.squareOverlap(faceBox);
                test(collisions);
            };

            it("Centered face, one vertex per quadrant", function () {
                var offsetX = (imageWidth - faceBoxWidth) / 2;
                var offsetY = (imageHeight - faceBoxHeight) / 2;
                concentricSquareTest(offsetX, offsetY, function(collisions) {
                    for(var key in collisions) {
                        if(collisions.hasOwnProperty(key)) {
                            chai.expect(collisions[key].length).to.equal(1);
                        }
                    }
                });
            });

            it("Concentric square test, all vertex TopLeft quadrant", function () {
                concentricSquareTest(0, 0, function(collisions) {
                    if(collisions.hasOwnProperty('TopLeft')){
                        chai.expect(collisions.TopLeft.length).to.equal(4);
                    }
                });
            });

            it("Concentric square test, all vertex TopRight quadrant", function () {
                concentricSquareTest(imageWidth / 2, 0, function(collisions) {
                    if(collisions.hasOwnProperty('TopRight')){
                        chai.expect(collisions.TopRight.length).to.equal(4);
                    }
                });
            });

            it("Concentric square test, all vertex LowerLeft quadrant", function () {
                concentricSquareTest(0, imageHeight / 2, function(collisions) {
                    if(collisions.hasOwnProperty('TopRight')){
                        chai.expect(collisions.TopRight.length).to.equal(4);
                    }
                });
            });

            it("Concentric square test, all vertex LowerRight quadrant", function () {
                concentricSquareTest(imageWidth / 2, imageHeight / 2, function(collisions) {
                    if(collisions.hasOwnProperty('TopRight')){
                        chai.expect(collisions.TopRight.length).to.equal(4);
                    }
                });
            });
        });
    });
});