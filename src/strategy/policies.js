/**
 * Created by crodriguez2 on 9/9/15.
 */
imageRecognition = require('./imageRecognition/main');
widthHeightPositioning = require('./widthHeightPositioning/main');

module.exports = {
    trackingJs: imageRecognition.policy,
    widthHeightPositioning: widthHeightPositioning.policy
};