/*globals require, $*/
var testbed = require('faces/testbed/main');
var imageProcessing = require('faces/strategy/main');

function main() {
    'use strict';
    var items = testbed.fromDirectorySmallSubset();
    imageProcessing.processImages(items);
}

$(document).one('ready', function() {
    'use strict';
    main();
});