
/*
 * @class ImagePack
 * A utility class to save information about an image
 * retrieved from the web and the element to which we
 * have to add it to.
 * @property {number} width The width of the image from the source before any transformation
 * @property {number} height The height of the image from the source before any transformation
 * @property {string} imageClassName The class name style we have to alter
 * @property {Object} elementContainingImage The dom object that contains the image background
 */
function ImagePack (width, height, imageClassName, elementContainingImage) {
    this.width = width;
    this.height = height;
    this.imageClassName = imageClassName;
    this.elementContainingImage = elementContainingImage;
}

ImagePack.prototype.getOrientation = function() {
    var orientation = 'square';
    if (this.width > this.height) {
        orientation = 'landscape';
    } else if (this.width < this.height) {
        orientation = 'portrait';
    }
    return orientation;
};

module.exports = {
  ImagePack: ImagePack
};