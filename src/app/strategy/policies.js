/*globals module, require*/
var imageRecognition = require('faces/strategy/imageRecognition/main');
var widthHeightPositioning = require('faces/strategy/widthHeightPositioning/main');

module.exports = {
    trackingJs: imageRecognition.policy,
    widthHeightPositioning: widthHeightPositioning.policy
};