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
},{"./strategy/main":8,"./testbed/main":12}],2:[function(require,module,exports){
var graphics = require('../graphics/main');

/*
 */
function setupImageFaceInsideContainer(width, height, offsetX, offsetY,
                                       imageWidth, imageHeight,
                                       containerWidth, containerHeight){
    var rectangleFace = new graphics.FaceContainer(width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight);
    rectangleFace.recalculateVerticesWithOffset();
    rectangleFace.resetVertices();
    rectangleFace.recalculateVerticesWithOffset();
    rectangleFace.resetVertices();
    rectangleFace.recalculateVerticesWithOffset();
    rectangleFace.resetVertices();
    return rectangleFace;
}

function isPointInsideSpace() {

}

function calculateOverlay(){

}

function faceTracking(faceRecognizedEvent, imagePack){
    var faces = [];
    for(var i = 0; i != faceRecognizedEvent.data.length; ++i) {
        var data = faceRecognizedEvent.data[i];
        var containerProperties = util.getProperties(imagePack.elementContainingImage[0]);
        faces.push(setupImageFaceInsideContainer(data.width, data.height, data.x, data.y,
            imagePack.width,imagePack.height,
            containerProperties.width, containerProperties.height));
    }
    console.log(faces);
}

module.exports = {
    faceTracking: faceTracking
};
},{"../graphics/main":4}],3:[function(require,module,exports){
parallelogram = require('./parallelogram');

FaceContainer.prototype = Object.create(parallelogram.Parallelogram.prototype);
FaceContainer.prototype.constructor = FaceContainer;

function FaceContainer(width, height, offsetX, offsetY, imageWidth, imageHeight, containerWidth, containerHeight) {
    parallelogram.Parallelogram.call(this, width, height);
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.sourceWidth = imageWidth;
    this.sourceHeight = imageHeight;
    this.targetWidth = containerWidth;
    this.targetHeight = containerHeight;
}

function recalculateVertices(parallelogramVertexSet, offsetX, offsetY) {
    for (var key in parallelogramVertexSet) {
        if (parallelogramVertexSet.hasOwnProperty(key)) {
            parallelogramVertexSet[key].x += offsetX;
            parallelogramVertexSet[key].y += offsetY;
        }
    }
}

FaceContainer.prototype.recalculateVerticesWithOffset = function() {
    this.backupVertices(this.vertices);
    for (var key in this.vertices) {
        if (this.vertices.hasOwnProperty(key)) {
            recalculateVertices(this.vertices, this.offsetX, this.offsetY);
        }
    }
};

module.exports = {
    FaceContainer: FaceContainer
};
},{"./parallelogram":5}],4:[function(require,module,exports){
face_container = require('./face_container');
parallelogram = require('./parallelogram');
vertex = require('./vertex');

module.exports = {
    FaceContainer: face_container.FaceContainer,
    Parallelogram: parallelogram.Parallelogram,
    Vertex2D: vertex.Vertex2D
};
},{"./face_container":3,"./parallelogram":5,"./vertex":6}],5:[function(require,module,exports){
vertex = require('./vertex');


function ParallelogramVertexSet(width, height) {
    this.OO = new vertex.Vertex2D(0, 0);
    this.OA = new vertex.Vertex2D(0 + width, 0);
    this.OB = new vertex.Vertex2D(0, 0 + height);
    this.OC = new vertex.Vertex2D(0 + width, 0 + height);
    this.equals = function(other) {
        return other.OO.equals(this.OO) && other.OA.equals(this.OA) && other.OB.equals(this.OB) && other.OC.equals(this.OC);
    };
    this.copy = function(other) {
        this.OO.copy(other.OO);
        this.OA.copy(other.OA);
        this.OB.copy(other.OB);
        this.OC.copy(other.OC);
    }
}


/* @class Parallelogram with the following
 vertices
 OO _______ OA
 |       |
 |_______|
 OB         OC */
function Parallelogram(width, height) {
    this.width = width;
    this.height = height;
    this.vertices = new ParallelogramVertexSet(width, height);
    this.__previousStateVertices = new ParallelogramVertexSet(width, height);
}

Parallelogram.prototype.resetVertices = function() {
    if(!this.vertices.equals(this.__previousStateVertices)){
        var localCopy = new ParallelogramVertexSet(this.width, this.height);
        localCopy.copy(this.vertices);
        this.vertices.copy(this.__previousStateVertices);
        this.__previousStateVertices.copy(localCopy);
    }
};

Parallelogram.prototype.backupVertices = function (vertices) {
    if(!this.__previousStateVertices.equals(vertices)){
        this.__previousStateVertices.copy(vertices);
    }
};

module.exports = {
    Parallelogram: Parallelogram
};
},{"./vertex":6}],6:[function(require,module,exports){
/* @class Vertex2D
 As it name implies a vertex structure
 for 2 Dimensional Polygons */
function Vertex2D(x, y) {
    this.x = x;
    this.y = y;
    this.equals = function(other) {
        return other.x == this.x && other.y == this.y;
    };
    this.copy = function(other) {
        this.x = other.x;
        this.y = other.y;
    }
}

module.exports = {
  Vertex2D: Vertex2D
};
},{}],7:[function(require,module,exports){
var util = require('../../util');
var image = require('../shared/image/main');
var faceRecognition = require('./faceRecognition/main');

function trackingJsFromLocalImage(imageElement, imageContainer, imgUrl,  width, height, imgClass) {
    var tracker = new tracking.ObjectTracker(['face']);
    tracker.sourceElement = new image.ImagePack(width, height, '.' + imgClass, imageContainer);
    tracker.setStepSize(1.7);
    tracking.track(imageElement, tracker);
    tracker.on('track', function(event) {
        if (event.data.length === 0) {
            console.log('No elements found');
        } else {
            faceRecognition.faceTracking(event, this.sourceElement);
        }
    });
    return util.format('background-image: url(\'{0}\');  no-repeat center center fixed; \
        -webkit-background-size: cover; \
        -moz-background-size: cover; \
        -o-background-size: cover; \
        background-size: cover;', imgUrl);
}

module.exports = {
    policy: trackingJsFromLocalImage
};
},{"../../util":15,"../shared/image/main":10,"./faceRecognition/main":2}],8:[function(require,module,exports){
util = require('../util');
policies = require('./policies');

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
            var imageContainerClassName = '.cm_mobHeader_artist_image';
            var container = this.element.find(imageContainerClassName);
                container.containerProperties = util.getProperties(container[0]);
            var style = this.policy(this.self, container, this.imageSrc, this.width, this.height, this.className);
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
},{"../util":15,"./policies":9}],9:[function(require,module,exports){
/**
 * Created by crodriguez2 on 9/9/15.
 */
imageRecognition = require('./imageRecognition/main');
widthHeightPositioning = require('./widthHeightPositioning/main');

module.exports = {
    trackingJs: imageRecognition.policy,
    widthHeightPositioning: widthHeightPositioning.policy
};
},{"./imageRecognition/main":7,"./widthHeightPositioning/main":11}],10:[function(require,module,exports){
function ImagePack (width, height, imageClassName, elementContainingImage) {
    this.width = width;
    this.height = height;
    this.imageClassName = imageClassName;
    this.elementContainingImage = elementContainingImage;
}

module.exports = {
  ImagePack: ImagePack
};
},{}],11:[function(require,module,exports){
util = require('../../util');

function currentPolicy(imageElement, imageContainer, imgUrl, width, height, imgClass) {
    return util.format('background-image: url(\'{0}\');', imgUrl);
}

module.exports = {
    policy: currentPolicy
};
},{"../../util":15}],12:[function(require,module,exports){
fromVariable = require('./testbed_variable');
fromFiles = require('./testbed_loading');

module.exports = {
    fromDirectorySmallSubset: fromFiles.fromDirectorySmallSubset,
    fromDirectory: fromFiles.fromDirectory,
    image_list: fromVariable.image_list
};
},{"./testbed_loading":13,"./testbed_variable":14}],13:[function(require,module,exports){
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
        images[i] = '../ImageManipulation/js/assets/img/' + images[i];
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
},{"../util":15}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

function getWidth(element) {
    return Math.max(element.clientWidth,element.offsetWidth,element.scrollWidth);
}

function getHeight(element) {
    return Math.max(element.clientHeight,element.offsetHeight,element.scrollHeight);
}

var getProperty = {
    width: getWidth,
    height: getHeight
};

function getProperties(element){
    return {
        width: getProperty.width(element),
        height: getProperty.height(element)
    }
}

module.exports = {
    createClass: createClass,
    format: format,
    getProperties: getProperties
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9zdHJhdGVneS9pbWFnZVJlY29nbml0aW9uL2ZhY2VSZWNvZ25pdGlvbi9tYWluLmpzIiwic3JjL3N0cmF0ZWd5L2ltYWdlUmVjb2duaXRpb24vZ3JhcGhpY3MvZmFjZV9jb250YWluZXIuanMiLCJzcmMvc3RyYXRlZ3kvaW1hZ2VSZWNvZ25pdGlvbi9ncmFwaGljcy9tYWluLmpzIiwic3JjL3N0cmF0ZWd5L2ltYWdlUmVjb2duaXRpb24vZ3JhcGhpY3MvcGFyYWxsZWxvZ3JhbS5qcyIsInNyYy9zdHJhdGVneS9pbWFnZVJlY29nbml0aW9uL2dyYXBoaWNzL3ZlcnRleC5qcyIsInNyYy9zdHJhdGVneS9pbWFnZVJlY29nbml0aW9uL21haW4uanMiLCJzcmMvc3RyYXRlZ3kvbWFpbi5qcyIsInNyYy9zdHJhdGVneS9wb2xpY2llcy5qcyIsInNyYy9zdHJhdGVneS9zaGFyZWQvaW1hZ2UvbWFpbi5qcyIsInNyYy9zdHJhdGVneS93aWR0aEhlaWdodFBvc2l0aW9uaW5nL21haW4uanMiLCJzcmMvdGVzdGJlZC9tYWluLmpzIiwic3JjL3Rlc3RiZWQvdGVzdGJlZF9sb2FkaW5nLmpzIiwic3JjL3Rlc3RiZWQvdGVzdGJlZF92YXJpYWJsZS5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidGVzdGJlZCA9IHJlcXVpcmUoJy4vdGVzdGJlZC9tYWluJyk7XG5pbWFnZVByb2Nlc3NpbmcgPSByZXF1aXJlKCcuL3N0cmF0ZWd5L21haW4nKTtcblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgICB2YXIgaXRlbXMgPSB0ZXN0YmVkLmZyb21EaXJlY3RvcnlTbWFsbFN1YnNldCgpO1xuICAgIGltYWdlUHJvY2Vzc2luZy5wcm9jZXNzSW1hZ2VzKGl0ZW1zKTtcbn1cblxuJChkb2N1bWVudCkub25lKCdyZWFkeScsIGZ1bmN0aW9uKCkge1xuICAgIG1haW4oKTtcbn0pOyIsInZhciBncmFwaGljcyA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL21haW4nKTtcblxuLypcbiAqL1xuZnVuY3Rpb24gc2V0dXBJbWFnZUZhY2VJbnNpZGVDb250YWluZXIod2lkdGgsIGhlaWdodCwgb2Zmc2V0WCwgb2Zmc2V0WSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlV2lkdGgsIGltYWdlSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyV2lkdGgsIGNvbnRhaW5lckhlaWdodCl7XG4gICAgdmFyIHJlY3RhbmdsZUZhY2UgPSBuZXcgZ3JhcGhpY3MuRmFjZUNvbnRhaW5lcih3aWR0aCwgaGVpZ2h0LCBvZmZzZXRYLCBvZmZzZXRZLCBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCwgY29udGFpbmVyV2lkdGgsIGNvbnRhaW5lckhlaWdodCk7XG4gICAgcmVjdGFuZ2xlRmFjZS5yZWNhbGN1bGF0ZVZlcnRpY2VzV2l0aE9mZnNldCgpO1xuICAgIHJlY3RhbmdsZUZhY2UucmVzZXRWZXJ0aWNlcygpO1xuICAgIHJlY3RhbmdsZUZhY2UucmVjYWxjdWxhdGVWZXJ0aWNlc1dpdGhPZmZzZXQoKTtcbiAgICByZWN0YW5nbGVGYWNlLnJlc2V0VmVydGljZXMoKTtcbiAgICByZWN0YW5nbGVGYWNlLnJlY2FsY3VsYXRlVmVydGljZXNXaXRoT2Zmc2V0KCk7XG4gICAgcmVjdGFuZ2xlRmFjZS5yZXNldFZlcnRpY2VzKCk7XG4gICAgcmV0dXJuIHJlY3RhbmdsZUZhY2U7XG59XG5cbmZ1bmN0aW9uIGlzUG9pbnRJbnNpZGVTcGFjZSgpIHtcblxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVPdmVybGF5KCl7XG5cbn1cblxuZnVuY3Rpb24gZmFjZVRyYWNraW5nKGZhY2VSZWNvZ25pemVkRXZlbnQsIGltYWdlUGFjayl7XG4gICAgdmFyIGZhY2VzID0gW107XG4gICAgZm9yKHZhciBpID0gMDsgaSAhPSBmYWNlUmVjb2duaXplZEV2ZW50LmRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBmYWNlUmVjb2duaXplZEV2ZW50LmRhdGFbaV07XG4gICAgICAgIHZhciBjb250YWluZXJQcm9wZXJ0aWVzID0gdXRpbC5nZXRQcm9wZXJ0aWVzKGltYWdlUGFjay5lbGVtZW50Q29udGFpbmluZ0ltYWdlWzBdKTtcbiAgICAgICAgZmFjZXMucHVzaChzZXR1cEltYWdlRmFjZUluc2lkZUNvbnRhaW5lcihkYXRhLndpZHRoLCBkYXRhLmhlaWdodCwgZGF0YS54LCBkYXRhLnksXG4gICAgICAgICAgICBpbWFnZVBhY2sud2lkdGgsaW1hZ2VQYWNrLmhlaWdodCxcbiAgICAgICAgICAgIGNvbnRhaW5lclByb3BlcnRpZXMud2lkdGgsIGNvbnRhaW5lclByb3BlcnRpZXMuaGVpZ2h0KSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGZhY2VzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZmFjZVRyYWNraW5nOiBmYWNlVHJhY2tpbmdcbn07IiwicGFyYWxsZWxvZ3JhbSA9IHJlcXVpcmUoJy4vcGFyYWxsZWxvZ3JhbScpO1xuXG5GYWNlQ29udGFpbmVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyYWxsZWxvZ3JhbS5QYXJhbGxlbG9ncmFtLnByb3RvdHlwZSk7XG5GYWNlQ29udGFpbmVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEZhY2VDb250YWluZXI7XG5cbmZ1bmN0aW9uIEZhY2VDb250YWluZXIod2lkdGgsIGhlaWdodCwgb2Zmc2V0WCwgb2Zmc2V0WSwgaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQsIGNvbnRhaW5lcldpZHRoLCBjb250YWluZXJIZWlnaHQpIHtcbiAgICBwYXJhbGxlbG9ncmFtLlBhcmFsbGVsb2dyYW0uY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB0aGlzLm9mZnNldFggPSBvZmZzZXRYO1xuICAgIHRoaXMub2Zmc2V0WSA9IG9mZnNldFk7XG4gICAgdGhpcy5zb3VyY2VXaWR0aCA9IGltYWdlV2lkdGg7XG4gICAgdGhpcy5zb3VyY2VIZWlnaHQgPSBpbWFnZUhlaWdodDtcbiAgICB0aGlzLnRhcmdldFdpZHRoID0gY29udGFpbmVyV2lkdGg7XG4gICAgdGhpcy50YXJnZXRIZWlnaHQgPSBjb250YWluZXJIZWlnaHQ7XG59XG5cbmZ1bmN0aW9uIHJlY2FsY3VsYXRlVmVydGljZXMocGFyYWxsZWxvZ3JhbVZlcnRleFNldCwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xuICAgIGZvciAodmFyIGtleSBpbiBwYXJhbGxlbG9ncmFtVmVydGV4U2V0KSB7XG4gICAgICAgIGlmIChwYXJhbGxlbG9ncmFtVmVydGV4U2V0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHBhcmFsbGVsb2dyYW1WZXJ0ZXhTZXRba2V5XS54ICs9IG9mZnNldFg7XG4gICAgICAgICAgICBwYXJhbGxlbG9ncmFtVmVydGV4U2V0W2tleV0ueSArPSBvZmZzZXRZO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5GYWNlQ29udGFpbmVyLnByb3RvdHlwZS5yZWNhbGN1bGF0ZVZlcnRpY2VzV2l0aE9mZnNldCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYmFja3VwVmVydGljZXModGhpcy52ZXJ0aWNlcyk7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMudmVydGljZXMpIHtcbiAgICAgICAgaWYgKHRoaXMudmVydGljZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgcmVjYWxjdWxhdGVWZXJ0aWNlcyh0aGlzLnZlcnRpY2VzLCB0aGlzLm9mZnNldFgsIHRoaXMub2Zmc2V0WSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBGYWNlQ29udGFpbmVyOiBGYWNlQ29udGFpbmVyXG59OyIsImZhY2VfY29udGFpbmVyID0gcmVxdWlyZSgnLi9mYWNlX2NvbnRhaW5lcicpO1xucGFyYWxsZWxvZ3JhbSA9IHJlcXVpcmUoJy4vcGFyYWxsZWxvZ3JhbScpO1xudmVydGV4ID0gcmVxdWlyZSgnLi92ZXJ0ZXgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgRmFjZUNvbnRhaW5lcjogZmFjZV9jb250YWluZXIuRmFjZUNvbnRhaW5lcixcbiAgICBQYXJhbGxlbG9ncmFtOiBwYXJhbGxlbG9ncmFtLlBhcmFsbGVsb2dyYW0sXG4gICAgVmVydGV4MkQ6IHZlcnRleC5WZXJ0ZXgyRFxufTsiLCJ2ZXJ0ZXggPSByZXF1aXJlKCcuL3ZlcnRleCcpO1xuXG5cbmZ1bmN0aW9uIFBhcmFsbGVsb2dyYW1WZXJ0ZXhTZXQod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuT08gPSBuZXcgdmVydGV4LlZlcnRleDJEKDAsIDApO1xuICAgIHRoaXMuT0EgPSBuZXcgdmVydGV4LlZlcnRleDJEKDAgKyB3aWR0aCwgMCk7XG4gICAgdGhpcy5PQiA9IG5ldyB2ZXJ0ZXguVmVydGV4MkQoMCwgMCArIGhlaWdodCk7XG4gICAgdGhpcy5PQyA9IG5ldyB2ZXJ0ZXguVmVydGV4MkQoMCArIHdpZHRoLCAwICsgaGVpZ2h0KTtcbiAgICB0aGlzLmVxdWFscyA9IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBvdGhlci5PTy5lcXVhbHModGhpcy5PTykgJiYgb3RoZXIuT0EuZXF1YWxzKHRoaXMuT0EpICYmIG90aGVyLk9CLmVxdWFscyh0aGlzLk9CKSAmJiBvdGhlci5PQy5lcXVhbHModGhpcy5PQyk7XG4gICAgfTtcbiAgICB0aGlzLmNvcHkgPSBmdW5jdGlvbihvdGhlcikge1xuICAgICAgICB0aGlzLk9PLmNvcHkob3RoZXIuT08pO1xuICAgICAgICB0aGlzLk9BLmNvcHkob3RoZXIuT0EpO1xuICAgICAgICB0aGlzLk9CLmNvcHkob3RoZXIuT0IpO1xuICAgICAgICB0aGlzLk9DLmNvcHkob3RoZXIuT0MpO1xuICAgIH1cbn1cblxuXG4vKiBAY2xhc3MgUGFyYWxsZWxvZ3JhbSB3aXRoIHRoZSBmb2xsb3dpbmdcbiB2ZXJ0aWNlc1xuIE9PIF9fX19fX18gT0FcbiB8ICAgICAgIHxcbiB8X19fX19fX3xcbiBPQiAgICAgICAgIE9DICovXG5mdW5jdGlvbiBQYXJhbGxlbG9ncmFtKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy52ZXJ0aWNlcyA9IG5ldyBQYXJhbGxlbG9ncmFtVmVydGV4U2V0KHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuX19wcmV2aW91c1N0YXRlVmVydGljZXMgPSBuZXcgUGFyYWxsZWxvZ3JhbVZlcnRleFNldCh3aWR0aCwgaGVpZ2h0KTtcbn1cblxuUGFyYWxsZWxvZ3JhbS5wcm90b3R5cGUucmVzZXRWZXJ0aWNlcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKCF0aGlzLnZlcnRpY2VzLmVxdWFscyh0aGlzLl9fcHJldmlvdXNTdGF0ZVZlcnRpY2VzKSl7XG4gICAgICAgIHZhciBsb2NhbENvcHkgPSBuZXcgUGFyYWxsZWxvZ3JhbVZlcnRleFNldCh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIGxvY2FsQ29weS5jb3B5KHRoaXMudmVydGljZXMpO1xuICAgICAgICB0aGlzLnZlcnRpY2VzLmNvcHkodGhpcy5fX3ByZXZpb3VzU3RhdGVWZXJ0aWNlcyk7XG4gICAgICAgIHRoaXMuX19wcmV2aW91c1N0YXRlVmVydGljZXMuY29weShsb2NhbENvcHkpO1xuICAgIH1cbn07XG5cblBhcmFsbGVsb2dyYW0ucHJvdG90eXBlLmJhY2t1cFZlcnRpY2VzID0gZnVuY3Rpb24gKHZlcnRpY2VzKSB7XG4gICAgaWYoIXRoaXMuX19wcmV2aW91c1N0YXRlVmVydGljZXMuZXF1YWxzKHZlcnRpY2VzKSl7XG4gICAgICAgIHRoaXMuX19wcmV2aW91c1N0YXRlVmVydGljZXMuY29weSh2ZXJ0aWNlcyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUGFyYWxsZWxvZ3JhbTogUGFyYWxsZWxvZ3JhbVxufTsiLCIvKiBAY2xhc3MgVmVydGV4MkRcbiBBcyBpdCBuYW1lIGltcGxpZXMgYSB2ZXJ0ZXggc3RydWN0dXJlXG4gZm9yIDIgRGltZW5zaW9uYWwgUG9seWdvbnMgKi9cbmZ1bmN0aW9uIFZlcnRleDJEKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5lcXVhbHMgPSBmdW5jdGlvbihvdGhlcikge1xuICAgICAgICByZXR1cm4gb3RoZXIueCA9PSB0aGlzLnggJiYgb3RoZXIueSA9PSB0aGlzLnk7XG4gICAgfTtcbiAgICB0aGlzLmNvcHkgPSBmdW5jdGlvbihvdGhlcikge1xuICAgICAgICB0aGlzLnggPSBvdGhlci54O1xuICAgICAgICB0aGlzLnkgPSBvdGhlci55O1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFZlcnRleDJEOiBWZXJ0ZXgyRFxufTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKTtcbnZhciBpbWFnZSA9IHJlcXVpcmUoJy4uL3NoYXJlZC9pbWFnZS9tYWluJyk7XG52YXIgZmFjZVJlY29nbml0aW9uID0gcmVxdWlyZSgnLi9mYWNlUmVjb2duaXRpb24vbWFpbicpO1xuXG5mdW5jdGlvbiB0cmFja2luZ0pzRnJvbUxvY2FsSW1hZ2UoaW1hZ2VFbGVtZW50LCBpbWFnZUNvbnRhaW5lciwgaW1nVXJsLCAgd2lkdGgsIGhlaWdodCwgaW1nQ2xhc3MpIHtcbiAgICB2YXIgdHJhY2tlciA9IG5ldyB0cmFja2luZy5PYmplY3RUcmFja2VyKFsnZmFjZSddKTtcbiAgICB0cmFja2VyLnNvdXJjZUVsZW1lbnQgPSBuZXcgaW1hZ2UuSW1hZ2VQYWNrKHdpZHRoLCBoZWlnaHQsICcuJyArIGltZ0NsYXNzLCBpbWFnZUNvbnRhaW5lcik7XG4gICAgdHJhY2tlci5zZXRTdGVwU2l6ZSgxLjcpO1xuICAgIHRyYWNraW5nLnRyYWNrKGltYWdlRWxlbWVudCwgdHJhY2tlcik7XG4gICAgdHJhY2tlci5vbigndHJhY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBlbGVtZW50cyBmb3VuZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmFjZVJlY29nbml0aW9uLmZhY2VUcmFja2luZyhldmVudCwgdGhpcy5zb3VyY2VFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1dGlsLmZvcm1hdCgnYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcJ3swfVxcJyk7ICBuby1yZXBlYXQgY2VudGVyIGNlbnRlciBmaXhlZDsgXFxcbiAgICAgICAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyOyBcXFxuICAgICAgICAtbW96LWJhY2tncm91bmQtc2l6ZTogY292ZXI7IFxcXG4gICAgICAgIC1vLWJhY2tncm91bmQtc2l6ZTogY292ZXI7IFxcXG4gICAgICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7JywgaW1nVXJsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcG9saWN5OiB0cmFja2luZ0pzRnJvbUxvY2FsSW1hZ2Vcbn07IiwidXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbnBvbGljaWVzID0gcmVxdWlyZSgnLi9wb2xpY2llcycpO1xuXG4vLyBjbV9tb2JIZWFkZXJfYXJ0aXN0X292ZXJsYXkgLSBUaGUgZnVsbCBoZWFkZXIgYmFja2dyb3VuZCBkaXZcbi8vIGNtX21vYkhlYWRlcl9hcnRpc3RfaW1hZ2UgLSBUaGUgY2lyY2xlIGRpdiB0aGF0IHdpbGwgY29udGFpbiB0aGUgaW1hZ2Vcbi8vIGNtX21vYkhlYWRlcl9hcnRpc3Qtb3ZlcmxheS0tc3R5bGUgLSBXZSB3aWxsIHB1dCBldmVyeXRoaW5nIHJlbGF0ZWQgdG8gdGhlIGJhY2tncm91bmQgb2YgYXJ0aXN0X292ZXJsYXkgaW4gaGVyZVxuLy8gY21fbW9iSGVhZGVyX2FydGlzdC1pbWFnZS0tc3R5bGUgLSBXZSB3aWxsIHB1dCBldmVyeXRoaW5nIHJlbGF0ZWQgdG8gYmFja2dyb3VuZCBvZiBhcnRpc3RfaW1hZ2UgaW4gaGVyZVxuZnVuY3Rpb24gZGVmYXVsdFBvbGljeShpbmRleCwgZWxlbWVudCwgaW1nVXJsLCBwb2xpY3kpIHtcbiAgICB2YXIgb3ZhbEJhY2tncm91bmRDbGFzc05hbWUgPSB1dGlsLmZvcm1hdCgnY21fbW9iSGVhZGVyX2FydGlzdC1pbWFnZS0tc3R5bGUtezB9JywgaW5kZXgpO1xuXG4gICAgdmFyIG92ZXJsYXlDbGFzc05hbWUgPSB1dGlsLmZvcm1hdCgnY21fbW9iSGVhZGVyX2FydGlzdC1vdmVybGF5LS1zdHlsZS17MH0nLCBpbmRleCk7XG4gICAgdmFyIG92ZXJsYXlCYWNrZ3JvdW5kID0gdXRpbC5mb3JtYXQoJ2JhY2tncm91bmQtaW1hZ2U6IHVybChcXCd7MH1cXCcpOyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsnLCBpbWdVcmwpO1xuICAgIHV0aWwuY3JlYXRlQ2xhc3MoJy4nICsgb3ZlcmxheUNsYXNzTmFtZSwgb3ZlcmxheUJhY2tncm91bmQpO1xuXG4gICAgdmFyIG92ZXJsYXlJbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBvdmVybGF5SW1nLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIG92ZXJsYXlJbWcub3ZlcmxheUNsYXNzTmFtZSA9IG92ZXJsYXlDbGFzc05hbWU7XG4gICAgb3ZlcmxheUltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5jbV9tb2JIZWFkZXJfYXJ0aXN0X292ZXJsYXknKS5hZGRDbGFzcyh0aGlzLm92ZXJsYXlDbGFzc05hbWUpO1xuICAgIH07XG4gICAgb3ZlcmxheUltZy5zcmMgPSBpbWdVcmw7XG5cbiAgICB2YXIgb3ZhbEltZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgb3ZhbEltZy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICBvdmFsSW1nLmNsYXNzTmFtZSA9IG92YWxCYWNrZ3JvdW5kQ2xhc3NOYW1lO1xuICAgIG92YWxJbWcuaW1hZ2VTcmMgPSBpbWdVcmw7XG4gICAgb3ZhbEltZy5wb2xpY3kgPSBwb2xpY3k7XG4gICAgb3ZhbEltZy5zZWxmID0gb3ZhbEltZztcbiAgICBvdmFsSW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLnBvbGljeSkge1xuICAgICAgICAgICAgdmFyIGltYWdlQ29udGFpbmVyQ2xhc3NOYW1lID0gJy5jbV9tb2JIZWFkZXJfYXJ0aXN0X2ltYWdlJztcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmVsZW1lbnQuZmluZChpbWFnZUNvbnRhaW5lckNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNvbnRhaW5lclByb3BlcnRpZXMgPSB1dGlsLmdldFByb3BlcnRpZXMoY29udGFpbmVyWzBdKTtcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IHRoaXMucG9saWN5KHRoaXMuc2VsZiwgY29udGFpbmVyLCB0aGlzLmltYWdlU3JjLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5jbGFzc05hbWUpO1xuICAgICAgICAgICAgdXRpbC5jcmVhdGVDbGFzcygnLicgKyB0aGlzLmNsYXNzTmFtZSwgc3R5bGUpO1xuICAgICAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMuY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgb3ZhbEltZy5zcmMgPSBpbWdVcmw7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZEVsZW1lbnQoaW5kZXgsIGltYWdlVXJsLCByb3csIGVsZW1lbnQsIHBvbGljeSwgc3ViUG9saWN5KSB7XG4gICAgdmFyIGNhcmQgPSBlbGVtZW50KHtcbiAgICAgICAgJ3NvbmdOYW1lJzogJ1NvbmcgTmFtZScsXG4gICAgICAgICdhcnRpc3ROYW1lJzogJ0FydGlzdCBOYW1lJ1xuICAgIH0pO1xuICAgIHBvbGljeShpbmRleCwgY2FyZCwgaW1hZ2VVcmwsIHN1YlBvbGljeSk7XG4gICAgJChyb3cpLmFwcGVuZChjYXJkKTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc0ltYWdlcyhpbWFnZXMpe1xuICAgIGZvcihpID0gMDsgaSAhPT0gaW1hZ2VzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciByb3cgPSBpY2guZWxSb3coKTtcbiAgICAgICAgdmFyIGluZGV4U3RyaW5nID0gaS50b1N0cmluZygpO1xuICAgICAgICBhcHBlbmRFbGVtZW50KGluZGV4U3RyaW5nKyctYScsIGltYWdlc1tpXSwgcm93LCBpY2guZWxlbWVudCwgZGVmYXVsdFBvbGljeSwgcG9saWNpZXMudHJhY2tpbmdKcyk7XG4gICAgICAgIGFwcGVuZEVsZW1lbnQoaW5kZXhTdHJpbmcrJy1iJywgaW1hZ2VzW2ldLCByb3csIGljaC5lbGVtZW50LCBkZWZhdWx0UG9saWN5LCBwb2xpY2llcy53aWR0aEhlaWdodFBvc2l0aW9uaW5nKTtcbiAgICAgICAgYXBwZW5kRWxlbWVudChpbmRleFN0cmluZysnLWMnLCBpbWFnZXNbaV0sIHJvdywgaWNoLmVsZW1lbnQsIGRlZmF1bHRQb2xpY3ksIHBvbGljaWVzLndpZHRoSGVpZ2h0UG9zaXRpb25pbmcpO1xuICAgICAgICAkKFwiLm1hc3NcIikuYXBwZW5kKHJvdyk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwcm9jZXNzSW1hZ2VzOiBwcm9jZXNzSW1hZ2VzXG59OyIsIi8qKlxuICogQ3JlYXRlZCBieSBjcm9kcmlndWV6MiBvbiA5LzkvMTUuXG4gKi9cbmltYWdlUmVjb2duaXRpb24gPSByZXF1aXJlKCcuL2ltYWdlUmVjb2duaXRpb24vbWFpbicpO1xud2lkdGhIZWlnaHRQb3NpdGlvbmluZyA9IHJlcXVpcmUoJy4vd2lkdGhIZWlnaHRQb3NpdGlvbmluZy9tYWluJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRyYWNraW5nSnM6IGltYWdlUmVjb2duaXRpb24ucG9saWN5LFxuICAgIHdpZHRoSGVpZ2h0UG9zaXRpb25pbmc6IHdpZHRoSGVpZ2h0UG9zaXRpb25pbmcucG9saWN5XG59OyIsImZ1bmN0aW9uIEltYWdlUGFjayAod2lkdGgsIGhlaWdodCwgaW1hZ2VDbGFzc05hbWUsIGVsZW1lbnRDb250YWluaW5nSW1hZ2UpIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5pbWFnZUNsYXNzTmFtZSA9IGltYWdlQ2xhc3NOYW1lO1xuICAgIHRoaXMuZWxlbWVudENvbnRhaW5pbmdJbWFnZSA9IGVsZW1lbnRDb250YWluaW5nSW1hZ2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBJbWFnZVBhY2s6IEltYWdlUGFja1xufTsiLCJ1dGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpO1xuXG5mdW5jdGlvbiBjdXJyZW50UG9saWN5KGltYWdlRWxlbWVudCwgaW1hZ2VDb250YWluZXIsIGltZ1VybCwgd2lkdGgsIGhlaWdodCwgaW1nQ2xhc3MpIHtcbiAgICByZXR1cm4gdXRpbC5mb3JtYXQoJ2JhY2tncm91bmQtaW1hZ2U6IHVybChcXCd7MH1cXCcpOycsIGltZ1VybCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHBvbGljeTogY3VycmVudFBvbGljeVxufTsiLCJmcm9tVmFyaWFibGUgPSByZXF1aXJlKCcuL3Rlc3RiZWRfdmFyaWFibGUnKTtcbmZyb21GaWxlcyA9IHJlcXVpcmUoJy4vdGVzdGJlZF9sb2FkaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZyb21EaXJlY3RvcnlTbWFsbFN1YnNldDogZnJvbUZpbGVzLmZyb21EaXJlY3RvcnlTbWFsbFN1YnNldCxcbiAgICBmcm9tRGlyZWN0b3J5OiBmcm9tRmlsZXMuZnJvbURpcmVjdG9yeSxcbiAgICBpbWFnZV9saXN0OiBmcm9tVmFyaWFibGUuaW1hZ2VfbGlzdFxufTsiLCJ1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG5mdW5jdGlvbiBmcm9tRmlsZSgpIHtcbiAgICB2YXIgaXRlbXMgPSBudWxsO1xuICAgICQuYWpheFNldHVwKHthc3luYzogZmFsc2V9KTtcbiAgICAkLmdldChcImpzL2Fzc2V0cy9pbWFnZXMudHh0XCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaXRlbXMgPSBkYXRhLnNwbGl0KCdcXG4nKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlbXM7XG59XG5cbmZ1bmN0aW9uIHJldHJpZXZlRnJvbUZpbGUoZmlsZU5hbWUpe1xuICAgIHZhciBpdGVtcyA9IG51bGw7XG4gICAgJC5hamF4U2V0dXAoe2FzeW5jOiBmYWxzZX0pO1xuICAgIHZhciBwYXRoQW5kRmlsZU5hbWUgPSB1dGlsLmZvcm1hdChcImpzL2Fzc2V0cy97MH1cIiwgZmlsZU5hbWUpO1xuICAgICQuZ2V0KHBhdGhBbmRGaWxlTmFtZSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBpdGVtcyA9IGRhdGEuc3BsaXQoJ1xcbicpO1xuICAgIH0pO1xuICAgIHJldHVybiBpdGVtcztcbn1cblxuZnVuY3Rpb24gY29tcGxldGVBc3NldFdpdGhQYXRoKGltYWdlcykge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgIT09IGltYWdlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpbWFnZXNbaV0gPSAnLi4vSW1hZ2VNYW5pcHVsYXRpb24vanMvYXNzZXRzL2ltZy8nICsgaW1hZ2VzW2ldO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZnJvbURpcmVjdG9yeVNtYWxsU3Vic2V0KCkge1xuICAgIHZhciBpdGVtcyA9IHJldHJpZXZlRnJvbUZpbGUoJ3NtYWxsX2ltYWdlX3Rlc3RiZWQudHh0Jyk7XG4gICAgY29tcGxldGVBc3NldFdpdGhQYXRoKGl0ZW1zKTtcbiAgICByZXR1cm4gaXRlbXM7XG59XG5cbmZ1bmN0aW9uIGZyb21EaXJlY3RvcnkoKSB7XG4gICAgdmFyIGl0ZW1zID0gcmV0cmlldmVGcm9tRmlsZSgnbGlzdC50eHQnKTtcbiAgICBjb21wbGV0ZUFzc2V0V2l0aFBhdGgoaXRlbXMpO1xuICAgIHJldHVybiBpdGVtcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZnJvbURpcmVjdG9yeVNtYWxsU3Vic2V0OiBmcm9tRGlyZWN0b3J5U21hbGxTdWJzZXQsXG4gICAgZnJvbURpcmVjdG9yeTogZnJvbURpcmVjdG9yeVxufTsiLCIvKiAgVGhlIHRlc3QgYmVkXG4gSW1hZ2VzIHdlcmUgcHVsbGVkIGZyb20gc2V2ZXJhbCBzaXRlc1xuICovXG52YXIgaW1hZ2VfbGlzdCA9IFtcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg0OC9NSTAwMDM4NDgxOTguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2EyNDguZS5ha2FtYWkubmV0L2YvMTcyNi8zNjA5LzFtL21lZGlhLmNtZ2RpZ2l0YWwuY29tL3NoYXJlZC9pbWcvcGhvdG9zLzIwMTQvMDYvMjAvYWQvYmIvSmVhbm5lX0hlYWRzaG90XzIuanBnJyxcbiAgICAnaHR0cHM6Ly9hMjQ4LmUuYWthbWFpLm5ldC9mLzE3MjYvMzYwOS8xbS9tZWRpYS5jbWdkaWdpdGFsLmNvbS9zaGFyZWQvbHQvbHRfY2FjaGUvdGh1bWJuYWlsLzI5Mi9pbWcvc3RhZmYvMjAxNC8zODY5OThfNTEyMDkyMjg3NzE4Xzc1MDgzMzk3M19uLmpwZycsXG4gICAgJ2h0dHBzOi8vYTI0OC5lLmFrYW1haS5uZXQvZi8xNzI2LzM2MDkvMW0vbWVkaWEuY21nZGlnaXRhbC5jb20vc2hhcmVkL2x0L2x0X2NhY2hlL3RodW1ibmFpbC85MDgvaW1nL3Bob3Rvcy8yMDExLzA4LzAxL21vb2tpZS5qcGcnLFxuICAgICdodHRwczovL3MtbWVkaWEtY2FjaGUtYWswLnBpbmltZy5jb20vMjM2eC84OC9lMy80Yy84OGUzNGMxN2JmNzZjMWQ1MTc4YjBjZTA4ZDk5MzRlNi5qcGcnLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMzYxL01JMDAwMzM2MTQ5MC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy80OTcvTUkwMDAzNDk3OTMwLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzYyNy9NSTAwMDM2MjcwOTcuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDEvNDE4L01JMDAwMTQxODE2NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy80OTUvTUkwMDAzNDk1Mzk4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzI3Ny9NSTAwMDMyNzczNTIuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvNDA1L01JMDAwMTQwNTY2NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy81OTAvTUkwMDAzNTkwNjI2LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg3Ny9NSTAwMDM4Nzc1MTMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMzg4L01JMDAwMzM4ODQ1OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8zNDgvTUkwMDAzMzQ4MjcxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzM1OC9NSTAwMDMzNTgzNzcuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNTk0L01JMDAwMzU5NDI3OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy8wOTAvTUkwMDAzMDkwNDU5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzQ4NC9NSTAwMDM0ODQyMTUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODc3L01JMDAwMzg3NzcwNS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83OTgvTUkwMDAzNzk4NzYxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzM5Ny9NSTAwMDEzOTczNTAuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNjI3L01JMDAwMzYyNzE5My5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS80MDQvTUkwMDAxNDA0ODQzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzQzNi9NSTAwMDM0MzY4MzMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMzQ3L01JMDAwMzM0Nzg0Ny5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy8zNjAvTUkwMDAzMzYwNTUxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAxLzQxMy9NSTAwMDE0MTM5ODguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODQyL01JMDAwMzg0Mjk2NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS8zMjcvTUkwMDAxMzI3ODkzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzc3MC9NSTAwMDM3NzAwMjIuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODQwL01JMDAwMzg0MDUyOS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy81ODQvTUkwMDAzNTg0NzYyLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzc5NS9NSTAwMDM3OTUzMjUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvODAzL01JMDAwMzgwMzg1NS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NDAvTUkwMDAzODQwMzc0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzgzMi9NSTAwMDM4MzI3NzUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODAyL01JMDAwMzgwMjAyMS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83OTUvTUkwMDAzNzk1MzI0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzUzNS9NSTAwMDM1MzUxNjQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODU0L01JMDAwMzg1NDM4NS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83OTUvTUkwMDAzNzk1MzIxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg0MC9NSTAwMDM4NDAxODMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODY3L01JMDAwMzg2Nzg2My5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy85MDMvTUkwMDAzOTAzNzQ4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg2OS9NSTAwMDM4Njk2NzUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODE0L01JMDAwMzgxNDQwNS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy8yNzMvTUkwMDAzMjczNjQ5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzgzNy9NSTAwMDM4MzcxNjcuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMDQ1L01JMDAwMzA0NTM5OS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy80MzMvTUkwMDAzNDMzNzIxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzcwOS9NSTAwMDM3MDk3ODMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNTkyL01JMDAwMzU5Mjg1NS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NTkvTUkwMDAzODU5NDU1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzE4Mi9NSTAwMDMxODIwMjIuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODMyL01JMDAwMzgzMjk3NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83NzkvTUkwMDAzNzc5MzYxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg0OC9NSTAwMDM4NDgxOTguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDEvMzI4L01JMDAwMTMyODAzNy5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84ODgvTUkwMDAzODg4ODU2LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAxLzM5OS9NSTAwMDEzOTkxNzUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvMzI3L01JMDAwMTMyNzg3NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS8zNDUvTUkwMDAxMzQ1MTYwLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzQ4MS9NSTAwMDM0ODEyNzIuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODc0L01JMDAwMzg3NDEwNy5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83NTIvTUkwMDAzNzUyNDEzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzQzNi9NSTAwMDM0MzY5MDkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDEvMzk1L01JMDAwMTM5NTAxMC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NDkvTUkwMDAzODQ5MzE5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzQyMS9NSTAwMDM0MjE4ODguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODc0L01JMDAwMzg3NDUwMS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMS8zNjQvTUkwMDAxMzY0OTEyLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzcwOS9NSTAwMDM3MDk5OTkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDEvNDY1L01JMDAwMTQ2NTQxMy5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS80MDYvTUkwMDAxNDA2NDYwLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzcyMC9NSTAwMDM3MjA5ODcuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDEvMzI2L01JMDAwMTMyNjMzOC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84ODgvTUkwMDAzODg4ODgxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg3OS9NSTAwMDM4NzkxNjAuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODc5L01JMDAwMzg3OTg4NS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS8zMjUvTUkwMDAxMzI1NDMzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzM2NC9NSTAwMDMzNjQ0NTguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODc5L01JMDAwMzg3OTY3MS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy81NzEvTUkwMDAzNTcxMTQzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzgyOC9NSTAwMDM4Mjg0NzkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvODkxL01JMDAwMzg5MTE2OS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS80MDIvTUkwMDAxNDAyMTQwLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzY0MS9NSTAwMDM2NDE0NzQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMzUxL01JMDAwMzM1MTM3My5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8yNzYvTUkwMDAzMjc2MzQxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzY4OS9NSTAwMDM2ODkxODkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODM1L01JMDAwMzgzNTQ3OS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS80MDEvTUkwMDAxNDAxNjg0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAyLzc0OS9NSTAwMDI3NDk2NzkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNTkwL01JMDAwMzU5MDAzNS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84OTIvTUkwMDAzODkyODIzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzU5NC9NSTAwMDM1OTQ0NjQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzMyL01JMDAwMzczMjQ2Ny5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS8zMjkvTUkwMDAxMzI5NjIwLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzQwNS9NSTAwMDE0MDUwNzguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvMzY2L01JMDAwMTM2NjYwOC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS8zMjkvTUkwMDAxMzI5NTI4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzcxMi9NSTAwMDM3MTI2MTcuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDEvMzM2L01JMDAwMTMzNjc4NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8xNDgvTUkwMDAzMTQ4ODc1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzQ0NS9NSTAwMDM0NDUxMjkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvMzc4L01JMDAwMzM3ODc3Mi5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS8zOTkvTUkwMDAxMzk5MzQ1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzQwMS9NSTAwMDE0MDE1ODguanBnP3BhcnRuZXI9YWxscm92aS5jb20nIF07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGltYWdlX2xpc3Q6IGltYWdlX2xpc3Rcbn07XG4iLCIvKlxuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNsYXNzKG5hbWUscnVsZXMpe1xuICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgaWYoIShzdHlsZS5zaGVldHx8e30pLmluc2VydFJ1bGUpXG4gICAgICAgIChzdHlsZS5zdHlsZVNoZWV0IHx8IHN0eWxlLnNoZWV0KS5hZGRSdWxlKG5hbWUsIHJ1bGVzKTtcbiAgICBlbHNlXG4gICAgICAgIHN0eWxlLnNoZWV0Lmluc2VydFJ1bGUobmFtZStcIntcIitydWxlcytcIn1cIiwwKTtcbn1cblxuLypcblxuICovXG5mb3JtYXQgPSBmdW5jdGlvbihmb3JtYXQpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbihtYXRjaCwgbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXG4gICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXVxuICAgICAgICAgICAgOiBtYXRjaFxuICAgICAgICAgICAgO1xuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gZ2V0V2lkdGgoZWxlbWVudCkge1xuICAgIHJldHVybiBNYXRoLm1heChlbGVtZW50LmNsaWVudFdpZHRoLGVsZW1lbnQub2Zmc2V0V2lkdGgsZWxlbWVudC5zY3JvbGxXaWR0aCk7XG59XG5cbmZ1bmN0aW9uIGdldEhlaWdodChlbGVtZW50KSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KGVsZW1lbnQuY2xpZW50SGVpZ2h0LGVsZW1lbnQub2Zmc2V0SGVpZ2h0LGVsZW1lbnQuc2Nyb2xsSGVpZ2h0KTtcbn1cblxudmFyIGdldFByb3BlcnR5ID0ge1xuICAgIHdpZHRoOiBnZXRXaWR0aCxcbiAgICBoZWlnaHQ6IGdldEhlaWdodFxufTtcblxuZnVuY3Rpb24gZ2V0UHJvcGVydGllcyhlbGVtZW50KXtcbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogZ2V0UHJvcGVydHkud2lkdGgoZWxlbWVudCksXG4gICAgICAgIGhlaWdodDogZ2V0UHJvcGVydHkuaGVpZ2h0KGVsZW1lbnQpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjcmVhdGVDbGFzczogY3JlYXRlQ2xhc3MsXG4gICAgZm9ybWF0OiBmb3JtYXQsXG4gICAgZ2V0UHJvcGVydGllczogZ2V0UHJvcGVydGllc1xufTsiXX0=
