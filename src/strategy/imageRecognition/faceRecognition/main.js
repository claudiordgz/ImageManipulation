var graphics = require('../graphics/main');

/*
 */
function setupImageFaceInsideContainer(width, height, offsetX, offsetY,
                                       imageWidth, imageHeight,
                                       containerWidth, containerHeight){
    var rectangleFace = new graphics.FaceContainer(width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight);
    rectangleFace.recalculateVerticesWithOffset();
    rectangleFace.resetVertices();
    rectangleFace.recalculateVerticesWithOffset();
    rectangleFace.resetVertices();
    rectangleFace.recalculateVerticesWithOffset();
    rectangleFace.resetVertices();
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
    console.log(faces);
}

module.exports = {
    faceTracking: faceTracking
};