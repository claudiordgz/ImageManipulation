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
    return rectangleFace;
}

function isPointInsideSpace() {

}

function calculateBigBoxEncompassingFaces(faces){
    var minX = faces[0].vertices.OO.x || 0,
        maxX = faces[0].vertices.OA.x || 0,
        minY = faces[0].vertices.OO.y || 0,
        maxY = faces[0].vertices.OC.y || 0;
    if(faces.length > 1) {
        faces.sort(function(a, b) {
            return a.vertices.OO.x - b.vertices.OO.x;
        });
        minX = faces[0].vertices.OO.x || 0;
        maxX = faces[faces.length-1].vertices.OA.x || 0;
        faces.sort(function(a, b) {
            return a.vertices.OO.y - b.vertices.OO.y;
        });
        minY = faces[0].vertices.OO.y || 0;
        maxY = faces[faces.length-1].vertices.OC.y || 0;
    }
    return new graphics.FaceContainer(maxX - minX, maxY - minY, minX, minY,
        faces[0].sourceWidth, faces[0].sourceHeight,
        faces[0].targetWidth, faces[0].targetHeight);
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
    var encompassingContainer = calculateBigBoxEncompassingFaces(faces);
    encompassingContainer.recalculateVerticesWithOffset();
    console.log(encompassingContainer);
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
    for (var i=0; i!=parallelogramVertexSet.pMembers.length;++i) {
        var key = parallelogramVertexSet.pMembers[i];
        if (parallelogramVertexSet.hasOwnProperty(key)) {
            parallelogramVertexSet[key].x += offsetX;
            parallelogramVertexSet[key].y += offsetY;
        }
    }
}

FaceContainer.prototype.recalculateVerticesWithOffset = function() {
    this.backupVertices(this.vertices);
    recalculateVertices(this.vertices, this.offsetX, this.offsetY);
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
    this.pMembers = ['OO','OA','OB','OC'];
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9zdHJhdGVneS9pbWFnZVJlY29nbml0aW9uL2ZhY2VSZWNvZ25pdGlvbi9tYWluLmpzIiwic3JjL3N0cmF0ZWd5L2ltYWdlUmVjb2duaXRpb24vZ3JhcGhpY3MvZmFjZV9jb250YWluZXIuanMiLCJzcmMvc3RyYXRlZ3kvaW1hZ2VSZWNvZ25pdGlvbi9ncmFwaGljcy9tYWluLmpzIiwic3JjL3N0cmF0ZWd5L2ltYWdlUmVjb2duaXRpb24vZ3JhcGhpY3MvcGFyYWxsZWxvZ3JhbS5qcyIsInNyYy9zdHJhdGVneS9pbWFnZVJlY29nbml0aW9uL2dyYXBoaWNzL3ZlcnRleC5qcyIsInNyYy9zdHJhdGVneS9pbWFnZVJlY29nbml0aW9uL21haW4uanMiLCJzcmMvc3RyYXRlZ3kvbWFpbi5qcyIsInNyYy9zdHJhdGVneS9wb2xpY2llcy5qcyIsInNyYy9zdHJhdGVneS9zaGFyZWQvaW1hZ2UvbWFpbi5qcyIsInNyYy9zdHJhdGVneS93aWR0aEhlaWdodFBvc2l0aW9uaW5nL21haW4uanMiLCJzcmMvdGVzdGJlZC9tYWluLmpzIiwic3JjL3Rlc3RiZWQvdGVzdGJlZF9sb2FkaW5nLmpzIiwic3JjL3Rlc3RiZWQvdGVzdGJlZF92YXJpYWJsZS5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ0ZXN0YmVkID0gcmVxdWlyZSgnLi90ZXN0YmVkL21haW4nKTtcbmltYWdlUHJvY2Vzc2luZyA9IHJlcXVpcmUoJy4vc3RyYXRlZ3kvbWFpbicpO1xuXG5mdW5jdGlvbiBtYWluKCkge1xuICAgIHZhciBpdGVtcyA9IHRlc3RiZWQuZnJvbURpcmVjdG9yeVNtYWxsU3Vic2V0KCk7XG4gICAgaW1hZ2VQcm9jZXNzaW5nLnByb2Nlc3NJbWFnZXMoaXRlbXMpO1xufVxuXG4kKGRvY3VtZW50KS5vbmUoJ3JlYWR5JywgZnVuY3Rpb24oKSB7XG4gICAgbWFpbigpO1xufSk7IiwidmFyIGdyYXBoaWNzID0gcmVxdWlyZSgnLi4vZ3JhcGhpY3MvbWFpbicpO1xuXG4vKlxuICovXG5mdW5jdGlvbiBzZXR1cEltYWdlRmFjZUluc2lkZUNvbnRhaW5lcih3aWR0aCwgaGVpZ2h0LCBvZmZzZXRYLCBvZmZzZXRZLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJXaWR0aCwgY29udGFpbmVySGVpZ2h0KXtcbiAgICB2YXIgcmVjdGFuZ2xlRmFjZSA9IG5ldyBncmFwaGljcy5GYWNlQ29udGFpbmVyKHdpZHRoLCBoZWlnaHQsIG9mZnNldFgsIG9mZnNldFksIGltYWdlV2lkdGgsIGltYWdlSGVpZ2h0LCBjb250YWluZXJXaWR0aCwgY29udGFpbmVySGVpZ2h0KTtcbiAgICByZWN0YW5nbGVGYWNlLnJlY2FsY3VsYXRlVmVydGljZXNXaXRoT2Zmc2V0KCk7XG4gICAgcmV0dXJuIHJlY3RhbmdsZUZhY2U7XG59XG5cbmZ1bmN0aW9uIGlzUG9pbnRJbnNpZGVTcGFjZSgpIHtcblxufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVCaWdCb3hFbmNvbXBhc3NpbmdGYWNlcyhmYWNlcyl7XG4gICAgdmFyIG1pblggPSBmYWNlc1swXS52ZXJ0aWNlcy5PTy54IHx8IDAsXG4gICAgICAgIG1heFggPSBmYWNlc1swXS52ZXJ0aWNlcy5PQS54IHx8IDAsXG4gICAgICAgIG1pblkgPSBmYWNlc1swXS52ZXJ0aWNlcy5PTy55IHx8IDAsXG4gICAgICAgIG1heFkgPSBmYWNlc1swXS52ZXJ0aWNlcy5PQy55IHx8IDA7XG4gICAgaWYoZmFjZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBmYWNlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLnZlcnRpY2VzLk9PLnggLSBiLnZlcnRpY2VzLk9PLng7XG4gICAgICAgIH0pO1xuICAgICAgICBtaW5YID0gZmFjZXNbMF0udmVydGljZXMuT08ueCB8fCAwO1xuICAgICAgICBtYXhYID0gZmFjZXNbZmFjZXMubGVuZ3RoLTFdLnZlcnRpY2VzLk9BLnggfHwgMDtcbiAgICAgICAgZmFjZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS52ZXJ0aWNlcy5PTy55IC0gYi52ZXJ0aWNlcy5PTy55O1xuICAgICAgICB9KTtcbiAgICAgICAgbWluWSA9IGZhY2VzWzBdLnZlcnRpY2VzLk9PLnkgfHwgMDtcbiAgICAgICAgbWF4WSA9IGZhY2VzW2ZhY2VzLmxlbmd0aC0xXS52ZXJ0aWNlcy5PQy55IHx8IDA7XG4gICAgfVxuICAgIHJldHVybiBuZXcgZ3JhcGhpY3MuRmFjZUNvbnRhaW5lcihtYXhYIC0gbWluWCwgbWF4WSAtIG1pblksIG1pblgsIG1pblksXG4gICAgICAgIGZhY2VzWzBdLnNvdXJjZVdpZHRoLCBmYWNlc1swXS5zb3VyY2VIZWlnaHQsXG4gICAgICAgIGZhY2VzWzBdLnRhcmdldFdpZHRoLCBmYWNlc1swXS50YXJnZXRIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBmYWNlVHJhY2tpbmcoZmFjZVJlY29nbml6ZWRFdmVudCwgaW1hZ2VQYWNrKXtcbiAgICB2YXIgZmFjZXMgPSBbXTtcbiAgICBmb3IodmFyIGkgPSAwOyBpICE9IGZhY2VSZWNvZ25pemVkRXZlbnQuZGF0YS5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgZGF0YSA9IGZhY2VSZWNvZ25pemVkRXZlbnQuZGF0YVtpXTtcbiAgICAgICAgdmFyIGNvbnRhaW5lclByb3BlcnRpZXMgPSB1dGlsLmdldFByb3BlcnRpZXMoaW1hZ2VQYWNrLmVsZW1lbnRDb250YWluaW5nSW1hZ2VbMF0pO1xuICAgICAgICBmYWNlcy5wdXNoKHNldHVwSW1hZ2VGYWNlSW5zaWRlQ29udGFpbmVyKGRhdGEud2lkdGgsIGRhdGEuaGVpZ2h0LCBkYXRhLngsIGRhdGEueSxcbiAgICAgICAgICAgIGltYWdlUGFjay53aWR0aCxpbWFnZVBhY2suaGVpZ2h0LFxuICAgICAgICAgICAgY29udGFpbmVyUHJvcGVydGllcy53aWR0aCwgY29udGFpbmVyUHJvcGVydGllcy5oZWlnaHQpKTtcbiAgICB9XG4gICAgdmFyIGVuY29tcGFzc2luZ0NvbnRhaW5lciA9IGNhbGN1bGF0ZUJpZ0JveEVuY29tcGFzc2luZ0ZhY2VzKGZhY2VzKTtcbiAgICBlbmNvbXBhc3NpbmdDb250YWluZXIucmVjYWxjdWxhdGVWZXJ0aWNlc1dpdGhPZmZzZXQoKTtcbiAgICBjb25zb2xlLmxvZyhlbmNvbXBhc3NpbmdDb250YWluZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBmYWNlVHJhY2tpbmc6IGZhY2VUcmFja2luZ1xufTsiLCJwYXJhbGxlbG9ncmFtID0gcmVxdWlyZSgnLi9wYXJhbGxlbG9ncmFtJyk7XG5cbkZhY2VDb250YWluZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJhbGxlbG9ncmFtLlBhcmFsbGVsb2dyYW0ucHJvdG90eXBlKTtcbkZhY2VDb250YWluZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRmFjZUNvbnRhaW5lcjtcblxuZnVuY3Rpb24gRmFjZUNvbnRhaW5lcih3aWR0aCwgaGVpZ2h0LCBvZmZzZXRYLCBvZmZzZXRZLCBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCwgY29udGFpbmVyV2lkdGgsIGNvbnRhaW5lckhlaWdodCkge1xuICAgIHBhcmFsbGVsb2dyYW0uUGFyYWxsZWxvZ3JhbS5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMub2Zmc2V0WCA9IG9mZnNldFg7XG4gICAgdGhpcy5vZmZzZXRZID0gb2Zmc2V0WTtcbiAgICB0aGlzLnNvdXJjZVdpZHRoID0gaW1hZ2VXaWR0aDtcbiAgICB0aGlzLnNvdXJjZUhlaWdodCA9IGltYWdlSGVpZ2h0O1xuICAgIHRoaXMudGFyZ2V0V2lkdGggPSBjb250YWluZXJXaWR0aDtcbiAgICB0aGlzLnRhcmdldEhlaWdodCA9IGNvbnRhaW5lckhlaWdodDtcbn1cblxuZnVuY3Rpb24gcmVjYWxjdWxhdGVWZXJ0aWNlcyhwYXJhbGxlbG9ncmFtVmVydGV4U2V0LCBvZmZzZXRYLCBvZmZzZXRZKSB7XG4gICAgZm9yICh2YXIgaT0wOyBpIT1wYXJhbGxlbG9ncmFtVmVydGV4U2V0LnBNZW1iZXJzLmxlbmd0aDsrK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IHBhcmFsbGVsb2dyYW1WZXJ0ZXhTZXQucE1lbWJlcnNbaV07XG4gICAgICAgIGlmIChwYXJhbGxlbG9ncmFtVmVydGV4U2V0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHBhcmFsbGVsb2dyYW1WZXJ0ZXhTZXRba2V5XS54ICs9IG9mZnNldFg7XG4gICAgICAgICAgICBwYXJhbGxlbG9ncmFtVmVydGV4U2V0W2tleV0ueSArPSBvZmZzZXRZO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5GYWNlQ29udGFpbmVyLnByb3RvdHlwZS5yZWNhbGN1bGF0ZVZlcnRpY2VzV2l0aE9mZnNldCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYmFja3VwVmVydGljZXModGhpcy52ZXJ0aWNlcyk7XG4gICAgcmVjYWxjdWxhdGVWZXJ0aWNlcyh0aGlzLnZlcnRpY2VzLCB0aGlzLm9mZnNldFgsIHRoaXMub2Zmc2V0WSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBGYWNlQ29udGFpbmVyOiBGYWNlQ29udGFpbmVyXG59OyIsImZhY2VfY29udGFpbmVyID0gcmVxdWlyZSgnLi9mYWNlX2NvbnRhaW5lcicpO1xucGFyYWxsZWxvZ3JhbSA9IHJlcXVpcmUoJy4vcGFyYWxsZWxvZ3JhbScpO1xudmVydGV4ID0gcmVxdWlyZSgnLi92ZXJ0ZXgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgRmFjZUNvbnRhaW5lcjogZmFjZV9jb250YWluZXIuRmFjZUNvbnRhaW5lcixcbiAgICBQYXJhbGxlbG9ncmFtOiBwYXJhbGxlbG9ncmFtLlBhcmFsbGVsb2dyYW0sXG4gICAgVmVydGV4MkQ6IHZlcnRleC5WZXJ0ZXgyRFxufTsiLCJ2ZXJ0ZXggPSByZXF1aXJlKCcuL3ZlcnRleCcpO1xuXG5cbmZ1bmN0aW9uIFBhcmFsbGVsb2dyYW1WZXJ0ZXhTZXQod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMucE1lbWJlcnMgPSBbJ09PJywnT0EnLCdPQicsJ09DJ107XG4gICAgdGhpcy5PTyA9IG5ldyB2ZXJ0ZXguVmVydGV4MkQoMCwgMCk7XG4gICAgdGhpcy5PQSA9IG5ldyB2ZXJ0ZXguVmVydGV4MkQoMCArIHdpZHRoLCAwKTtcbiAgICB0aGlzLk9CID0gbmV3IHZlcnRleC5WZXJ0ZXgyRCgwLCAwICsgaGVpZ2h0KTtcbiAgICB0aGlzLk9DID0gbmV3IHZlcnRleC5WZXJ0ZXgyRCgwICsgd2lkdGgsIDAgKyBoZWlnaHQpO1xuICAgIHRoaXMuZXF1YWxzID0gZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIG90aGVyLk9PLmVxdWFscyh0aGlzLk9PKSAmJiBvdGhlci5PQS5lcXVhbHModGhpcy5PQSkgJiYgb3RoZXIuT0IuZXF1YWxzKHRoaXMuT0IpICYmIG90aGVyLk9DLmVxdWFscyh0aGlzLk9DKTtcbiAgICB9O1xuICAgIHRoaXMuY29weSA9IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHRoaXMuT08uY29weShvdGhlci5PTyk7XG4gICAgICAgIHRoaXMuT0EuY29weShvdGhlci5PQSk7XG4gICAgICAgIHRoaXMuT0IuY29weShvdGhlci5PQik7XG4gICAgICAgIHRoaXMuT0MuY29weShvdGhlci5PQyk7XG4gICAgfVxufVxuXG5cbi8qIEBjbGFzcyBQYXJhbGxlbG9ncmFtIHdpdGggdGhlIGZvbGxvd2luZ1xuIHZlcnRpY2VzXG4gT08gX19fX19fXyBPQVxuIHwgICAgICAgfFxuIHxfX19fX19ffFxuIE9CICAgICAgICAgT0MgKi9cbmZ1bmN0aW9uIFBhcmFsbGVsb2dyYW0od2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLnZlcnRpY2VzID0gbmV3IFBhcmFsbGVsb2dyYW1WZXJ0ZXhTZXQod2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5fX3ByZXZpb3VzU3RhdGVWZXJ0aWNlcyA9IG5ldyBQYXJhbGxlbG9ncmFtVmVydGV4U2V0KHdpZHRoLCBoZWlnaHQpO1xufVxuXG5QYXJhbGxlbG9ncmFtLnByb3RvdHlwZS5yZXNldFZlcnRpY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYoIXRoaXMudmVydGljZXMuZXF1YWxzKHRoaXMuX19wcmV2aW91c1N0YXRlVmVydGljZXMpKXtcbiAgICAgICAgdmFyIGxvY2FsQ29weSA9IG5ldyBQYXJhbGxlbG9ncmFtVmVydGV4U2V0KHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgbG9jYWxDb3B5LmNvcHkodGhpcy52ZXJ0aWNlcyk7XG4gICAgICAgIHRoaXMudmVydGljZXMuY29weSh0aGlzLl9fcHJldmlvdXNTdGF0ZVZlcnRpY2VzKTtcbiAgICAgICAgdGhpcy5fX3ByZXZpb3VzU3RhdGVWZXJ0aWNlcy5jb3B5KGxvY2FsQ29weSk7XG4gICAgfVxufTtcblxuUGFyYWxsZWxvZ3JhbS5wcm90b3R5cGUuYmFja3VwVmVydGljZXMgPSBmdW5jdGlvbiAodmVydGljZXMpIHtcbiAgICBpZighdGhpcy5fX3ByZXZpb3VzU3RhdGVWZXJ0aWNlcy5lcXVhbHModmVydGljZXMpKXtcbiAgICAgICAgdGhpcy5fX3ByZXZpb3VzU3RhdGVWZXJ0aWNlcy5jb3B5KHZlcnRpY2VzKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBQYXJhbGxlbG9ncmFtOiBQYXJhbGxlbG9ncmFtXG59OyIsIi8qIEBjbGFzcyBWZXJ0ZXgyRFxuIEFzIGl0IG5hbWUgaW1wbGllcyBhIHZlcnRleCBzdHJ1Y3R1cmVcbiBmb3IgMiBEaW1lbnNpb25hbCBQb2x5Z29ucyAqL1xuZnVuY3Rpb24gVmVydGV4MkQoeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmVxdWFscyA9IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBvdGhlci54ID09IHRoaXMueCAmJiBvdGhlci55ID09IHRoaXMueTtcbiAgICB9O1xuICAgIHRoaXMuY29weSA9IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHRoaXMueCA9IG90aGVyLng7XG4gICAgICAgIHRoaXMueSA9IG90aGVyLnk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVmVydGV4MkQ6IFZlcnRleDJEXG59OyIsInZhciB1dGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpO1xudmFyIGltYWdlID0gcmVxdWlyZSgnLi4vc2hhcmVkL2ltYWdlL21haW4nKTtcbnZhciBmYWNlUmVjb2duaXRpb24gPSByZXF1aXJlKCcuL2ZhY2VSZWNvZ25pdGlvbi9tYWluJyk7XG5cbmZ1bmN0aW9uIHRyYWNraW5nSnNGcm9tTG9jYWxJbWFnZShpbWFnZUVsZW1lbnQsIGltYWdlQ29udGFpbmVyLCBpbWdVcmwsICB3aWR0aCwgaGVpZ2h0LCBpbWdDbGFzcykge1xuICAgIHZhciB0cmFja2VyID0gbmV3IHRyYWNraW5nLk9iamVjdFRyYWNrZXIoWydmYWNlJ10pO1xuICAgIHRyYWNrZXIuc291cmNlRWxlbWVudCA9IG5ldyBpbWFnZS5JbWFnZVBhY2sod2lkdGgsIGhlaWdodCwgJy4nICsgaW1nQ2xhc3MsIGltYWdlQ29udGFpbmVyKTtcbiAgICB0cmFja2VyLnNldFN0ZXBTaXplKDEuNyk7XG4gICAgdHJhY2tpbmcudHJhY2soaW1hZ2VFbGVtZW50LCB0cmFja2VyKTtcbiAgICB0cmFja2VyLm9uKCd0cmFjaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5kYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGVsZW1lbnRzIGZvdW5kJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmYWNlUmVjb2duaXRpb24uZmFjZVRyYWNraW5nKGV2ZW50LCB0aGlzLnNvdXJjZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHV0aWwuZm9ybWF0KCdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFwnezB9XFwnKTsgIG5vLXJlcGVhdCBjZW50ZXIgY2VudGVyIGZpeGVkOyBcXFxuICAgICAgICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZTogY292ZXI7IFxcXG4gICAgICAgIC1tb3otYmFja2dyb3VuZC1zaXplOiBjb3ZlcjsgXFxcbiAgICAgICAgLW8tYmFja2dyb3VuZC1zaXplOiBjb3ZlcjsgXFxcbiAgICAgICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjsnLCBpbWdVcmwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwb2xpY3k6IHRyYWNraW5nSnNGcm9tTG9jYWxJbWFnZVxufTsiLCJ1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xucG9saWNpZXMgPSByZXF1aXJlKCcuL3BvbGljaWVzJyk7XG5cbi8vIGNtX21vYkhlYWRlcl9hcnRpc3Rfb3ZlcmxheSAtIFRoZSBmdWxsIGhlYWRlciBiYWNrZ3JvdW5kIGRpdlxuLy8gY21fbW9iSGVhZGVyX2FydGlzdF9pbWFnZSAtIFRoZSBjaXJjbGUgZGl2IHRoYXQgd2lsbCBjb250YWluIHRoZSBpbWFnZVxuLy8gY21fbW9iSGVhZGVyX2FydGlzdC1vdmVybGF5LS1zdHlsZSAtIFdlIHdpbGwgcHV0IGV2ZXJ5dGhpbmcgcmVsYXRlZCB0byB0aGUgYmFja2dyb3VuZCBvZiBhcnRpc3Rfb3ZlcmxheSBpbiBoZXJlXG4vLyBjbV9tb2JIZWFkZXJfYXJ0aXN0LWltYWdlLS1zdHlsZSAtIFdlIHdpbGwgcHV0IGV2ZXJ5dGhpbmcgcmVsYXRlZCB0byBiYWNrZ3JvdW5kIG9mIGFydGlzdF9pbWFnZSBpbiBoZXJlXG5mdW5jdGlvbiBkZWZhdWx0UG9saWN5KGluZGV4LCBlbGVtZW50LCBpbWdVcmwsIHBvbGljeSkge1xuICAgIHZhciBvdmFsQmFja2dyb3VuZENsYXNzTmFtZSA9IHV0aWwuZm9ybWF0KCdjbV9tb2JIZWFkZXJfYXJ0aXN0LWltYWdlLS1zdHlsZS17MH0nLCBpbmRleCk7XG5cbiAgICB2YXIgb3ZlcmxheUNsYXNzTmFtZSA9IHV0aWwuZm9ybWF0KCdjbV9tb2JIZWFkZXJfYXJ0aXN0LW92ZXJsYXktLXN0eWxlLXswfScsIGluZGV4KTtcbiAgICB2YXIgb3ZlcmxheUJhY2tncm91bmQgPSB1dGlsLmZvcm1hdCgnYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcJ3swfVxcJyk7IGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50OycsIGltZ1VybCk7XG4gICAgdXRpbC5jcmVhdGVDbGFzcygnLicgKyBvdmVybGF5Q2xhc3NOYW1lLCBvdmVybGF5QmFja2dyb3VuZCk7XG5cbiAgICB2YXIgb3ZlcmxheUltZyA9IG5ldyBJbWFnZSgpO1xuICAgIG92ZXJsYXlJbWcuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgb3ZlcmxheUltZy5vdmVybGF5Q2xhc3NOYW1lID0gb3ZlcmxheUNsYXNzTmFtZTtcbiAgICBvdmVybGF5SW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLmNtX21vYkhlYWRlcl9hcnRpc3Rfb3ZlcmxheScpLmFkZENsYXNzKHRoaXMub3ZlcmxheUNsYXNzTmFtZSk7XG4gICAgfTtcbiAgICBvdmVybGF5SW1nLnNyYyA9IGltZ1VybDtcblxuICAgIHZhciBvdmFsSW1nID0gbmV3IEltYWdlKCk7XG5cbiAgICBvdmFsSW1nLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIG92YWxJbWcuY2xhc3NOYW1lID0gb3ZhbEJhY2tncm91bmRDbGFzc05hbWU7XG4gICAgb3ZhbEltZy5pbWFnZVNyYyA9IGltZ1VybDtcbiAgICBvdmFsSW1nLnBvbGljeSA9IHBvbGljeTtcbiAgICBvdmFsSW1nLnNlbGYgPSBvdmFsSW1nO1xuICAgIG92YWxJbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMucG9saWN5KSB7XG4gICAgICAgICAgICB2YXIgaW1hZ2VDb250YWluZXJDbGFzc05hbWUgPSAnLmNtX21vYkhlYWRlcl9hcnRpc3RfaW1hZ2UnO1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudC5maW5kKGltYWdlQ29udGFpbmVyQ2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY29udGFpbmVyUHJvcGVydGllcyA9IHV0aWwuZ2V0UHJvcGVydGllcyhjb250YWluZXJbMF0pO1xuICAgICAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5wb2xpY3kodGhpcy5zZWxmLCBjb250YWluZXIsIHRoaXMuaW1hZ2VTcmMsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLmNsYXNzTmFtZSk7XG4gICAgICAgICAgICB1dGlsLmNyZWF0ZUNsYXNzKCcuJyArIHRoaXMuY2xhc3NOYW1lLCBzdHlsZSk7XG4gICAgICAgICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5jbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBvdmFsSW1nLnNyYyA9IGltZ1VybDtcbn1cblxuZnVuY3Rpb24gYXBwZW5kRWxlbWVudChpbmRleCwgaW1hZ2VVcmwsIHJvdywgZWxlbWVudCwgcG9saWN5LCBzdWJQb2xpY3kpIHtcbiAgICB2YXIgY2FyZCA9IGVsZW1lbnQoe1xuICAgICAgICAnc29uZ05hbWUnOiAnU29uZyBOYW1lJyxcbiAgICAgICAgJ2FydGlzdE5hbWUnOiAnQXJ0aXN0IE5hbWUnXG4gICAgfSk7XG4gICAgcG9saWN5KGluZGV4LCBjYXJkLCBpbWFnZVVybCwgc3ViUG9saWN5KTtcbiAgICAkKHJvdykuYXBwZW5kKGNhcmQpO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzSW1hZ2VzKGltYWdlcyl7XG4gICAgZm9yKGkgPSAwOyBpICE9PSBpbWFnZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHJvdyA9IGljaC5lbFJvdygpO1xuICAgICAgICB2YXIgaW5kZXhTdHJpbmcgPSBpLnRvU3RyaW5nKCk7XG4gICAgICAgIGFwcGVuZEVsZW1lbnQoaW5kZXhTdHJpbmcrJy1hJywgaW1hZ2VzW2ldLCByb3csIGljaC5lbGVtZW50LCBkZWZhdWx0UG9saWN5LCBwb2xpY2llcy50cmFja2luZ0pzKTtcbiAgICAgICAgYXBwZW5kRWxlbWVudChpbmRleFN0cmluZysnLWInLCBpbWFnZXNbaV0sIHJvdywgaWNoLmVsZW1lbnQsIGRlZmF1bHRQb2xpY3ksIHBvbGljaWVzLndpZHRoSGVpZ2h0UG9zaXRpb25pbmcpO1xuICAgICAgICBhcHBlbmRFbGVtZW50KGluZGV4U3RyaW5nKyctYycsIGltYWdlc1tpXSwgcm93LCBpY2guZWxlbWVudCwgZGVmYXVsdFBvbGljeSwgcG9saWNpZXMud2lkdGhIZWlnaHRQb3NpdGlvbmluZyk7XG4gICAgICAgICQoXCIubWFzc1wiKS5hcHBlbmQocm93KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByb2Nlc3NJbWFnZXM6IHByb2Nlc3NJbWFnZXNcbn07IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGNyb2RyaWd1ZXoyIG9uIDkvOS8xNS5cbiAqL1xuaW1hZ2VSZWNvZ25pdGlvbiA9IHJlcXVpcmUoJy4vaW1hZ2VSZWNvZ25pdGlvbi9tYWluJyk7XG53aWR0aEhlaWdodFBvc2l0aW9uaW5nID0gcmVxdWlyZSgnLi93aWR0aEhlaWdodFBvc2l0aW9uaW5nL21haW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdHJhY2tpbmdKczogaW1hZ2VSZWNvZ25pdGlvbi5wb2xpY3ksXG4gICAgd2lkdGhIZWlnaHRQb3NpdGlvbmluZzogd2lkdGhIZWlnaHRQb3NpdGlvbmluZy5wb2xpY3lcbn07IiwiZnVuY3Rpb24gSW1hZ2VQYWNrICh3aWR0aCwgaGVpZ2h0LCBpbWFnZUNsYXNzTmFtZSwgZWxlbWVudENvbnRhaW5pbmdJbWFnZSkge1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLmltYWdlQ2xhc3NOYW1lID0gaW1hZ2VDbGFzc05hbWU7XG4gICAgdGhpcy5lbGVtZW50Q29udGFpbmluZ0ltYWdlID0gZWxlbWVudENvbnRhaW5pbmdJbWFnZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEltYWdlUGFjazogSW1hZ2VQYWNrXG59OyIsInV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlsJyk7XG5cbmZ1bmN0aW9uIGN1cnJlbnRQb2xpY3koaW1hZ2VFbGVtZW50LCBpbWFnZUNvbnRhaW5lciwgaW1nVXJsLCB3aWR0aCwgaGVpZ2h0LCBpbWdDbGFzcykge1xuICAgIHJldHVybiB1dGlsLmZvcm1hdCgnYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcJ3swfVxcJyk7JywgaW1nVXJsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcG9saWN5OiBjdXJyZW50UG9saWN5XG59OyIsImZyb21WYXJpYWJsZSA9IHJlcXVpcmUoJy4vdGVzdGJlZF92YXJpYWJsZScpO1xuZnJvbUZpbGVzID0gcmVxdWlyZSgnLi90ZXN0YmVkX2xvYWRpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZnJvbURpcmVjdG9yeVNtYWxsU3Vic2V0OiBmcm9tRmlsZXMuZnJvbURpcmVjdG9yeVNtYWxsU3Vic2V0LFxuICAgIGZyb21EaXJlY3Rvcnk6IGZyb21GaWxlcy5mcm9tRGlyZWN0b3J5LFxuICAgIGltYWdlX2xpc3Q6IGZyb21WYXJpYWJsZS5pbWFnZV9saXN0XG59OyIsInV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbmZ1bmN0aW9uIGZyb21GaWxlKCkge1xuICAgIHZhciBpdGVtcyA9IG51bGw7XG4gICAgJC5hamF4U2V0dXAoe2FzeW5jOiBmYWxzZX0pO1xuICAgICQuZ2V0KFwianMvYXNzZXRzL2ltYWdlcy50eHRcIiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBpdGVtcyA9IGRhdGEuc3BsaXQoJ1xcbicpO1xuICAgIH0pO1xuICAgIHJldHVybiBpdGVtcztcbn1cblxuZnVuY3Rpb24gcmV0cmlldmVGcm9tRmlsZShmaWxlTmFtZSl7XG4gICAgdmFyIGl0ZW1zID0gbnVsbDtcbiAgICAkLmFqYXhTZXR1cCh7YXN5bmM6IGZhbHNlfSk7XG4gICAgdmFyIHBhdGhBbmRGaWxlTmFtZSA9IHV0aWwuZm9ybWF0KFwianMvYXNzZXRzL3swfVwiLCBmaWxlTmFtZSk7XG4gICAgJC5nZXQocGF0aEFuZEZpbGVOYW1lLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGl0ZW1zID0gZGF0YS5zcGxpdCgnXFxuJyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZW1zO1xufVxuXG5mdW5jdGlvbiBjb21wbGV0ZUFzc2V0V2l0aFBhdGgoaW1hZ2VzKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSAhPT0gaW1hZ2VzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGltYWdlc1tpXSA9ICcuLi9JbWFnZU1hbmlwdWxhdGlvbi9qcy9hc3NldHMvaW1nLycgKyBpbWFnZXNbaV07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmcm9tRGlyZWN0b3J5U21hbGxTdWJzZXQoKSB7XG4gICAgdmFyIGl0ZW1zID0gcmV0cmlldmVGcm9tRmlsZSgnc21hbGxfaW1hZ2VfdGVzdGJlZC50eHQnKTtcbiAgICBjb21wbGV0ZUFzc2V0V2l0aFBhdGgoaXRlbXMpO1xuICAgIHJldHVybiBpdGVtcztcbn1cblxuZnVuY3Rpb24gZnJvbURpcmVjdG9yeSgpIHtcbiAgICB2YXIgaXRlbXMgPSByZXRyaWV2ZUZyb21GaWxlKCdsaXN0LnR4dCcpO1xuICAgIGNvbXBsZXRlQXNzZXRXaXRoUGF0aChpdGVtcyk7XG4gICAgcmV0dXJuIGl0ZW1zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBmcm9tRGlyZWN0b3J5U21hbGxTdWJzZXQ6IGZyb21EaXJlY3RvcnlTbWFsbFN1YnNldCxcbiAgICBmcm9tRGlyZWN0b3J5OiBmcm9tRGlyZWN0b3J5XG59OyIsIi8qICBUaGUgdGVzdCBiZWRcbiBJbWFnZXMgd2VyZSBwdWxsZWQgZnJvbSBzZXZlcmFsIHNpdGVzXG4gKi9cbnZhciBpbWFnZV9saXN0ID0gW1xuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODQ4L01JMDAwMzg0ODE5OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vYTI0OC5lLmFrYW1haS5uZXQvZi8xNzI2LzM2MDkvMW0vbWVkaWEuY21nZGlnaXRhbC5jb20vc2hhcmVkL2ltZy9waG90b3MvMjAxNC8wNi8yMC9hZC9iYi9KZWFubmVfSGVhZHNob3RfMi5qcGcnLFxuICAgICdodHRwczovL2EyNDguZS5ha2FtYWkubmV0L2YvMTcyNi8zNjA5LzFtL21lZGlhLmNtZ2RpZ2l0YWwuY29tL3NoYXJlZC9sdC9sdF9jYWNoZS90aHVtYm5haWwvMjkyL2ltZy9zdGFmZi8yMDE0LzM4Njk5OF81MTIwOTIyODc3MThfNzUwODMzOTczX24uanBnJyxcbiAgICAnaHR0cHM6Ly9hMjQ4LmUuYWthbWFpLm5ldC9mLzE3MjYvMzYwOS8xbS9tZWRpYS5jbWdkaWdpdGFsLmNvbS9zaGFyZWQvbHQvbHRfY2FjaGUvdGh1bWJuYWlsLzkwOC9pbWcvcGhvdG9zLzIwMTEvMDgvMDEvbW9va2llLmpwZycsXG4gICAgJ2h0dHBzOi8vcy1tZWRpYS1jYWNoZS1hazAucGluaW1nLmNvbS8yMzZ4Lzg4L2UzLzRjLzg4ZTM0YzE3YmY3NmMxZDUxNzhiMGNlMDhkOTkzNGU2LmpwZycsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8zNjEvTUkwMDAzMzYxNDkwLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzQ5Ny9NSTAwMDM0OTc5MzAuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNjI3L01JMDAwMzYyNzA5Ny5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMS80MTgvTUkwMDAxNDE4MTY0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzQ5NS9NSTAwMDM0OTUzOTguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMjc3L01JMDAwMzI3NzM1Mi5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS80MDUvTUkwMDAxNDA1NjY0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzU5MC9NSTAwMDM1OTA2MjYuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODc3L01JMDAwMzg3NzUxMy5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8zODgvTUkwMDAzMzg4NDU4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzM0OC9NSTAwMDMzNDgyNzEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMzU4L01JMDAwMzM1ODM3Ny5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy81OTQvTUkwMDAzNTk0Mjc4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzA5MC9NSTAwMDMwOTA0NTkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNDg0L01JMDAwMzQ4NDIxNS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NzcvTUkwMDAzODc3NzA1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzc5OC9NSTAwMDM3OTg3NjEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvMzk3L01JMDAwMTM5NzM1MC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy82MjcvTUkwMDAzNjI3MTkzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzQwNC9NSTAwMDE0MDQ4NDMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNDM2L01JMDAwMzQzNjgzMy5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8zNDcvTUkwMDAzMzQ3ODQ3LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzM2MC9NSTAwMDMzNjA1NTEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDEvNDEzL01JMDAwMTQxMzk4OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NDIvTUkwMDAzODQyOTY0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzMyNy9NSTAwMDEzMjc4OTMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzcwL01JMDAwMzc3MDAyMi5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NDAvTUkwMDAzODQwNTI5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzU4NC9NSTAwMDM1ODQ3NjIuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzk1L01JMDAwMzc5NTMyNS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy84MDMvTUkwMDAzODAzODU1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg0MC9NSTAwMDM4NDAzNzQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODMyL01JMDAwMzgzMjc3NS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84MDIvTUkwMDAzODAyMDIxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzc5NS9NSTAwMDM3OTUzMjQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNTM1L01JMDAwMzUzNTE2NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NTQvTUkwMDAzODU0Mzg1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzc5NS9NSTAwMDM3OTUzMjEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODQwL01JMDAwMzg0MDE4My5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NjcvTUkwMDAzODY3ODYzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzkwMy9NSTAwMDM5MDM3NDguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODY5L01JMDAwMzg2OTY3NS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84MTQvTUkwMDAzODE0NDA1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzI3My9NSTAwMDMyNzM2NDkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODM3L01JMDAwMzgzNzE2Ny5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8wNDUvTUkwMDAzMDQ1Mzk5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzQzMy9NSTAwMDM0MzM3MjEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzA5L01JMDAwMzcwOTc4My5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy81OTIvTUkwMDAzNTkyODU1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg1OS9NSTAwMDM4NTk0NTUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvMTgyL01JMDAwMzE4MjAyMi5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84MzIvTUkwMDAzODMyOTc0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzc3OS9NSTAwMDM3NzkzNjEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODQ4L01JMDAwMzg0ODE5OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMS8zMjgvTUkwMDAxMzI4MDM3LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg4OC9NSTAwMDM4ODg4NTYuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDEvMzk5L01JMDAwMTM5OTE3NS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS8zMjcvTUkwMDAxMzI3ODc0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzM0NS9NSTAwMDEzNDUxNjAuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNDgxL01JMDAwMzQ4MTI3Mi5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NzQvTUkwMDAzODc0MTA3LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzc1Mi9NSTAwMDM3NTI0MTMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNDM2L01JMDAwMzQzNjkwOS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMS8zOTUvTUkwMDAxMzk1MDEwLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg0OS9NSTAwMDM4NDkzMTkuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNDIxL01JMDAwMzQyMTg4OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NzQvTUkwMDAzODc0NTAxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAxLzM2NC9NSTAwMDEzNjQ5MTIuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzA5L01JMDAwMzcwOTk5OS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMS80NjUvTUkwMDAxNDY1NDEzLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzQwNi9NSTAwMDE0MDY0NjAuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzIwL01JMDAwMzcyMDk4Ny5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMS8zMjYvTUkwMDAxMzI2MzM4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg4OC9NSTAwMDM4ODg4ODEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODc5L01JMDAwMzg3OTE2MC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NzkvTUkwMDAzODc5ODg1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzMyNS9NSTAwMDEzMjU0MzMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvMzY0L01JMDAwMzM2NDQ1OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84NzkvTUkwMDAzODc5NjcxLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR18yNTAvTUkwMDAzLzU3MS9NSTAwMDM1NzExNDMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvODI4L01JMDAwMzgyODQ3OS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy84OTEvTUkwMDAzODkxMTY5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzQwMi9NSTAwMDE0MDIxNDAuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNjQxL01JMDAwMzY0MTQ3NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy8zNTEvTUkwMDAzMzUxMzczLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzI3Ni9NSTAwMDMyNzYzNDEuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNjg5L01JMDAwMzY4OTE4OS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy84MzUvTUkwMDAzODM1NDc5LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzQwMS9NSTAwMDE0MDE2ODQuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDIvNzQ5L01JMDAwMjc0OTY3OS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy81OTAvTUkwMDAzNTkwMDM1LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzg5Mi9NSTAwMDM4OTI4MjMuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNTk0L01JMDAwMzU5NDQ2NC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMy83MzIvTUkwMDAzNzMyNDY3LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzMyOS9NSTAwMDEzMjk2MjAuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvNDA1L01JMDAwMTQwNTA3OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfNDAwL01JMDAwMS8zNjYvTUkwMDAxMzY2NjA4LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzMyOS9NSTAwMDEzMjk1MjguanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDMvNzEyL01JMDAwMzcxMjYxNy5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMS8zMzYvTUkwMDAxMzM2Nzg0LmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAzLzE0OC9NSTAwMDMxNDg4NzUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzI1MC9NSTAwMDMvNDQ1L01JMDAwMzQ0NTEyOS5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScsXG4gICAgJ2h0dHBzOi8vY3BzLXN0YXRpYy5yb3ZpY29ycC5jb20vMy9KUEdfMjUwL01JMDAwMy8zNzgvTUkwMDAzMzc4NzcyLmpwZz9wYXJ0bmVyPWFsbHJvdmkuY29tJyxcbiAgICAnaHR0cHM6Ly9jcHMtc3RhdGljLnJvdmljb3JwLmNvbS8zL0pQR180MDAvTUkwMDAxLzM5OS9NSTAwMDEzOTkzNDUuanBnP3BhcnRuZXI9YWxscm92aS5jb20nLFxuICAgICdodHRwczovL2Nwcy1zdGF0aWMucm92aWNvcnAuY29tLzMvSlBHXzQwMC9NSTAwMDEvNDAxL01JMDAwMTQwMTU4OC5qcGc/cGFydG5lcj1hbGxyb3ZpLmNvbScgXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW1hZ2VfbGlzdDogaW1hZ2VfbGlzdFxufTtcbiIsIi8qXG5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ2xhc3MobmFtZSxydWxlcyl7XG4gICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICBpZighKHN0eWxlLnNoZWV0fHx7fSkuaW5zZXJ0UnVsZSlcbiAgICAgICAgKHN0eWxlLnN0eWxlU2hlZXQgfHwgc3R5bGUuc2hlZXQpLmFkZFJ1bGUobmFtZSwgcnVsZXMpO1xuICAgIGVsc2VcbiAgICAgICAgc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZShuYW1lK1wie1wiK3J1bGVzK1wifVwiLDApO1xufVxuXG4vKlxuXG4gKi9cbmZvcm1hdCA9IGZ1bmN0aW9uKGZvcm1hdCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uKG1hdGNoLCBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBhcmdzW251bWJlcl0gIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgID8gYXJnc1tudW1iZXJdXG4gICAgICAgICAgICA6IG1hdGNoXG4gICAgICAgICAgICA7XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBnZXRXaWR0aChlbGVtZW50KSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KGVsZW1lbnQuY2xpZW50V2lkdGgsZWxlbWVudC5vZmZzZXRXaWR0aCxlbGVtZW50LnNjcm9sbFdpZHRoKTtcbn1cblxuZnVuY3Rpb24gZ2V0SGVpZ2h0KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoZWxlbWVudC5jbGllbnRIZWlnaHQsZWxlbWVudC5vZmZzZXRIZWlnaHQsZWxlbWVudC5zY3JvbGxIZWlnaHQpO1xufVxuXG52YXIgZ2V0UHJvcGVydHkgPSB7XG4gICAgd2lkdGg6IGdldFdpZHRoLFxuICAgIGhlaWdodDogZ2V0SGVpZ2h0XG59O1xuXG5mdW5jdGlvbiBnZXRQcm9wZXJ0aWVzKGVsZW1lbnQpe1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBnZXRQcm9wZXJ0eS53aWR0aChlbGVtZW50KSxcbiAgICAgICAgaGVpZ2h0OiBnZXRQcm9wZXJ0eS5oZWlnaHQoZWxlbWVudClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZUNsYXNzOiBjcmVhdGVDbGFzcyxcbiAgICBmb3JtYXQ6IGZvcm1hdCxcbiAgICBnZXRQcm9wZXJ0aWVzOiBnZXRQcm9wZXJ0aWVzXG59OyJdfQ==
