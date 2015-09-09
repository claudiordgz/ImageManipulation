util = require('./util');

// cm_mobHeader_artist_overlay - The full header background div
// cm_mobHeader_artist_image - The circle div that will contain the image
// cm_mobHeader_artist-overlay--style - We will put everything related to the background of artist_overlay in here
// cm_mobHeader_artist-image--style - We will put everything related to background of artist_image in here
function defaultPolicy(index, element, imgUrl, policy) {
    var ovalBackgroundClassName = util.format('cm_mobHeader_artist-image--style-{0}', index);
    var overlayClassName = util.format('cm_mobHeader_artist-overlay--style-{0}', index);

    var overlayBackground = util.format('background-image: url(\'{0}\'); background-color: transparent;', imgUrl);
    util.createClass('.' + overlayClassName, overlayBackground);

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
    ovalImg.imageSrc = imgUrl;
    ovalImg.policy = policy;
    ovalImg.self = ovalImg;
    ovalImg.onload = function() {
        if(this.policy) {
            var container = this.element.find('.cm_mobHeader_artist_image');
            var style = this.policy(this.self, this.element, container, this.imageSrc, this.width, this.height, this.className);
//            console.log(style);
            util.createClass('.' + this.className, style);
            container.addClass(this.className);
        }
    };
    ovalImg.src = imgUrl;
}

function currentPolicy(imageElement, element, imageContainer, imgUrl, width, height, imgClass) {
//    console.log('Current Policy ' + width.toString() + 'x' + height.toString() +  ' ' + imgClass);
    return util.format('background-image: url(\'{0}\');', imgUrl);
}


function trackingJsPolicy(imageElement, element, imageContainer, imgUrl,  width, height, imgClass) {
    console.log('Tracking JS Policy ' + width.toString() + 'x' + height.toString() +  ' ' + imgClass);
    var canvas = document.createElement('canvas');

    var context = canvas.getContext('2d');

    context.drawImage(imageElement,0,0);
    return util.format('background-image: url(\'{0}\'); background-size: 100% auto;', canvas.toDataURL());
}

function trackingJsFromImage(imageElement, element, imageContainer, imgUrl,  width, height, imgClass) {
//    console.log('Image as Background Policy ' + width.toString() + 'x' + height.toString() +  ' ' + imgClass );
    var containerHeight = Math.max(imageContainer[0].clientHeight,imageContainer[0].offsetHeight, imageContainer[0].scrollHeight);
    var containerWidth = Math.max(imageContainer[0].clientWidth,imageContainer[0].offsetWidth, imageContainer[0].scrollWidth);
    var tracker = new tracking.ObjectTracker(['face']);
    tracker.sourceElement = {
        width: width,
        height: height,
        element: element,
        imageElement: imageElement,
        imgClass: imgClass
    };
    tracker.setStepSize(1.7);
    tracking.track(imageElement, tracker);
    tracker.on('track', function(event) {
        event.sourceElement = this.sourceElement;
        if (event.data.length === 0) {
            console.log('No elements found');
        } else {
            event.data.forEach(function(rect) {
                console.log(event.sourceElement.imgClass);
                window.plot(event.sourceElement.imageElement, '.' + event.sourceElement.imgClass,
                    rect.x, rect.y, rect.width, rect.height);
            });
        }
    });
    return util.format('background-image: url(\'{0}\');', imgUrl);
}

function appendElement(index, imageUrl, row, element, policy, subPolicy) {
    var card = element({
        'songName': 'Song Name',
        'artistName': 'Artist Name'
    });
    policy(index, card, imageUrl, subPolicy);
    $(row).append(card);
}

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

function fromDirectorySmallSubset() {
    return retrieveFromFile('small_image_testbed.txt');
}

function fromDirectory() {
    return retrieveFromFile('list.txt');
}

function completeAssetWithPath(images) {
    for(var i = 0; i !== images.length; ++i) {
        images[i] = '../trackingjs-playground/js/assets/img/' + images[i];
    }
}

function main() {
    var items = fromDirectorySmallSubset();
    completeAssetWithPath(items);

    for(i = 0; i !== items.length; ++i) {
        var row = ich.elRow();
        var indexString = i.toString();
        appendElement(indexString+'-a', items[i], row, ich.element, defaultPolicy, trackingJsFromImage);
        appendElement(indexString+'-b', items[i], row, ich.element, defaultPolicy, currentPolicy);
        appendElement(indexString+'-c', items[i], row, ich.element, defaultPolicy, currentPolicy);
        $(".mass").append(row);
    }
}

window.plot = function(imageElement, className, x, y, w, h) {
    var rect = document.createElement('div');
    document.querySelector(className).appendChild(rect);
    rect.classList.add('rect');
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    console.log(imageElement.offsetLeft + ' ' + imageElement.offsetTop);
    rect.style.left = (imageElement.offsetLeft + x) + 'px';
    rect.style.top = (imageElement.offsetTop + y) + 'px';
};

$(document).one('ready', function() {
    main();
});