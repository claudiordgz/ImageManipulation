/*globals require, describe, it, console, assert*/
var chai    = require("chai");
var slices = require("../../sliceDetection");


describe("Slice Detection", function() {
    'use strict';
    describe("getSlices", function() {
        it("Test slice in x axis and y axis", function() {
            var allSquares = {'TopLeft' : true, 'TopRight': true, 'LowerLeft': true, 'LowerRight': true};
            var results = slices.getSlices(allSquares);
            var returnsNothing = chai.expect(results.noSlice).to.be.false;
            returnsNothing = chai.expect(results.xSlice).to.be.true;
            returnsNothing = chai.expect(results.ySlice).to.be.true;
        });

        it("Test slice in x axis", function() {
            var xSliceLeft = {'TopLeft': true, 'LowerLeft': true};
            var xSliceRight = {'TopRight': true, 'LowerRight': true};
            var results = slices.getSlices(xSliceLeft);
            var returnsNothing = chai.expect(results.noSlice).to.be.false;
            returnsNothing = chai.expect(results.xSlice).to.be.true;
            returnsNothing = chai.expect(results.ySlice).to.be.false;
            results = slices.getSlices(xSliceRight);
            returnsNothing = chai.expect(results.noSlice).to.be.false;
            returnsNothing = chai.expect(results.xSlice).to.be.true;
            returnsNothing = chai.expect(results.ySlice).to.be.false;
        });

        it("Test slice in y axis", function() {
            var ySliceTop = {'TopLeft': true, 'TopRight': true};
            var ySliceLower = {'LowerLeft': true, 'LowerRight': true};
            var results = slices.getSlices(ySliceTop);
            var returnsNothing = chai.expect(results.noSlice).to.be.false;
            returnsNothing = chai.expect(results.xSlice).to.be.false;
            returnsNothing = chai.expect(results.ySlice).to.be.true;
            results = slices.getSlices(ySliceLower);
            returnsNothing = chai.expect(results.noSlice).to.be.false;
            returnsNothing = chai.expect(results.xSlice).to.be.false;
            returnsNothing = chai.expect(results.ySlice).to.be.true;
        });

        it("Test no slice", function() {
            var noSliceTopLeft = {'TopLeft': true};
            var noSliceTopRight = {'TopRight': true};
            var noSliceLowerLeft = {'LowerLeft': true};
            var noSliceLowerRight = {'LowerRight': true};
            var results = slices.getSlices(noSliceTopLeft);
            var returnsNothing = chai.expect(results.noSlice).to.be.true;
            returnsNothing = chai.expect(results.xSlice).to.be.false;
            returnsNothing = chai.expect(results.ySlice).to.be.false;
            results = slices.getSlices(noSliceTopRight);
            returnsNothing = chai.expect(results.noSlice).to.be.true;
            returnsNothing = chai.expect(results.xSlice).to.be.false;
            returnsNothing = chai.expect(results.ySlice).to.be.false;
            results = slices.getSlices(noSliceLowerLeft);
            returnsNothing = chai.expect(results.noSlice).to.be.true;
            returnsNothing = chai.expect(results.xSlice).to.be.false;
            returnsNothing = chai.expect(results.ySlice).to.be.false;
            results = slices.getSlices(noSliceLowerRight);
            returnsNothing = chai.expect(results.noSlice).to.be.true;
            returnsNothing = chai.expect(results.xSlice).to.be.false;
            returnsNothing = chai.expect(results.ySlice).to.be.false;
        });
    });
});