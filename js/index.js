(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
testbed = require('./testbed/main');
imageProcessing = require('./strategy/main');

function main() {
    var items = testbed.fromDirectorySmallSubset();
    imageProcessing.processImages(items);
}

$(document).one('ready', function() {
    main();
});
},{"./strategy/main":4,"./testbed/main":7}],2:[function(require,module,exports){
util = require('../../util');
plot = require('./square_debugging');

function trackingJsFromLocalImage(imageElement, element, imageContainer, imgUrl,  width, height, imgClass) {
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
                plot.plotSquare(event.sourceElement.imageElement, '.' + event.sourceElement.imgClass, rect.x, rect.y, rect.width, rect.height);
            });
        }
    });
    return util.format('background-image: url(\'{0}\');', imgUrl);
}

module.exports = {
    policy: trackingJsFromLocalImage
};
},{"../../util":10,"./square_debugging":3}],3:[function(require,module,exports){

function plotSquare(imageElement, className, x, y, w, h) {
    var rect = document.createElement('div');
    document.querySelector(className).appendChild(rect);
    rect.classList.add('rect');
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    console.log(imageElement.offsetLeft + ' ' + imageElement.offsetTop);
    rect.style.left = (imageElement.offsetLeft + x) + 'px';
    rect.style.top = (imageElement.offsetTop + y) + 'px';
}

module.exports = {
    plotSquare: plotSquare
};
},{}],4:[function(require,module,exports){
util = require('../util');
policies = require('./policies')

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
            util.createClass('.' + this.className, style);
            container.addClass(this.className);
        }
    };
    ovalImg.src = imgUrl;
}

function appendElement(index, imageUrl, row, element, policy, subPolicy) {
    var card = element({
        'songName': 'Song Name',
        'artistName': 'Artist Name'
    });
    policy(index, card, imageUrl, subPolicy);
    $(row).append(card);
}

function processImages(images){
    for(i = 0; i !== images.length; ++i) {
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
},{"../util":10,"./policies":5}],5:[function(require,module,exports){
/**
 * Created by crodriguez2 on 9/9/15.
 */
imageRecognition = require('./imageRecognition/main');
widthHeightPositioning = require('./widthHeightPositioning/main');

module.exports = {
    trackingJs: imageRecognition.policy,
    widthHeightPositioning: widthHeightPositioning.policy
};
},{"./imageRecognition/main":2,"./widthHeightPositioning/main":6}],6:[function(require,module,exports){
util = require('../../util');

function currentPolicy(imageElement, element, imageContainer, imgUrl, width, height, imgClass) {
//    console.log('Current Policy ' + width.toString() + 'x' + height.toString() +  ' ' + imgClass);
    return util.format('background-image: url(\'{0}\');', imgUrl);
}

module.exports = {
    policy: currentPolicy
};
},{"../../util":10}],7:[function(require,module,exports){
fromVariable = require('./testbed_variable');
fromFiles = require('./testbed_loading');

module.exports = {
    fromDirectorySmallSubset: fromFiles.fromDirectorySmallSubset,
    fromDirectory: fromFiles.fromDirectory,
    image_list: fromVariable.image_list
};
},{"./testbed_loading":8,"./testbed_variable":9}],8:[function(require,module,exports){
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
},{"../util":10}],9:[function(require,module,exports){
/*  The test bed
 Images were pulled from several sites
 */
var image_list = [
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/848/MI0003848198.jpg?partner=allrovi.com',
    'https://a248.e.akamai.net/f/1726/3609/1m/media.cmgdigital.com/shared/img/photos/2014/06/20/ad/bb/Jeanne_Headshot_2.jpg',
    'https://a248.e.akamai.net/f/1726/3609/1m/media.cmgdigital.com/shared/lt/lt_cache/thumbnail/292/img/staff/2014/386998_512092287718_750833973_n.jpg',
    'https://a248.e.akamai.net/f/1726/3609/1m/media.cmgdigital.com/shared/lt/lt_cache/thumbnail/908/img/photos/2011/08/01/mookie.jpg',
    'https://s-media-cache-ak0.pinimg.com/236x/88/e3/4c/88e34c17bf76c1d5178b0ce08d9934e6.jpg',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/361/MI0003361490.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/497/MI0003497930.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/627/MI0003627097.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/418/MI0001418164.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/495/MI0003495398.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/277/MI0003277352.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/405/MI0001405664.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/590/MI0003590626.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/877/MI0003877513.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/388/MI0003388458.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/348/MI0003348271.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/358/MI0003358377.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/594/MI0003594278.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/090/MI0003090459.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/484/MI0003484215.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/877/MI0003877705.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/798/MI0003798761.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/397/MI0001397350.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/627/MI0003627193.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/404/MI0001404843.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/436/MI0003436833.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/347/MI0003347847.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/360/MI0003360551.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/413/MI0001413988.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/842/MI0003842964.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/327/MI0001327893.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/770/MI0003770022.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/840/MI0003840529.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/584/MI0003584762.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/795/MI0003795325.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/803/MI0003803855.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/840/MI0003840374.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/832/MI0003832775.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/802/MI0003802021.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/795/MI0003795324.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/535/MI0003535164.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/854/MI0003854385.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/795/MI0003795321.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/840/MI0003840183.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/867/MI0003867863.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/903/MI0003903748.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/869/MI0003869675.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/814/MI0003814405.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/273/MI0003273649.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/837/MI0003837167.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/045/MI0003045399.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/433/MI0003433721.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/709/MI0003709783.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/592/MI0003592855.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/859/MI0003859455.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/182/MI0003182022.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/832/MI0003832974.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/779/MI0003779361.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/848/MI0003848198.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/328/MI0001328037.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/888/MI0003888856.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/399/MI0001399175.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/327/MI0001327874.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/345/MI0001345160.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/481/MI0003481272.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/874/MI0003874107.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/752/MI0003752413.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/436/MI0003436909.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/395/MI0001395010.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/849/MI0003849319.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/421/MI0003421888.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/874/MI0003874501.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/364/MI0001364912.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/709/MI0003709999.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/465/MI0001465413.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/406/MI0001406460.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/720/MI0003720987.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/326/MI0001326338.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/888/MI0003888881.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/879/MI0003879160.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/879/MI0003879885.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/325/MI0001325433.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/364/MI0003364458.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/879/MI0003879671.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/571/MI0003571143.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/828/MI0003828479.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/891/MI0003891169.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/402/MI0001402140.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/641/MI0003641474.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/351/MI0003351373.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/276/MI0003276341.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/689/MI0003689189.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/835/MI0003835479.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/401/MI0001401684.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0002/749/MI0002749679.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/590/MI0003590035.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/892/MI0003892823.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/594/MI0003594464.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/732/MI0003732467.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/329/MI0001329620.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/405/MI0001405078.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/366/MI0001366608.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/329/MI0001329528.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/712/MI0003712617.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/336/MI0001336784.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/148/MI0003148875.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/445/MI0003445129.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/378/MI0003378772.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/399/MI0001399345.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/401/MI0001401588.jpg?partner=allrovi.com' ];

module.exports = {
    image_list: image_list
};

},{}],10:[function(require,module,exports){
/*

 */
function createClass(name,rules){
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if(!(style.sheet||{}).insertRule)
        (style.styleSheet || style.sheet).addRule(name, rules);
    else
        style.sheet.insertRule(name+"{"+rules+"}",0);
}

/*

 */
format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};

module.exports = {
    createClass: createClass,
    format: format
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9zdHJhdGVneS9pbWFnZVJlY29nbml0aW9uL21haW4uanMiLCJzcmMvc3RyYXRlZ3kvaW1hZ2VSZWNvZ25pdGlvbi9zcXVhcmVfZGVidWdnaW5nLmpzIiwic3JjL3N0cmF0ZWd5L21haW4uanMiLCJzcmMvc3RyYXRlZ3kvcG9saWNpZXMuanMiLCJzcmMvc3RyYXRlZ3kvd2lkdGhIZWlnaHRQb3NpdGlvbmluZy9tYWluLmpzIiwic3JjL3Rlc3RiZWQvbWFpbi5qcyIsInNyYy90ZXN0YmVkL3Rlc3RiZWRfbG9hZGluZy5qcyIsInNyYy90ZXN0YmVkL3Rlc3RiZWRfdmFyaWFibGUuanMiLCJzcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ0ZXN0YmVkID0gcmVxdWlyZSgnLi90ZXN0YmVkL21haW4nKTtcbmltYWdlUHJvY2Vzc2luZyA9IHJlcXVpcmUoJy4vc3RyYXRlZ3kvbWFpbicpO1xuXG5mdW5jdGlvbiBtYWluKCkge1xuICAgIHZhciBpdGVtcyA9IHRlc3RiZWQuZnJvbURpcmVjdG9yeVNtYWxsU3Vic2V0KCk7XG4gICAgaW1hZ2VQcm9jZXNzaW5nLnByb2Nlc3NJbWFnZXMoaXRlbXMpO1xufVxuXG4kKGRvY3VtZW50KS5vbmUoJ3JlYWR5JywgZnVuY3Rpb24oKSB7XG4gICAgbWFpbigpO1xufSk7IiwidXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKTtcbnBsb3QgPSByZXF1aXJlKCcuL3NxdWFyZV9kZWJ1Z2dpbmcnKTtcblxuZnVuY3Rpb24gdHJhY2tpbmdKc0Zyb21Mb2NhbEltYWdlKGltYWdlRWxlbWVudCwgZWxlbWVudCwgaW1hZ2VDb250YWluZXIsIGltZ1VybCwgIHdpZHRoLCBoZWlnaHQsIGltZ0NsYXNzKSB7XG4vLyAgICBjb25zb2xlLmxvZygnSW1hZ2UgYXMgQmFja2dyb3VuZCBQb2xpY3kgJyArIHdpZHRoLnRvU3RyaW5nKCkgKyAneCcgKyBoZWlnaHQudG9TdHJpbmcoKSArICAnICcgKyBpbWdDbGFzcyApO1xuICAgIHZhciBjb250YWluZXJIZWlnaHQgPSBNYXRoLm1heChpbWFnZUNvbnRhaW5lclswXS5jbGllbnRIZWlnaHQsaW1hZ2VDb250YWluZXJbMF0ub2Zmc2V0SGVpZ2h0LCBpbWFnZUNvbnRhaW5lclswXS5zY3JvbGxIZWlnaHQpO1xuICAgIHZhciBjb250YWluZXJXaWR0aCA9IE1hdGgubWF4KGltYWdlQ29udGFpbmVyWzBdLmNsaWVudFdpZHRoLGltYWdlQ29udGFpbmVyWzBdLm9mZnNldFdpZHRoLCBpbWFnZUNvbnRhaW5lclswXS5zY3JvbGxXaWR0aCk7XG4gICAgdmFyIHRyYWNrZXIgPSBuZXcgdHJhY2tpbmcuT2JqZWN0VHJhY2tlcihbJ2ZhY2UnXSk7XG4gICAgdHJhY2tlci5zb3VyY2VFbGVtZW50ID0ge1xuICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICBpbWFnZUVsZW1lbnQ6IGltYWdlRWxlbWVudCxcbiAgICAgICAgaW1nQ2xhc3M6IGltZ0NsYXNzXG4gICAgfTtcbiAgICB0cmFja2VyLnNldFN0ZXBTaXplKDEuNyk7XG4gICAgdHJhY2tpbmcudHJhY2soaW1hZ2VFbGVtZW50LCB0cmFja2VyKTtcbiAgICB0cmFja2VyLm9uKCd0cmFjaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnNvdXJjZUVsZW1lbnQgPSB0aGlzLnNvdXJjZUVsZW1lbnQ7XG4gICAgICAgIGlmIChldmVudC5kYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGVsZW1lbnRzIGZvdW5kJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBldmVudC5kYXRhLmZvckVhY2goZnVuY3Rpb24ocmVjdCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnNvdXJjZUVsZW1lbnQuaW1nQ2xhc3MpO1xuICAgICAgICAgICAgICAgIHBsb3QucGxvdFNxdWFyZShldmVudC5zb3VyY2VFbGVtZW50LmltYWdlRWxlbWVudCwgJy4nICsgZXZlbnQuc291cmNlRWxlbWVudC5pbWdDbGFzcywgcmVjdC54LCByZWN0LnksIHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHV0aWwuZm9ybWF0KCdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFwnezB9XFwnKTsnLCBpbWdVcmwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwb2xpY3k6IHRyYWNraW5nSnNGcm9tTG9jYWxJbWFnZVxufTsiLCJcbmZ1bmN0aW9uIHBsb3RTcXVhcmUoaW1hZ2VFbGVtZW50LCBjbGFzc05hbWUsIHgsIHksIHcsIGgpIHtcbiAgICB2YXIgcmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY2xhc3NOYW1lKS5hcHBlbmRDaGlsZChyZWN0KTtcbiAgICByZWN0LmNsYXNzTGlzdC5hZGQoJ3JlY3QnKTtcbiAgICByZWN0LnN0eWxlLndpZHRoID0gdyArICdweCc7XG4gICAgcmVjdC5zdHlsZS5oZWlnaHQgPSBoICsgJ3B4JztcbiAgICBjb25zb2xlLmxvZyhpbWFnZUVsZW1lbnQub2Zmc2V0TGVmdCArICcgJyArIGltYWdlRWxlbWVudC5vZmZzZXRUb3ApO1xuICAgIHJlY3Quc3R5bGUubGVmdCA9IChpbWFnZUVsZW1lbnQub2Zmc2V0TGVmdCArIHgpICsgJ3B4JztcbiAgICByZWN0LnN0eWxlLnRvcCA9IChpbWFnZUVsZW1lbnQub2Zmc2V0VG9wICsgeSkgKyAncHgnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwbG90U3F1YXJlOiBwbG90U3F1YXJlXG59OyIsInV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5wb2xpY2llcyA9IHJlcXVpcmUoJy4vcG9saWNpZXMnKVxuXG4vLyBjbV9tb2JIZWFkZXJfYXJ0aXN0X292ZXJsYXkgLSBUaGUgZnVsbCBoZWFkZXIgYmFja2dyb3VuZCBkaXZcbi8vIGNtX21vYkhlYWRlcl9hcnRpc3RfaW1hZ2UgLSBUaGUgY2lyY2xlIGRpdiB0aGF0IHdpbGwgY29udGFpbiB0aGUgaW1hZ2Vcbi8vIGNtX21vYkhlYWRlcl9hcnRpc3Qtb3ZlcmxheS0tc3R5bGUgLSBXZSB3aWxsIHB1dCBldmVyeXRoaW5nIHJlbGF0ZWQgdG8gdGhlIGJhY2tncm91bmQgb2YgYXJ0aXN0X292ZXJsYXkgaW4gaGVyZVxuLy8gY21fbW9iSGVhZGVyX2FydGlzdC1pbWFnZS0tc3R5bGUgLSBXZSB3aWxsIHB1dCBldmVyeXRoaW5nIHJlbGF0ZWQgdG8gYmFja2dyb3VuZCBvZiBhcnRpc3RfaW1hZ2UgaW4gaGVyZVxuZnVuY3Rpb24gZGVmYXVsdFBvbGljeShpbmRleCwgZWxlbWVudCwgaW1nVXJsLCBwb2xpY3kpIHtcbiAgICB2YXIgb3ZhbEJhY2tncm91bmRDbGFzc05hbWUgPSB1dGlsLmZvcm1hdCgnY21fbW9iSGVhZGVyX2FydGlzdC1pbWFnZS0tc3R5bGUtezB9JywgaW5kZXgpO1xuXG4gICAgdmFyIG92ZXJsYXlDbGFzc05hbWUgPSB1dGlsLmZvcm1hdCgnY21fbW9iSGVhZGVyX2FydGlzdC1vdmVybGF5LS1zdHlsZS17MH0nLCBpbmRleCk7XG4gICAgdmFyIG92ZXJsYXlCYWNrZ3JvdW5kID0gdXRpbC5mb3JtYXQoJ2JhY2tncm91bmQtaW1hZ2U6IHVybChcXCd7MH1cXCcpOyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsnLCBpbWdVcmwpO1xuICAgIHV0aWwuY3JlYXRlQ2xhc3MoJy4nICsgb3ZlcmxheUNsYXNzTmFtZSwgb3ZlcmxheUJhY2tncm91bmQpO1xuXG4gICAgdmFyIG92ZXJsYXlJbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBvdmVybGF5SW1nLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIG92ZXJsYXlJbWcub3ZlcmxheUNsYXNzTmFtZSA9IG92ZXJsYXlDbGFzc05hbWU7XG4gICAgb3ZlcmxheUltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5jbV9tb2JIZWFkZXJfYXJ0aXN0X292ZXJsYXknKS5hZGRDbGFzcyh0aGlzLm92ZXJsYXlDbGFzc05hbWUpO1xuICAgIH07XG4gICAgb3ZlcmxheUltZy5zcmMgPSBpbWdVcmw7XG5cbiAgICB2YXIgb3ZhbEltZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgb3ZhbEltZy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICBvdmFsSW1nLmNsYXNzTmFtZSA9IG92YWxCYWNrZ3JvdW5kQ2xhc3NOYW1lO1xuICAgIG92YWxJbWcuaW1hZ2VTcmMgPSBpbWdVcmw7XG4gICAgb3ZhbEltZy5wb2xpY3kgPSBwb2xpY3k7XG4gICAgb3ZhbEltZy5zZWxmID0gb3ZhbEltZztcbiAgICBvdmFsSW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLnBvbGljeSkge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudC5maW5kKCcuY21fbW9iSGVhZGVyX2FydGlzdF9pbWFnZScpO1xuICAgICAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5wb2xpY3kodGhpcy5zZWxmLCB0aGlzLmVsZW1lbnQsIGNvbnRhaW5lciwgdGhpcy5pbWFnZVNyYywgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHRoaXMuY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIHV0aWwuY3JlYXRlQ2xhc3MoJy4nICsgdGhpcy5jbGFzc05hbWUsIHN0eWxlKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLmNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIG92YWxJbWcuc3JjID0gaW1nVXJsO1xufVxuXG5mdW5jdGlvbiBhcHBlbmRFbGVtZW50KGluZGV4LCBpbWFnZVVybCwgcm93LCBlbGVtZW50LCBwb2xpY3ksIHN1YlBvbGljeSkge1xuICAgIHZhciBjYXJkID0gZWxlbWVudCh7XG4gICAgICAgICdzb25nTmFtZSc6ICdTb25nIE5hbWUnLFxuICAgICAgICAnYXJ0aXN0TmFtZSc6ICdBcnRpc3QgTmFtZSdcbiAgICB9KTtcbiAgICBwb2xpY3koaW5kZXgsIGNhcmQsIGltYWdlVXJsLCBzdWJQb2xpY3kpO1xuICAgICQocm93KS5hcHBlbmQoY2FyZCk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NJbWFnZXMoaW1hZ2VzKXtcbiAgICBmb3IoaSA9IDA7IGkgIT09IGltYWdlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgcm93ID0gaWNoLmVsUm93KCk7XG4gICAgICAgIHZhciBpbmRleFN0cmluZyA9IGkudG9TdHJpbmcoKTtcbiAgICAgICAgYXBwZW5kRWxlbWVudChpbmRleFN0cmluZysnLWEnLCBpbWFnZXNbaV0sIHJvdywgaWNoLmVsZW1lbnQsIGRlZmF1bHRQb2xpY3ksIHBvbGljaWVzLnRyYWNraW5nSnMpO1xuICAgICAgICBhcHBlbmRFbGVtZW50KGluZGV4U3RyaW5nKyctYicsIGltYWdlc1tpXSwgcm93LCBpY2guZWxlbWVudCwgZGVmYXVsdFBvbGljeSwgcG9saWNpZXMud2lkdGhIZWlnaHRQb3NpdGlvbmluZyk7XG4gICAgICAgIGFwcGVuZEVsZW1lbnQoaW5kZXhTdHJpbmcrJy1jJywgaW1hZ2VzW2ldLCByb3csIGljaC5lbGVtZW50LCBkZWZhdWx0UG9saWN5LCBwb2xpY2llcy53aWR0aEhlaWdodFBvc2l0aW9uaW5nKTtcbiAgICAgICAgJChcIi5tYXNzXCIpLmFwcGVuZChyb3cpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJvY2Vzc0ltYWdlczogcHJvY2Vzc0ltYWdlc1xufTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgY3JvZHJpZ3VlejIgb24gOS85LzE1LlxuICovXG5pbWFnZVJlY29nbml0aW9uID0gcmVxdWlyZSgnLi9pbWFnZVJlY29nbml0aW9uL21haW4nKTtcbndpZHRoSGVpZ2h0UG9zaXRpb25pbmcgPSByZXF1aXJlKCcuL3dpZHRoSGVpZ2h0UG9zaXRpb25pbmcvbWFpbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB0cmFja2luZ0pzOiBpbWFnZVJlY29nbml0aW9uLnBvbGljeSxcbiAgICB3aWR0aEhlaWdodFBvc2l0aW9uaW5nOiB3aWR0aEhlaWdodFBvc2l0aW9uaW5nLnBvbGljeVxufTsiLCJ1dGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpO1xuXG5mdW5jdGlvbiBjdXJyZW50UG9saWN5KGltYWdlRWxlbWVudCwgZWxlbWVudCwgaW1hZ2VDb250YWluZXIsIGltZ1VybCwgd2lkdGgsIGhlaWdodCwgaW1nQ2xhc3MpIHtcbi8vICAgIGNvbnNvbGUubG9nKCdDdXJyZW50IFBvbGljeSAnICsgd2lkdGgudG9TdHJpbmcoKSArICd4JyArIGhlaWdodC50b1N0cmluZygpICsgICcgJyArIGltZ0NsYXNzKTtcbiAgICByZXR1cm4gdXRpbC5mb3JtYXQoJ2JhY2tncm91bmQtaW1hZ2U6IHVybChcXCd7MH1cXCcpOycsIGltZ1VybCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHBvbGljeTogY3VycmVudFBvbGljeVxufTsiLCJmcm9tVmFyaWFibGUgPSByZXF1aXJlKCcuL3Rlc3RiZWRfdmFyaWFibGUnKTtcbmZyb21GaWxlcyA9IHJlcXVpcmUoJy4vdGVzdGJlZF9sb2FkaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZyb21EaXJlY3RvcnlTbWFsbFN1YnNldDogZnJvbUZpbGVzLmZyb21EaXJlY3RvcnlTbWFsbFN1YnNldCxcbiAgICBmcm9tRGlyZWN0b3J5OiBmcm9tRmlsZXMuZnJvbURpcmVjdG9yeSxcbiAgICBpbWFnZV9saXN0OiBmcm9tVmFyaWFibGUuaW1hZ2VfbGlzdFxufTsiLCJ1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG5mdW5jdGlvbiBmcm9tRmlsZSgpIHtcbiAgICB2YXIgaXRlbXMgPSBudWxsO1xuICAgICQuYWpheFNldHVwKHthc3luYzogZmFsc2V9KTtcbiAgICAkLmdldChcImpzL2Fzc2V0cy9pbWFnZXMudHh0XCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaXRlbXMgPSBkYXRhLnNwbGl0KCdcXG4nKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlbXM7XG59XG5cbmZ1bmN0aW9uIHJldHJpZXZlRnJvbUZpbGUoZmlsZU5hbWUpe1xuICAgIHZhciBpdGVtcyA9IG51bGw7XG4gICAgJC5hamF4U2V0dXAoe2FzeW5jOiBmYWxzZX0pO1xuICAgIHZhciBwYXRoQW5kRmlsZU5hbWUgPSB1dGlsLmZvcm1hdChcImpzL2Fzc2V0cy97MH1cIiwgZmlsZU5hbWUpO1xuICAgICQuZ2V0KHBhdGhBbmRGaWxlTmFtZSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBpdGVtcyA9IGRhdGEuc3BsaXQoJ1xcbicpO1xuICAgIH0pO1xuICAgIHJldHVybiBpdGVtcztcbn1cblxuZnVuY3Rpb24gY29tcGxldGVBc3NldFdpdGhQYXRoKGltYWdlcykge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgIT09IGltYWdlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpbWFnZXNbaV0gPSAnLi4vdHJhY2tpbmdqcy1wbGF5Z3JvdW5kL2pzL2Fzc2V0cy9pbWcvJyArIGltYWdlc1tpXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZyb21EaXJlY3RvcnlTbWFsbFN1YnNldCgpIHtcbiAgICB2YXIgaXRlbXMgPSByZXRyaWV2ZUZyb21GaWxlKCdzbWFsbF9pbWFnZV90ZXN0YmVkLnR4dCcpO1xuICAgIGNvbXBsZXRlQXNzZXRXaXRoUGF0aChpdGVtcyk7XG4gICAgcmV0dXJuIGl0ZW1zO1xufVxuXG5mdW5jdGlvbiBmcm9tRGlyZWN0b3J5KCkge1xuICAgIHZhciBpdGVtcyA9IHJldHJpZXZlRnJvbUZpbGUoJ2xpc3QudHh0Jyk7XG4gICAgY29tcGxldGVBc3NldFdpdGhQYXRoKGl0ZW1zKTtcbiAgICByZXR1cm4gaXRlbXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZyb21EaXJlY3RvcnlTbWFsbFN1YnNldDogZnJvbURpcmVjdG9yeVNtYWxsU3Vic2V0LFxuICAgIGZyb21EaXJlY3Rvcnk6IGZyb21EaXJlY3Rvcnlcbn07IiwiLyogIFRoZSB0ZXN0IGJlZFxuIEltYWdlcyB3ZXJlIHB1bGxlZCBmcm9tIHNldmVyYWwgc2l0ZXNcbiAqL1xudmFyIGltYWdlX2xpc3QgPSBbXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NDgvTUkwMDAzODQ4MTk4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9hMjQ4LmUuYWthbWFpLm5ldC9mLzE3MjYvMzYwOS8xbS9tZWRpYS5jbWdkaWdpdGFsLmNvbS9zaGFyZWQvaW1nL3Bob3Rvcy8yMDE0LzA2LzIwL2FkL2JiL0plYW5uZV9IZWFkc2hvdF8yLmpwZycsXG4gICAgJ2h0dHBzOi8vYTI0OC5lLmFrYW1haS5uZXQvZi8xNzI2LzM2MDkvMW0vbWVkaWEuY21nZGlnaXRhbC5jb20vc2hhcmVkL2x0L2x0X2NhY2hlL3RodW1ibmFpbC8yOTIvaW1nL3N0YWZmLzIwMTQvMzg2OTk4XzUxMjA5MjI4NzcxOF83NTA4MzM5NzNfbi5qcGcnLFxuICAgICdodHRwczovL2EyNDguZS5ha2FtYWkubmV0L2YvMTcyNi8zNjA5LzFtL21lZGlhLmNtZ2RpZ2l0YWwuY29tL3NoYXJlZC9sdC9sdF9jYWNoZS90aHVtYm5haWwvOTA4L2ltZy9waG90b3MvMjAxMS8wOC8wMS9tb29raWUuanBnJyxcbiAgICAnaHR0cHM6Ly9zLW1lZGlhLWNhY2hlLWFrMC5waW5pbWcuY29tLzIzNngvODgvZTMvNGMvODhlMzRjMTdiZjc2YzFkNTE3OGIwY2UwOGQ5OTM0ZTYuanBnJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzM2MS9NSTAwMDMzNjE0OTAuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNDk3L01JMDAwMzQ5NzkzMC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy82MjcvTUkwMDAzNjI3MDk3LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAxLzQxOC9NSTAwMDE0MTgxNjQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNDk1L01JMDAwMzQ5NTM5OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8yNzcvTUkwMDAzMjc3MzUyLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzQwNS9NSTAwMDE0MDU2NjQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNTkwL01JMDAwMzU5MDYyNi5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NzcvTUkwMDAzODc3NTEzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzM4OC9NSTAwMDMzODg0NTguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMzQ4L01JMDAwMzM0ODI3MS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8zNTgvTUkwMDAzMzU4Mzc3LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzU5NC9NSTAwMDM1OTQyNzguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvMDkwL01JMDAwMzA5MDQ1OS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy80ODQvTUkwMDAzNDg0MjE1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg3Ny9NSTAwMDM4Nzc3MDUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzk4L01JMDAwMzc5ODc2MS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS8zOTcvTUkwMDAxMzk3MzUwLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzYyNy9NSTAwMDM2MjcxOTMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvNDA0L01JMDAwMTQwNDg0My5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy80MzYvTUkwMDAzNDM2ODMzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzM0Ny9NSTAwMDMzNDc4NDcuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvMzYwL01JMDAwMzM2MDU1MS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMS80MTMvTUkwMDAxNDEzOTg4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg0Mi9NSTAwMDM4NDI5NjQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvMzI3L01JMDAwMTMyNzg5My5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83NzAvTUkwMDAzNzcwMDIyLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg0MC9NSTAwMDM4NDA1MjkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNTg0L01JMDAwMzU4NDc2Mi5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83OTUvTUkwMDAzNzk1MzI1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzgwMy9NSTAwMDM4MDM4NTUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODQwL01JMDAwMzg0MDM3NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84MzIvTUkwMDAzODMyNzc1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzgwMi9NSTAwMDM4MDIwMjEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzk1L01JMDAwMzc5NTMyNC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy81MzUvTUkwMDAzNTM1MTY0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg1NC9NSTAwMDM4NTQzODUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzk1L01JMDAwMzc5NTMyMS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NDAvTUkwMDAzODQwMTgzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg2Ny9NSTAwMDM4Njc4NjMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvOTAzL01JMDAwMzkwMzc0OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NjkvTUkwMDAzODY5Njc1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzgxNC9NSTAwMDM4MTQ0MDUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvMjczL01JMDAwMzI3MzY0OS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84MzcvTUkwMDAzODM3MTY3LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzA0NS9NSTAwMDMwNDUzOTkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNDMzL01JMDAwMzQzMzcyMS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83MDkvTUkwMDAzNzA5NzgzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzU5Mi9NSTAwMDM1OTI4NTUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODU5L01JMDAwMzg1OTQ1NS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8xODIvTUkwMDAzMTgyMDIyLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzgzMi9NSTAwMDM4MzI5NzQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzc5L01JMDAwMzc3OTM2MS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NDgvTUkwMDAzODQ4MTk4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAxLzMyOC9NSTAwMDEzMjgwMzcuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODg4L01JMDAwMzg4ODg1Ni5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMS8zOTkvTUkwMDAxMzk5MTc1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzMyNy9NSTAwMDEzMjc4NzQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvMzQ1L01JMDAwMTM0NTE2MC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy80ODEvTUkwMDAzNDgxMjcyLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg3NC9NSTAwMDM4NzQxMDcuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzUyL01JMDAwMzc1MjQxMy5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy80MzYvTUkwMDAzNDM2OTA5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAxLzM5NS9NSTAwMDEzOTUwMTAuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODQ5L01JMDAwMzg0OTMxOS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy80MjEvTUkwMDAzNDIxODg4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg3NC9NSTAwMDM4NzQ1MDEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDEvMzY0L01JMDAwMTM2NDkxMi5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83MDkvTUkwMDAzNzA5OTk5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAxLzQ2NS9NSTAwMDE0NjU0MTMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvNDA2L01JMDAwMTQwNjQ2MC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83MjAvTUkwMDAzNzIwOTg3LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAxLzMyNi9NSTAwMDEzMjYzMzguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODg4L01JMDAwMzg4ODg4MS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NzkvTUkwMDAzODc5MTYwLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg3OS9NSTAwMDM4Nzk4ODUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvMzI1L01JMDAwMTMyNTQzMy5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy8zNjQvTUkwMDAzMzY0NDU4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg3OS9NSTAwMDM4Nzk2NzEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNTcxL01JMDAwMzU3MTE0My5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84MjgvTUkwMDAzODI4NDc5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzg5MS9NSTAwMDM4OTExNjkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvNDAyL01JMDAwMTQwMjE0MC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy82NDEvTUkwMDAzNjQxNDc0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzM1MS9NSTAwMDMzNTEzNzMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMjc2L01JMDAwMzI3NjM0MS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy82ODkvTUkwMDAzNjg5MTg5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzgzNS9NSTAwMDM4MzU0NzkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvNDAxL01JMDAwMTQwMTY4NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMi83NDkvTUkwMDAyNzQ5Njc5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzU5MC9NSTAwMDM1OTAwMzUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODkyL01JMDAwMzg5MjgyMy5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy81OTQvTUkwMDAzNTk0NDY0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzczMi9NSTAwMDM3MzI0NjcuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvMzI5L01JMDAwMTMyOTYyMC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS80MDUvTUkwMDAxNDA1MDc4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzM2Ni9NSTAwMDEzNjY2MDguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvMzI5L01JMDAwMTMyOTUyOC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83MTIvTUkwMDAzNzEyNjE3LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAxLzMzNi9NSTAwMDEzMzY3ODQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMTQ4L01JMDAwMzE0ODg3NS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy80NDUvTUkwMDAzNDQ1MTI5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzM3OC9NSTAwMDMzNzg3NzIuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvMzk5L01JMDAwMTM5OTM0NS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS80MDEvTUkwMDAxNDAxNTg4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyBdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbWFnZV9saXN0OiBpbWFnZV9saXN0XG59O1xuIiwiLypcblxuICovXG5mdW5jdGlvbiBjcmVhdGVDbGFzcyhuYW1lLHJ1bGVzKXtcbiAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIGlmKCEoc3R5bGUuc2hlZXR8fHt9KS5pbnNlcnRSdWxlKVxuICAgICAgICAoc3R5bGUuc3R5bGVTaGVldCB8fCBzdHlsZS5zaGVldCkuYWRkUnVsZShuYW1lLCBydWxlcyk7XG4gICAgZWxzZVxuICAgICAgICBzdHlsZS5zaGVldC5pbnNlcnRSdWxlKG5hbWUrXCJ7XCIrcnVsZXMrXCJ9XCIsMCk7XG59XG5cbi8qXG5cbiAqL1xuZm9ybWF0ID0gZnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgveyhcXGQrKX0vZywgZnVuY3Rpb24obWF0Y2gsIG51bWJlcikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgPyBhcmdzW251bWJlcl1cbiAgICAgICAgICAgIDogbWF0Y2hcbiAgICAgICAgICAgIDtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZUNsYXNzOiBjcmVhdGVDbGFzcyxcbiAgICBmb3JtYXQ6IGZvcm1hdFxufTsiXX0=
