/*globals module, require*/
var imageRecognition = require('./imageRecognition/main');
var widthHeightPositioning = require('./widthHeightPositioning/main');

module.exports = {
    trackingJs: imageRecognition.policy,
    widthHeightPositioning: widthHeightPositioning.policy
};