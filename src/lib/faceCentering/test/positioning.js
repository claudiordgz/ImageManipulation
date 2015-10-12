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

        describe("Test for rFB292x326Image0", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB292x326Image0;
                baseTest(testData);
            });
        });
        describe("Test for rFB166x250Image1", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB166x250Image1;
                baseTest(testData);
            });
        });
        describe("Test for rFB400x268Image3", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB400x268Image3;
                baseTest(testData);
            });
        });
        describe("Test for rFB400x272Image5", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB400x272Image5;
                baseTest(testData);
            });
        });
        describe("Test for rFB250x206Image4", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB250x206Image4;
                baseTest(testData);
            });
        });
        describe("Test for rFB250x248Image7", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB250x248Image7;
                baseTest(testData);
            });
        });
    });
});
