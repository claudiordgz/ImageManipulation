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