/*globals require, module, $*/
var util = require('faces/util');

function fromFile() {
    'use strict';
    var items = null;
    $.ajaxSetup({async: false});
    $.get("js/assets/images.txt", function(data) {
        items = data.split('\n');
    });
    return items;
}

function retrieveFromFile(fileName){
    'use strict';
    var items = null;
    $.ajaxSetup({async: false});
    var pathAndFileName = util.format("js/assets/{0}", fileName);
    $.get(pathAndFileName, function(data) {
        items = data.split('\n');
    });
    return items;
}

function completeAssetWithPath(images) {
    'use strict';
    for(var i = 0; i !== images.length; ++i) {
        images[i] = '../faces/js/assets/img/' + images[i];
    }
}

function fromDirectorySmallSubset() {
    'use strict';
    var items = retrieveFromFile('small_image_testbed.txt');
    completeAssetWithPath(items);
    return items;
}

function fromDirectory() {
    'use strict';
    var items = retrieveFromFile('list.txt');
    completeAssetWithPath(items);
    return items;
}

module.exports = {
    fromDirectorySmallSubset: fromDirectorySmallSubset,
    fromDirectory: fromDirectory
};