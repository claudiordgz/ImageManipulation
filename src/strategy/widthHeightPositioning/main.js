util = require('../../util');

function currentPolicy(imageElement, imageContainer, imgUrl, width, height, imgClass) {
    return util.format('background-image: url(\'{0}\');', imgUrl);
}

module.exports = {
    policy: currentPolicy
};