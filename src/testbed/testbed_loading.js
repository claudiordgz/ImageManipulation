util = require('../util');

function fromFile() {
    var items = null;
    $.ajaxSetup({async: false});
    $.get("js/assets/images.txt", function(data) {
        items = data.split('\n');
    });
    return items;
}

function retrieveFromFile(fileName){
    var items = null;
    $.ajaxSetup({async: false});
    var pathAndFileName = util.format("js/assets/{0}", fileName);
    $.get(pathAndFileName, function(data) {
        items = data.split('\n');
    });
    return items;
}

function completeAssetWithPath(images) {
    for(var i = 0; i !== images.length; ++i) {
        images[i] = '../trackingjs-playground/js/assets/img/' + images[i];
    }
}

function fromDirectorySmallSubset() {
    var items = retrieveFromFile('small_image_testbed.txt');
    completeAssetWithPath(items);
    return items;
}

function fromDirectory() {
    var items = retrieveFromFile('list.txt');
    completeAssetWithPath(items);
    return items;
}

module.exports = {
    fromDirectorySmallSubset: fromDirectorySmallSubset,
    fromDirectory: fromDirectory
};