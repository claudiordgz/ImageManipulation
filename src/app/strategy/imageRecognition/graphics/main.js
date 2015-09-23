/*globals require, module*/
var faceContainer = require('faces/strategy/imageRecognition/graphics/faceContainer');
var parallelogram = require('faces/strategy/imageRecognition/graphics/parallelogram');
var vertex = require('faces/strategy/imageRecognition/graphics/vertex');
var util = require('faces/strategy/imageRecognition/graphics/util');

module.exports = {
    FaceContainer: faceContainer.FaceContainer,
    Parallelogram: parallelogram.Parallelogram,
    Vertex2D: vertex.Vertex2D,
    squareOverlap: util.squareOverlap
};