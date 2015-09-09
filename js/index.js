(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./util":2}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLy8gY21fbW9iSGVhZGVyX2FydGlzdF9vdmVybGF5IC0gVGhlIGZ1bGwgaGVhZGVyIGJhY2tncm91bmQgZGl2XG4vLyBjbV9tb2JIZWFkZXJfYXJ0aXN0X2ltYWdlIC0gVGhlIGNpcmNsZSBkaXYgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGltYWdlXG4vLyBjbV9tb2JIZWFkZXJfYXJ0aXN0LW92ZXJsYXktLXN0eWxlIC0gV2Ugd2lsbCBwdXQgZXZlcnl0aGluZyByZWxhdGVkIHRvIHRoZSBiYWNrZ3JvdW5kIG9mIGFydGlzdF9vdmVybGF5IGluIGhlcmVcbi8vIGNtX21vYkhlYWRlcl9hcnRpc3QtaW1hZ2UtLXN0eWxlIC0gV2Ugd2lsbCBwdXQgZXZlcnl0aGluZyByZWxhdGVkIHRvIGJhY2tncm91bmQgb2YgYXJ0aXN0X2ltYWdlIGluIGhlcmVcbmZ1bmN0aW9uIGRlZmF1bHRQb2xpY3koaW5kZXgsIGVsZW1lbnQsIGltZ1VybCwgcG9saWN5KSB7XG4gICAgdmFyIG92YWxCYWNrZ3JvdW5kQ2xhc3NOYW1lID0gdXRpbC5mb3JtYXQoJ2NtX21vYkhlYWRlcl9hcnRpc3QtaW1hZ2UtLXN0eWxlLXswfScsIGluZGV4KTtcbiAgICB2YXIgb3ZlcmxheUNsYXNzTmFtZSA9IHV0aWwuZm9ybWF0KCdjbV9tb2JIZWFkZXJfYXJ0aXN0LW92ZXJsYXktLXN0eWxlLXswfScsIGluZGV4KTtcblxuICAgIHZhciBvdmVybGF5QmFja2dyb3VuZCA9IHV0aWwuZm9ybWF0KCdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFwnezB9XFwnKTsgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7JywgaW1nVXJsKTtcbiAgICB1dGlsLmNyZWF0ZUNsYXNzKCcuJyArIG92ZXJsYXlDbGFzc05hbWUsIG92ZXJsYXlCYWNrZ3JvdW5kKTtcblxuICAgIHZhciBvdmVybGF5SW1nID0gbmV3IEltYWdlKCk7XG4gICAgb3ZlcmxheUltZy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICBvdmVybGF5SW1nLm92ZXJsYXlDbGFzc05hbWUgPSBvdmVybGF5Q2xhc3NOYW1lO1xuICAgIG92ZXJsYXlJbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcuY21fbW9iSGVhZGVyX2FydGlzdF9vdmVybGF5JykuYWRkQ2xhc3ModGhpcy5vdmVybGF5Q2xhc3NOYW1lKTtcbiAgICB9O1xuICAgIG92ZXJsYXlJbWcuc3JjID0gaW1nVXJsO1xuXG4gICAgdmFyIG92YWxJbWcgPSBuZXcgSW1hZ2UoKTtcblxuICAgIG92YWxJbWcuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgb3ZhbEltZy5jbGFzc05hbWUgPSBvdmFsQmFja2dyb3VuZENsYXNzTmFtZTtcbiAgICBvdmFsSW1nLmltYWdlU3JjID0gaW1nVXJsO1xuICAgIG92YWxJbWcucG9saWN5ID0gcG9saWN5O1xuICAgIG92YWxJbWcuc2VsZiA9IG92YWxJbWc7XG4gICAgb3ZhbEltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5wb2xpY3kpIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmNtX21vYkhlYWRlcl9hcnRpc3RfaW1hZ2UnKTtcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IHRoaXMucG9saWN5KHRoaXMuc2VsZiwgdGhpcy5lbGVtZW50LCBjb250YWluZXIsIHRoaXMuaW1hZ2VTcmMsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLmNsYXNzTmFtZSk7XG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0eWxlKTtcbiAgICAgICAgICAgIHV0aWwuY3JlYXRlQ2xhc3MoJy4nICsgdGhpcy5jbGFzc05hbWUsIHN0eWxlKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLmNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIG92YWxJbWcuc3JjID0gaW1nVXJsO1xufVxuXG5mdW5jdGlvbiBjdXJyZW50UG9saWN5KGltYWdlRWxlbWVudCwgZWxlbWVudCwgaW1hZ2VDb250YWluZXIsIGltZ1VybCwgd2lkdGgsIGhlaWdodCwgaW1nQ2xhc3MpIHtcbi8vICAgIGNvbnNvbGUubG9nKCdDdXJyZW50IFBvbGljeSAnICsgd2lkdGgudG9TdHJpbmcoKSArICd4JyArIGhlaWdodC50b1N0cmluZygpICsgICcgJyArIGltZ0NsYXNzKTtcbiAgICByZXR1cm4gdXRpbC5mb3JtYXQoJ2JhY2tncm91bmQtaW1hZ2U6IHVybChcXCd7MH1cXCcpOycsIGltZ1VybCk7XG59XG5cblxuZnVuY3Rpb24gdHJhY2tpbmdKc1BvbGljeShpbWFnZUVsZW1lbnQsIGVsZW1lbnQsIGltYWdlQ29udGFpbmVyLCBpbWdVcmwsICB3aWR0aCwgaGVpZ2h0LCBpbWdDbGFzcykge1xuICAgIGNvbnNvbGUubG9nKCdUcmFja2luZyBKUyBQb2xpY3kgJyArIHdpZHRoLnRvU3RyaW5nKCkgKyAneCcgKyBoZWlnaHQudG9TdHJpbmcoKSArICAnICcgKyBpbWdDbGFzcyk7XG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXG4gICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlRWxlbWVudCwwLDApO1xuICAgIHJldHVybiB1dGlsLmZvcm1hdCgnYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcJ3swfVxcJyk7IGJhY2tncm91bmQtc2l6ZTogMTAwJSBhdXRvOycsIGNhbnZhcy50b0RhdGFVUkwoKSk7XG59XG5cbmZ1bmN0aW9uIHRyYWNraW5nSnNGcm9tSW1hZ2UoaW1hZ2VFbGVtZW50LCBlbGVtZW50LCBpbWFnZUNvbnRhaW5lciwgaW1nVXJsLCAgd2lkdGgsIGhlaWdodCwgaW1nQ2xhc3MpIHtcbi8vICAgIGNvbnNvbGUubG9nKCdJbWFnZSBhcyBCYWNrZ3JvdW5kIFBvbGljeSAnICsgd2lkdGgudG9TdHJpbmcoKSArICd4JyArIGhlaWdodC50b1N0cmluZygpICsgICcgJyArIGltZ0NsYXNzICk7XG4gICAgdmFyIGNvbnRhaW5lckhlaWdodCA9IE1hdGgubWF4KGltYWdlQ29udGFpbmVyWzBdLmNsaWVudEhlaWdodCxpbWFnZUNvbnRhaW5lclswXS5vZmZzZXRIZWlnaHQsIGltYWdlQ29udGFpbmVyWzBdLnNjcm9sbEhlaWdodCk7XG4gICAgdmFyIGNvbnRhaW5lcldpZHRoID0gTWF0aC5tYXgoaW1hZ2VDb250YWluZXJbMF0uY2xpZW50V2lkdGgsaW1hZ2VDb250YWluZXJbMF0ub2Zmc2V0V2lkdGgsIGltYWdlQ29udGFpbmVyWzBdLnNjcm9sbFdpZHRoKTtcbiAgICB2YXIgdHJhY2tlciA9IG5ldyB0cmFja2luZy5PYmplY3RUcmFja2VyKFsnZmFjZSddKTtcbiAgICB0cmFja2VyLnNvdXJjZUVsZW1lbnQgPSB7XG4gICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICAgIGltYWdlRWxlbWVudDogaW1hZ2VFbGVtZW50LFxuICAgICAgICBpbWdDbGFzczogaW1nQ2xhc3NcbiAgICB9O1xuICAgIHRyYWNrZXIuc2V0U3RlcFNpemUoMS43KTtcbiAgICB0cmFja2luZy50cmFjayhpbWFnZUVsZW1lbnQsIHRyYWNrZXIpO1xuICAgIHRyYWNrZXIub24oJ3RyYWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc291cmNlRWxlbWVudCA9IHRoaXMuc291cmNlRWxlbWVudDtcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZWxlbWVudHMgZm91bmQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50LmRhdGEuZm9yRWFjaChmdW5jdGlvbihyZWN0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQuc291cmNlRWxlbWVudC5pbWdDbGFzcyk7XG4gICAgICAgICAgICAgICAgd2luZG93LnBsb3QoZXZlbnQuc291cmNlRWxlbWVudC5pbWFnZUVsZW1lbnQsICcuJyArIGV2ZW50LnNvdXJjZUVsZW1lbnQuaW1nQ2xhc3MsXG4gICAgICAgICAgICAgICAgICAgIHJlY3QueCwgcmVjdC55LCByZWN0LndpZHRoLCByZWN0LmhlaWdodCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1dGlsLmZvcm1hdCgnYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcJ3swfVxcJyk7JywgaW1nVXJsKTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kRWxlbWVudChpbmRleCwgaW1hZ2VVcmwsIHJvdywgZWxlbWVudCwgcG9saWN5LCBzdWJQb2xpY3kpIHtcbiAgICB2YXIgY2FyZCA9IGVsZW1lbnQoe1xuICAgICAgICAnc29uZ05hbWUnOiAnU29uZyBOYW1lJyxcbiAgICAgICAgJ2FydGlzdE5hbWUnOiAnQXJ0aXN0IE5hbWUnXG4gICAgfSk7XG4gICAgcG9saWN5KGluZGV4LCBjYXJkLCBpbWFnZVVybCwgc3ViUG9saWN5KTtcbiAgICAkKHJvdykuYXBwZW5kKGNhcmQpO1xufVxuXG5mdW5jdGlvbiBmcm9tRmlsZSgpIHtcbiAgICB2YXIgaXRlbXMgPSBudWxsO1xuICAgICQuYWpheFNldHVwKHthc3luYzogZmFsc2V9KTtcbiAgICAkLmdldChcImpzL2Fzc2V0cy9pbWFnZXMudHh0XCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaXRlbXMgPSBkYXRhLnNwbGl0KCdcXG4nKTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlbXM7XG59XG5cbmZ1bmN0aW9uIHJldHJpZXZlRnJvbUZpbGUoZmlsZU5hbWUpe1xuICAgIHZhciBpdGVtcyA9IG51bGw7XG4gICAgJC5hamF4U2V0dXAoe2FzeW5jOiBmYWxzZX0pO1xuICAgIHZhciBwYXRoQW5kRmlsZU5hbWUgPSB1dGlsLmZvcm1hdChcImpzL2Fzc2V0cy97MH1cIiwgZmlsZU5hbWUpO1xuICAgICQuZ2V0KHBhdGhBbmRGaWxlTmFtZSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBpdGVtcyA9IGRhdGEuc3BsaXQoJ1xcbicpO1xuICAgIH0pO1xuICAgIHJldHVybiBpdGVtcztcbn1cblxuZnVuY3Rpb24gZnJvbURpcmVjdG9yeVNtYWxsU3Vic2V0KCkge1xuICAgIHJldHVybiByZXRyaWV2ZUZyb21GaWxlKCdzbWFsbF9pbWFnZV90ZXN0YmVkLnR4dCcpO1xufVxuXG5mdW5jdGlvbiBmcm9tRGlyZWN0b3J5KCkge1xuICAgIHJldHVybiByZXRyaWV2ZUZyb21GaWxlKCdsaXN0LnR4dCcpO1xufVxuXG5mdW5jdGlvbiBjb21wbGV0ZUFzc2V0V2l0aFBhdGgoaW1hZ2VzKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSAhPT0gaW1hZ2VzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGltYWdlc1tpXSA9ICcuLi90cmFja2luZ2pzLXBsYXlncm91bmQvanMvYXNzZXRzL2ltZy8nICsgaW1hZ2VzW2ldO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgICB2YXIgaXRlbXMgPSBmcm9tRGlyZWN0b3J5U21hbGxTdWJzZXQoKTtcbiAgICBjb21wbGV0ZUFzc2V0V2l0aFBhdGgoaXRlbXMpO1xuXG4gICAgZm9yKGkgPSAwOyBpICE9PSBpdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgcm93ID0gaWNoLmVsUm93KCk7XG4gICAgICAgIHZhciBpbmRleFN0cmluZyA9IGkudG9TdHJpbmcoKTtcbiAgICAgICAgYXBwZW5kRWxlbWVudChpbmRleFN0cmluZysnLWEnLCBpdGVtc1tpXSwgcm93LCBpY2guZWxlbWVudCwgZGVmYXVsdFBvbGljeSwgdHJhY2tpbmdKc0Zyb21JbWFnZSk7XG4gICAgICAgIGFwcGVuZEVsZW1lbnQoaW5kZXhTdHJpbmcrJy1iJywgaXRlbXNbaV0sIHJvdywgaWNoLmVsZW1lbnQsIGRlZmF1bHRQb2xpY3ksIGN1cnJlbnRQb2xpY3kpO1xuICAgICAgICBhcHBlbmRFbGVtZW50KGluZGV4U3RyaW5nKyctYycsIGl0ZW1zW2ldLCByb3csIGljaC5lbGVtZW50LCBkZWZhdWx0UG9saWN5LCBjdXJyZW50UG9saWN5KTtcbiAgICAgICAgJChcIi5tYXNzXCIpLmFwcGVuZChyb3cpO1xuICAgIH1cbn1cblxud2luZG93LnBsb3QgPSBmdW5jdGlvbihpbWFnZUVsZW1lbnQsIGNsYXNzTmFtZSwgeCwgeSwgdywgaCkge1xuICAgIHZhciByZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihjbGFzc05hbWUpLmFwcGVuZENoaWxkKHJlY3QpO1xuICAgIHJlY3QuY2xhc3NMaXN0LmFkZCgncmVjdCcpO1xuICAgIHJlY3Quc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcbiAgICByZWN0LnN0eWxlLmhlaWdodCA9IGggKyAncHgnO1xuICAgIGNvbnNvbGUubG9nKGltYWdlRWxlbWVudC5vZmZzZXRMZWZ0ICsgJyAnICsgaW1hZ2VFbGVtZW50Lm9mZnNldFRvcCk7XG4gICAgcmVjdC5zdHlsZS5sZWZ0ID0gKGltYWdlRWxlbWVudC5vZmZzZXRMZWZ0ICsgeCkgKyAncHgnO1xuICAgIHJlY3Quc3R5bGUudG9wID0gKGltYWdlRWxlbWVudC5vZmZzZXRUb3AgKyB5KSArICdweCc7XG59O1xuXG4kKGRvY3VtZW50KS5vbmUoJ3JlYWR5JywgZnVuY3Rpb24oKSB7XG4gICAgbWFpbigpO1xufSk7IiwiLypcblxuICovXG5mdW5jdGlvbiBjcmVhdGVDbGFzcyhuYW1lLHJ1bGVzKXtcbiAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIGlmKCEoc3R5bGUuc2hlZXR8fHt9KS5pbnNlcnRSdWxlKVxuICAgICAgICAoc3R5bGUuc3R5bGVTaGVldCB8fCBzdHlsZS5zaGVldCkuYWRkUnVsZShuYW1lLCBydWxlcyk7XG4gICAgZWxzZVxuICAgICAgICBzdHlsZS5zaGVldC5pbnNlcnRSdWxlKG5hbWUrXCJ7XCIrcnVsZXMrXCJ9XCIsMCk7XG59XG5cbi8qXG5cbiAqL1xuZm9ybWF0ID0gZnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgveyhcXGQrKX0vZywgZnVuY3Rpb24obWF0Y2gsIG51bWJlcikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgPyBhcmdzW251bWJlcl1cbiAgICAgICAgICAgIDogbWF0Y2hcbiAgICAgICAgICAgIDtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZUNsYXNzOiBjcmVhdGVDbGFzcyxcbiAgICBmb3JtYXQ6IGZvcm1hdFxufTsiXX0=
