/*globals require, $*/
var testbed = require('./testbed/main');
var imageProcessing = require('./strategy/main');

function main() {
    'use strict';
    var items = testbed.fromDirectorySmallSubset();
    imageProcessing.processImages(items);
}

$(document).one('ready', function() {
    'use strict';
    main();
});