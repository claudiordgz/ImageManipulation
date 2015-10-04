/*globals require, describe, it, console, assert*/
var chai    = require("chai");
var graphics = require('../../graphics');


describe("Parallelogram Object Testing", function() {
    'use strict';
    describe("isPointInside", function() {
        it("Checks that points in space are in Parallelogram", function() {
            var imageDummy = new graphics.Parallelogram().fromVertices(-4, 9, 3, -4);
            var facesDummy = new graphics.Parallelogram().fromVertices(-2, 7, 2, -2);
            for(var j=0;j!==facesDummy.vertices.pMembers.length;++j) {
                var currentVertex = facesDummy.vertices[facesDummy.vertices.pMembers[j]];
                var returnsNothing = chai.expect(imageDummy.isPointInside(currentVertex)).to.be.true;
            }
        });

        it("Checks that points in space are not in Parallelogram", function() {
            var imageDummy = new graphics.Parallelogram().fromVertices(-4, 9, 3, -4);
            var pointsNotInside = [
                new graphics.Vertex2D(-10, 7),
                new graphics.Vertex2D(-5, 1),
                new graphics.Vertex2D(2, 6),
                new graphics.Vertex2D(10, 0),
                new graphics.Vertex2D(-2, -6),
                new graphics.Vertex2D(-3, -9)
            ];
            for(var i=0;i!==pointsNotInside.length;++i) {
                var returnsNothing = chai.expect(imageDummy.isPointInside(pointsNotInside[i])).to.be.false;
            }
        });
    });
});