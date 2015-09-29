/*globals require, console, module*/
var graphics = require('graphics');
var util = require('faces/util');

/*
 */
function setupImageFaceInsideContainer(width, height, offsetX, offsetY,
                                       imageWidth, imageHeight,
                                       containerWidth, containerHeight){
    'use strict';
    var rectangleFace = new graphics.FaceContainer(width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight);
    rectangleFace.recalculateVerticesWithOffset();
    return rectangleFace;
}

function calculateBigBoxEncompassingFaces(faces){
    'use strict';
    var minX = faces[0].vertices.OO.x || 0,
        maxX = faces[0].vertices.OA.x || 0,
        minY = faces[0].vertices.OO.y || 0,
        maxY = faces[0].vertices.OC.y || 0;
    if(faces.length > 1) {
        faces.sort(function(a, b) {
            return a.vertices.OO.x - b.vertices.OO.x;
        });
        minX = faces[0].vertices.OO.x || 0;
        maxX = faces[faces.length-1].vertices.OA.x || 0;
        faces.sort(function(a, b) {
            return a.vertices.OO.y - b.vertices.OO.y;
        });
        minY = faces[0].vertices.OO.y || 0;
        maxY = faces[faces.length-1].vertices.OC.y || 0;
    }
    return new graphics.FaceContainer(maxX - minX, maxY - minY, minX, minY,
        faces[0].sourceWidth, faces[0].sourceHeight,
        faces[0].targetWidth, faces[0].targetHeight);
}

function retrieveFacesInImage(faceRecognizedEvent, imagePack) {
    'use strict';
    var faces = [];
    for(var i = 0; i !== faceRecognizedEvent.data.length; ++i) {
        var data = faceRecognizedEvent.data[i];
        var containerProperties = util.getProperties(imagePack.elementContainingImage[0]);
        faces.push(setupImageFaceInsideContainer(data.width, data.height, data.x, data.y,
            imagePack.width,imagePack.height,
            containerProperties.width, containerProperties.height));
    }
    return faces;
}


/* @function findFacesQuadrant
 * We partition the image in four quadrants and find the percentages
 * and quadrants being touched by the faces container
 * @param {FaceContainer} The one box to hold all faces in the image
 */
function quadrantsPercentagesPerFaceArea(encompassingContainer) {
    'use strict';
    console.log(encompassingContainer);
}

function faceCentering(faceRecognizedEvent, imagePack){
    'use strict';
    var faces = retrieveFacesInImage(faceRecognizedEvent, imagePack);
    var encompassingContainer = calculateBigBoxEncompassingFaces(faces);
    quadrantsPercentagesPerFaceArea(encompassingContainer);
}

module.exports = {
    faceCentering: faceCentering
};