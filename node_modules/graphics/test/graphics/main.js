/*globals require, describe, it, console, assert*/
var chai    = require("chai");
var graphics = require('../../graphics');
var main = require('../../main');

describe("Main library test", function() {
    'use strict';
    /** FaceContainer
     * width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight*/
    describe("GetFaceBoxPercentagePerQuadrant", function() {
        describe("Concentric square test for 166x250 image", function() {
            var imageWidth = 166;
            var imageHeight = 250;
            var divWidth = 100;
            var divHeight = 100;
            var faceBoxWidth = imageWidth * 0.45;
            var faceBoxHeight = imageHeight * 0.35;

            var concentricSquareTest = function(offsetX, offsetY, vertexPerSquareTest) {
                var faceBox = new graphics.FaceContainer(faceBoxWidth, faceBoxHeight, offsetX, offsetY, imageWidth, imageHeight, divWidth, divHeight);
                var faceBoxAnalysis = main.GetFaceBoxPercentagePerQuadrant(faceBox);
                vertexPerSquareTest(faceBoxAnalysis);
            };

            it("Test proper merge of properties", function () {
                concentricSquareTest((imageWidth - faceBoxWidth) / 2, (imageHeight - faceBoxHeight) / 2,
                    function(faceBoxAnalysis) {
                        for(var key in faceBoxAnalysis) {
                            if(faceBoxAnalysis[key] !== undefined) {
                                chai.should().not.equal(faceBoxAnalysis[key].percent, undefined);
                                chai.should().not.equal(faceBoxAnalysis[key].properties, undefined);
                                chai.should().not.equal(faceBoxAnalysis[key].collisions, undefined);
                            }
                        }
                    }
                );
            });
        });
    });
});