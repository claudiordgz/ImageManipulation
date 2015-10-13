/*globals require, $, cssjs*/
var testbed = require('faces/testbed/main');
var imageProcessing = require('faces/strategy/main');

window.items = testbed.fromDirectory();
window.index = 0;
window.sheet = cssjs.newSheet();

function main(images, sheet, alterIndex) {
    'use strict';
    if(images.length > 0){
        imageProcessing.processImages(images, sheet, alterIndex);
    }
}

$(document).one('ready', function() {
    'use strict';
    main(window.items.slice(window.index,2), window.sheet, window.index);

    $(document).on("click", '.nextButton',function(e){
        $(".mass").html('');
        if(window.index === window.items.length - 1) {
            window.index = 0;
        } else {
            window.index += 2;
        }
        window.sheet.remove();
        window.sheet = cssjs.newSheet();
        main(window.items.slice(window.index,window.index+2), window.sheet, window.index);
    });
});