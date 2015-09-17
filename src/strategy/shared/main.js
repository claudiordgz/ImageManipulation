

function imageType(image) {
    var imageOrientation = 'square';
    if (image.width !== image.height) {
        if(image.width >  image.height) {
            imageOrientation = 'landscape';
        } else {
            imageOrientation = 'portrait';
        }
    }
    return imageOrientation;
}

module.exports = {
    imageType: imageType
};