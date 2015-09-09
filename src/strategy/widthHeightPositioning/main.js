util = require('../../util');

function currentPolicy(imageElement, element, imageContainer, imgUrl, width, height, imgClass) {
//    console.log('Current Policy ' + width.toString() + 'x' + height.toString() +  ' ' + imgClass);
    return util.format('background-image: url(\'{0}\');', imgUrl);
}

module.exports = {
    policy: currentPolicy
};