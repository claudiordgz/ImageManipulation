/*globals require, describe, it, console, assert*/
var chai    = require("chai");
var testbed = require("./testbeds/faceBoxAndFaceBoxAnalysis");
var positioning = require('../positioning');
var graphics = require('graphics');

describe("Selecting an anchor point", function() {
    'use strict';
    /** FaceContainer
     * width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight*/
    describe("selectAnchorPoint from area percentages per quadrant", function() {
        var baseTest = function(testData) {
            var testFaceBox = new graphics.FaceContainer(testData.faceBox.width, testData.faceBox.height, testData.faceBox.offsetX,
                testData.faceBox.offsetY, testData.faceBox.sourceWidth, testData.faceBox.sourceHeight,
                testData.faceBox.targetWidth, testData.faceBox.targetHeight);
            testFaceBox.recalculateVerticesWithOffset();
            positioning.selectAnchorPoint(
                testFaceBox,
                testData.faceBoxAnalysis);
        };

        var loopTest = function(testName) {
            describe("Test for " + testName, function() {
                it("Orders the areas by highest and picks a ", function () {
                    var testVariables = testbed[testName];
                    baseTest(testVariables);
                });
            });
        };

        for(var testData in testbed) {
            if(testbed[testData] !== undefined) {
                loopTest(testData);
            }
        }



    });
});
