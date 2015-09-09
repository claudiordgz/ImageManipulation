testbed = require('./testbed/main');
imageProcessing = require('./strategy/main');

function main() {
    var items = testbed.fromDirectorySmallSubset();
    imageProcessing.processImages(items);
}

$(document).one('ready', function() {
    main();
});