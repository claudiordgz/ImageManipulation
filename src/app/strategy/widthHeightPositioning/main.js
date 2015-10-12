/*globals require, module, console*/
var util = require('faceCentering/util/util');

function currentPolicy(imageElement, imageContainer, imgUrl, width, height, imgClass, cssStyleSheet) {
    'use strict';
    return {
        'background-image': util.format('url(\'{0}\')', imgUrl)
    };
}

module.exports = {
    policy: currentPolicy
};