/*globals require, describe, it*/
var expect    = require("chai").expect;
var utilities = require("faces/strategy/imageRecognition/graphics/util");

describe("Image partitioning process", function() {
    'use strict';
    describe("Partition Images in 4 Quadrants", function() {
        it("Returns 4 parallelograms of X1,X2,Y1,Y2 vertices that are inside an Image", function() {
            var portraitParallelograms = utilities.partitionSquareIntoFour({width: 100, height: 200});
            var landscapeParallelograms = utilities.partitionSquareIntoFour({width: 200, height: 100});
            var squareParallelograms = utilities.partitionSquareIntoFour({width: 200, height: 200});
            var testbed = [portraitParallelograms, landscapeParallelograms, squareParallelograms];
            var results = [
                [
                    {X1: 0,X2: 50,Y1: 0,Y2: 100},
                    {X1: 50,X2: 100,Y1: 0,Y2: 100},
                    {X1: 0,X2: 50,Y1: 100,Y2: 200},
                    {X1: 50,X2: 100,Y1: 100,Y2: 200}
                ],
                [
                    {X1: 0,X2: 100,Y1: 0,Y2: 50},
                    {X1: 100,X2: 200,Y1: 0,Y2: 50},
                    {X1: 0,X2: 100,Y1: 50,Y2: 100},
                    {X1: 100,X2: 200,Y1: 50,Y2: 100}
                ],
                [
                    {X1: 0,X2: 100,Y1: 0,Y2: 100},
                    {X1: 100,X2: 200,Y1: 0,Y2: 100},
                    {X1: 0,X2: 100,Y1: 100,Y2: 200},
                    {X1: 100,X2: 200,Y1: 100,Y2: 200}
                ]
            ];
            for(var j = 0;j !== testbed.length; ++j) {
                var currentTest = testbed[j];
                var currentResults = results[j];
                for (var i = 0; i !== currentResults.length; ++i) {
                    var resultParallelogram = currentResults[i];
                    var parallelogram = currentTest[i];
                    for (var key in resultParallelogram) {
                        if (resultParallelogram.hasOwnProperty(key)) {
                            expect(parallelogram[key]).to.equal(resultParallelogram[key]);
                        }
                    }
                }
            }
        });
    });
});