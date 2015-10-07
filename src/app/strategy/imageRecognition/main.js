/*globals require, module, tracking, console*/
var util = require('faceCentering/util/util');
var graphics = require('graphics');
var faces = require('faceCentering');

function trackingJsFromLocalImage(imageElement, imageContainer, imgUrl,  width, height, imgClass) {
    'use strict';
    var tracker = new tracking.ObjectTracker(['face']);
    tracker.sourceElement = new graphics.ImagePack(width, height, '.' + imgClass, imageContainer, imgUrl);
    tracker.setStepSize(1.7);
    tracking.track(imageElement, tracker);
    tracker.on('track', function(event) {
        if (event.data.length === 0) {
            console.log('No elements found');
        } else {
            faces.faceCentering(event, this.sourceElement);
        }
    });
    /*jshint multistr: true */
    return util.format('background-image: url(\'{0}\');  no-repeat center center fixed; \
        -webkit-background-size: cover; \
        -moz-background-size: cover; \
        -o-background-size: cover; \
        background-size: cover;', imgUrl);
}

module.exports = {
    policy: trackingJsFromLocalImage
};