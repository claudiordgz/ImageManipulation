/*globals require, describe, it, console, assert*/
var chai    = require("chai");
var testbed = require("./testbeds/faceBoxAndFaceBoxAnalysis");
var positioning = require('../positioning');

describe("Selecting an anchor point", function() {
    'use strict';
    /** FaceContainer
     * width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight*/
    describe("selectAnchorPoint from area percentages per quadrant", function() {
        describe("Test for rFB292x326Image0", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB292x326Image0;
                positioning.selectAnchorPoint(testData.faceBox, testData.faceBoxAnalysis);
            });
        });
        describe("Test for rFB166x250Image1", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB166x250Image1;
                positioning.selectAnchorPoint(testData.faceBox, testData.faceBoxAnalysis);
            });
        });
        describe("Test for rFB400x268Image3", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB400x268Image3;
                positioning.selectAnchorPoint(testData.faceBox, testData.faceBoxAnalysis);
            });
        });
        describe("Test for rFB400x272Image5", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB400x272Image5;
                positioning.selectAnchorPoint(testData.faceBox, testData.faceBoxAnalysis);
            });
        });
        describe("Test for rFB250x206Image4", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB250x206Image4;
                positioning.selectAnchorPoint(testData.faceBox, testData.faceBoxAnalysis);
            });
        });
        describe("Test for rFB250x248Image7", function() {
            it("Orders the areas by highest and picks a ", function () {
                var testData = testbed.rFB250x248Image7;
                positioning.selectAnchorPoint(testData.faceBox, testData.faceBoxAnalysis);
            });
        });
    });
});
