var graphics = require('../graphics/main');

/*
 */
function setupImageFaceInsideContainer(width, height, offsetX, offsetY,
                                       imageWidth, imageHeight,
                                       containerWidth, containerHeight){
    var rectangleFace = new graphics.FaceContainer(width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight);
    rectangleFace.recalculateVerticesWithOffset();
    return rectangleFace;
}

function isPointInsideSpace() {

}

function calculateOverlay(){

}

function faceTracking(faceRecognizedEvent, imagePack){
    var faces = [];
    for(var i = 0; i != faceRecognizedEvent.data.length; ++i) {
        var data = faceRecognizedEvent.data[i];
        var containerProperties = util.getProperties(imagePack.elementContainingImage[0]);
        faces.push(setupImageFaceInsideContainer(data.width, data.height, data.x, data.y,
            imagePack.width,imagePack.height,
            containerProperties.width, containerProperties.height));
    }
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
    console.log('minX:' + minX + ' maxX:' + maxX + ' minY:' + minY + ' maxY:' + maxY);
}

module.exports = {
    faceTracking: faceTracking
};