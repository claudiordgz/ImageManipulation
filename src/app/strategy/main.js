/*globals require,module, ich, $, cssjs*/
var util = require('faceCentering/util/util');
var policies = require('faces/strategy/policies');

// cm_mobHeader_artist_overlay - The full header background div
// cm_mobHeader_artist_image - The circle div that will contain the image
// cm_mobHeader_artist-overlay--style - We will put everything related to the background of artist_overlay in here
// cm_mobHeader_artist-image--style - We will put everything related to background of artist_image in here
function defaultPolicy(index, element, imgUrl, policy) {
    'use strict';
    var ovalBackgroundClassName = util.format('cm_mobHeader_artist-image--style-{0}', index);

    var overlayClassName = util.format('cm_mobHeader_artist-overlay--style-{0}', index);
    var overlayBackground = {
            'background-image': util.format('url(\'{0}\')', imgUrl),
        'background-color': 'transparent'
    };

    var sheet = cssjs.newSheet();
    sheet.selector('.' + overlayClassName, overlayBackground);

    var overlayImg = new Image();
    overlayImg.element = element;
    overlayImg.overlayClassName = overlayClassName;
    overlayImg.onload = function() {
        this.element.find('.cm_mobHeader_artist_overlay').addClass(this.overlayClassName);
    };
    overlayImg.src = imgUrl;

    var ovalImg = new Image();

    ovalImg.element = element;
    ovalImg.className = ovalBackgroundClassName;
    ovalImg.css = sheet;
    ovalImg.imageSrc = imgUrl;
    ovalImg.policy = policy;
    ovalImg.self = ovalImg;
    ovalImg.onload = function() {
        if(this.policy) {
            var imageContainerClassName = '.cm_mobHeader_artist_image';
            var container = this.element.find(imageContainerClassName);
                container.containerProperties = util.getProperties(container[0]);
            var style = this.policy(this.self, container, this.imageSrc, this.width, this.height, this.className);
            if(style !== undefined) {
                sheet.selector('.' + this.className, style);
            }
            container.addClass(this.className);
        }
    };
    ovalImg.src = imgUrl;
}

function appendElement(index, imageUrl, row, element, policy, subPolicy) {
    'use strict';
    var card = element({
        'songName': 'Song Name',
        'artistName': 'Artist Name'
    });
    policy(index, card, imageUrl, subPolicy);
    $(row).append(card);
}

function processImages(images){
    'use strict';
    for(var i = 0; i !== images.length; ++i) {
        var row = ich.elRow();
        var indexString = i.toString();
        appendElement(indexString+'-a', images[i], row, ich.element, defaultPolicy, policies.trackingJs);
        appendElement(indexString+'-b', images[i], row, ich.element, defaultPolicy, policies.widthHeightPositioning);
        appendElement(indexString+'-c', images[i], row, ich.element, defaultPolicy, policies.widthHeightPositioning);
        $(".mass").append(row);
    }
}

module.exports = {
    processImages: processImages
};