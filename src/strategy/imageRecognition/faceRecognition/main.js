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
    faces.sort(function(a, b) {
        return a.vertices.OO.x - b.vertices.OO.x;
    });
    faces.sort(function(a, b) {
        return a.vertices.OO.y - b.vertices.OO.y;
    });

}

module.exports = {
    faceTracking: faceTracking
};