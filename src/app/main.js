/*globals require, $*/
var testbed = require('faces/testbed/main');
var imageProcessing = require('faces/strategy/main');

function main() {
    'use strict';
    var items = testbed.fromDirectorySmallSubset();
    //var items = testbed.fromDirectory();
    imageProcessing.processImages(items);
}

$(document).one('ready', function() {
    'use strict';
    main();
});