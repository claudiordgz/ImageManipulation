/*globals require, describe, it, console, assert*/
var chai    = require("chai");
var testbed = require("./testbeds/areaTestsFaceBoxCollisionMaps");

var areas = require("../../areaPercentages");
var graphics = require('../../graphics');


describe("Area Percentages", function() {
    'use strict';
    /** FaceContainer
     * width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight*/
    describe("calculateAreasForPoints: Concentric square tests for faceBoxCollisionMaps in testbed", function() {
        describe("Test percentage of faces in Quadrant", function() {
            var imageWidth = 166;
            var imageHeight = 250;
            var divWidth = 100;
            var divHeight = 100;
            var faceBoxWidth = imageWidth * 0.45;
            var faceBoxHeight = imageHeight * 0.35;

            var concentricSquareTest = function(faceBoxCollisionMap, offsetX, offsetY, areaPerSquareTest) {
                var faceBox = new graphics.FaceContainer(faceBoxWidth, faceBoxHeight, offsetX, offsetY, imageWidth, imageHeight, divWidth, divHeight);
                var results = areas.calculateAreasForPoints(faceBox, faceBoxCollisionMap);
                var sum = 0;
                for(var key in results){
                    if(results[key] !== undefined) {
                        sum += results[key].percent;
                    }
                }
                chai.expect(sum).to.be.within(0.97, 1);
                areaPerSquareTest(results);
            };

            it("Centered face, one vertex per quadrant", function () {
                concentricSquareTest(testbed.resultsOneVertexPerQuadrant, (imageWidth - faceBoxWidth) / 2, (imageHeight - faceBoxHeight) / 2,
                    function(percentageAreaPerQuadrant) {
                        chai.expect(Object.keys(percentageAreaPerQuadrant).length).to.equal(4);
                    }
                );
            });

            it("all vertex TopLeft quadrant", function () {
                concentricSquareTest(testbed.resultsAllVertexTopLeftQuadrant, 0, 0,
                    function(percentageAreaPerQuadrant) {
                        chai.should().equal(percentageAreaPerQuadrant.TopRight, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.LowerLeft, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.LowerRight, undefined);

                    }
                );
            });

            it("all vertex TopRight quadrant", function () {
                concentricSquareTest(testbed.resultsAllVertexTopRightQuadrant,imageWidth / 2, 0,
                    function(percentageAreaPerQuadrant) {
                        chai.should().equal(percentageAreaPerQuadrant.TopLeft, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.LowerLeft, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.LowerRight, undefined);
                    }
                );
            });

            it("all vertex LowerLeft quadrant", function () {
                concentricSquareTest(testbed.resultsAllVertexLowerLeftQuadrant, 0, imageHeight / 2,
                    function(percentageAreaPerQuadrant) {
                        chai.should().equal(percentageAreaPerQuadrant.TopRight, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.TopLeft, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.LowerRight, undefined);
                    }
                );
            });

            it("all vertex LowerRight quadrant", function () {
                concentricSquareTest(testbed.resultsAllVertexLowerRightQuadrant, imageWidth / 2, imageHeight / 2,
                    function(percentageAreaPerQuadrant) {
                        chai.should().equal(percentageAreaPerQuadrant.TopRight, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.TopLeft, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.LowerLeft, undefined);
                    }
                );
            });

            it("all vertex TopLeft and TopRight quadrant", function () {
                concentricSquareTest(testbed.resultsAllVertexTopLeftTopRightQuadrant, imageWidth / 4, 0,
                    function(percentageAreaPerQuadrant) {
                        chai.should().equal(percentageAreaPerQuadrant.LowerLeft, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.LowerRight, undefined);
                    }
                );
            });

            it("all vertex LowerLeft and LowerRight quadrant", function () {
                concentricSquareTest(testbed.resultsAllVertexLowerLeftLowerRightQuadrant, imageWidth / 4, imageHeight / 2,
                    function(percentageAreaPerQuadrant) {
                        chai.should().equal(percentageAreaPerQuadrant.TopRight, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.TopLeft, undefined);
                    }
                );
            });

            it("all vertex TopLeft and LowerLeft quadrant", function () {
                concentricSquareTest(testbed.resultsAllVertexTopLeftLowerLeftQuadrant, 0, imageHeight / 4,
                    function(percentageAreaPerQuadrant) {
                        chai.should().equal(percentageAreaPerQuadrant.TopRight, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.LowerRight, undefined);
                    }
                );
            });

            it("all vertex TopRight and LowerRight quadrant", function () {
                concentricSquareTest(testbed.resultsAllVertexTopRightLowerRightQuadrant, imageWidth / 2, imageHeight / 4,
                    function(percentageAreaPerQuadrant) {
                        chai.should().equal(percentageAreaPerQuadrant.TopLeft, undefined);
                        chai.should().equal(percentageAreaPerQuadrant.LowerLeft, undefined);
                    }
                );
            });
        });
    });
});