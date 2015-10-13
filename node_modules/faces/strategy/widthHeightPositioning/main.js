/*globals require, module, console*/
var util = require('faceCentering/util/util');

function currentPolicy(imageElement, imageContainer, imgUrl, width, height, imgClass, cssStyleSheet) {
    'use strict';
    var extraProperty = {};
    if(width > height) {
        extraProperty['background-size'] = 'auto 100%';
    } else if(width < height) {
        extraProperty['background-size'] = '100% auto';
    } else {
        extraProperty['background-size'] = '100% auto';
    }
    extraProperty['background-image'] =  util.format('url(\'{0}\')', imgUrl);
    return extraProperty;
}

module.exports = {
    policy: currentPolicy
};