/*globals require, $*/
var testbed = require('faces/testbed/main');
var imageProcessing = require('faces/strategy/main');

window.items = testbed.fromDirectory();
window.index = 0;

function main(images) {
    'use strict';
    if(images.length > 0){
        imageProcessing.processImages(images);
    }
}

$(document).one('ready', function() {
    'use strict';
    main(window.items.slice(window.index,2));

    $(document).on("click", '.nextButton',function(e){
        $(".mass").html('');
        if(window.index === window.items.length - 1) {
            window.index = 0;
        } else {
            window.index += 2;
        }
        main(window.items.slice(window.index,window.index+2));
    });
});