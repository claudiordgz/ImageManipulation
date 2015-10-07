/*globals require, module*/
var collision = require('./collision');
var areas = require('./areaPercentages');
var graphics = require('./graphics');


function getFaceBoxPercentagePerQuadrant(faceBox) {
    'use strict';
    var faceBoxCollisionMap = collision.squareOverlap(faceBox);
    var percentagesPerQuadrant = areas.calculateAreasForPoints(faceBox, faceBoxCollisionMap);
    for(var key in percentagesPerQuadrant) {
        if(faceBoxCollisionMap[key] !== undefined) {
            faceBoxCollisionMap[key].percent = percentagesPerQuadrant[key].percent;
        }
    }
    return faceBoxCollisionMap;
}

module.exports = {
    GetFaceBoxPercentagePerQuadrant: getFaceBoxPercentagePerQuadrant,
    FaceContainer: graphics.FaceContainer,
    Parallelogram: graphics.Parallelogram,
    Vertex2D: graphics.Vertex2D,
    ImagePack: graphics.ImagePack,
    ParallelogramVertexSet:graphics.ParallelogramVertexSet
};