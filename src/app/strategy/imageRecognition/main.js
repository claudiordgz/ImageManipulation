/*globals require, module, tracking*/
var util = require('../../util');
var image = require('../shared/image/main');
var faceRecognition = require('./faceRecognition/main');

function trackingJsFromLocalImage(imageElement, imageContainer, imgUrl,  width, height, imgClass) {
    'use strict';
    var tracker = new tracking.ObjectTracker(['face']);
    tracker.sourceElement = new image.ImagePack(width, height, '.' + imgClass, imageContainer);
    tracker.setStepSize(1.7);
    tracking.track(imageElement, tracker);
    tracker.on('track', function(event) {
        if (event.data.length === 0) {
            console.log('No elements found');
        } else {
            faceRecognition.faceTracking(event, this.sourceElement);
        }
    });
    return util.format('background-image: url(\'{0}\');  no-repeat center center fixed; \
        -webkit-background-size: cover; \
        -moz-background-size: cover; \
        -o-background-size: cover; \
        background-size: cover;', imgUrl);
}

module.exports = {
    policy: trackingJsFromLocalImage
};