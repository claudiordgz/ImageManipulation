/*globals require, describe, it, console, assert*/
var chai    = require("chai");
var collision = require("../../collision");
var areas = require("../../areaProbability");
var graphics = require('../../graphics');


describe("Vertex collision detection", function() {
    'use strict';
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

            var concentricSquareTest = function(offsetX, offsetY, vertexPerSquareTest, areaPerSquareTest) {
                var faceBox = new graphics.FaceContainer(faceBoxWidth, faceBoxHeight, offsetX, offsetY, imageWidth, imageHeight, divWidth, divHeight);
                var faceBoxCollisionMap = collision.squareOverlap(faceBox);
                vertexPerSquareTest(faceBoxCollisionMap);
                areas.calculateAreasForPoints(faceBox, faceBoxCollisionMap);
                areaPerSquareTest(faceBoxCollisionMap);
            };

            it("Centered face, one vertex per quadrant", function () {
                concentricSquareTest((imageWidth - faceBoxWidth) / 2, (imageHeight - faceBoxHeight) / 2,
                    function(collisionMap) {
                        console.log(collisionMap);
                        for (var key in collisionMap) {
                            if (collisionMap[key] !== undefined) {
                                chai.expect(collisionMap[key].collisions.length).to.equal(1);
                            }
                        }
                    },
                    function(collisionMap) {
                        //
                    }
                );
            });

            it("Concentric square test, all vertex TopLeft quadrant", function () {
                concentricSquareTest(0, 0,
                    function(collisionMap) {
                        chai.expect(collisionMap.TopLeft.collisions.length).to.equal(4);
                    },
                    function(collisionMap) {
                        //
                    }
                );
            });

            it("Concentric square test, all vertex TopRight quadrant", function () {
                concentricSquareTest(imageWidth / 2, 0,
                    function(collisionMap) {
                        chai.expect(collisionMap.TopRight.collisions.length).to.equal(4);
                    },
                    function(collisionMap) {
                        //
                    }
                );
            });

            it("Concentric square test, all vertex LowerLeft quadrant", function () {
                concentricSquareTest(0, imageHeight / 2,
                    function(collisionMap) {
                        chai.expect(collisionMap.LowerLeft.collisions.length).to.equal(4);
                    },
                    function(collisionMap) {
                        //
                    }
                );
            });

            it("Concentric square test, all vertex LowerRight quadrant", function () {
                concentricSquareTest(imageWidth / 2, imageHeight / 2,
                    function(collisionMap) {
                        chai.expect(collisionMap.LowerRight.collisions.length).to.equal(4);
                    },
                    function(collisionMap) {
                        //
                    }
                );
            });

            it("Concentric square test, all vertex TopLeft and TopRight quadrant", function () {
                concentricSquareTest(imageWidth / 4, 0,
                    function(collisionMap) {
                        chai.expect(collisionMap.TopRight.collisions.length).to.equal(2);
                        chai.expect(collisionMap.TopLeft.collisions.length).to.equal(2);
                    },
                    function(collisionMap) {
                        //
                    }
                );
            });

            it("Concentric square test, all vertex LowerLeft and LowerRight quadrant", function () {
                concentricSquareTest(imageWidth / 4, imageHeight / 2,
                    function(collisionMap) {
                        chai.expect(collisionMap.LowerLeft.collisions.length).to.equal(2);
                        chai.expect(collisionMap.LowerRight.collisions.length).to.equal(2);
                    },
                    function(collisionMap) {
                        //
                    }
                );
            });

            it("Concentric square test, all vertex TopLeft and LowerLeft quadrant", function () {
                concentricSquareTest(0, imageHeight / 4,
                    function(collisionMap) {
                        chai.expect(collisionMap.TopLeft.collisions.length).to.equal(2);
                        chai.expect(collisionMap.LowerLeft.collisions.length).to.equal(2);
                    },
                    function(collisionMap) {
                        //
                    }
                );
            });

            it("Concentric square test, all vertex TopRight and LowerRight quadrant", function () {
                concentricSquareTest(imageWidth / 2, imageHeight / 4,
                    function(collisionMap) {
                        chai.expect(collisionMap.TopRight.collisions.length).to.equal(2);
                        chai.expect(collisionMap.LowerRight.collisions.length).to.equal(2);
                    },
                    function(collisionMap) {
                        //
                    }
                );
            });
        });
    });
});