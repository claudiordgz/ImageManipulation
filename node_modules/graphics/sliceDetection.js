/*globals module */

/** @function getSlices
 * If we have collisions in two or more quadrants
 * then we have a slicing axis, if there is only
 * one quadrant that has collisions, then there is no
 * slicing axis.
 * @param {FaceBoxCollisionMap} faceBoxCollisionMap
 * @returns {slices}
 */
function getSlices(faceBoxCollisionMap) {
    'use strict';
    var slices = 0;
    var bitNumber = {'TopLeft':0, 'TopRight':1, 'LowerLeft':2, 'LowerRight':3};
    /*jshint -W016*/
    for(var key in faceBoxCollisionMap) {
        if(faceBoxCollisionMap[key] !== undefined) {
            var offset = bitNumber[key];
            offset = 1 << offset;
            slices = slices | offset;
        }
    }
    /*jshint +W016*/
    var slicesMap = {noSlice: false, xSlice: false, ySlice: false };
    if (slices === 15) {
        slicesMap.xSlice = true;
        slicesMap.ySlice = true;
    } else if (slices === 12 || slices === 3) {
        slicesMap.ySlice = true;
    } else if (slices === 5 || slices === 10) {
        slicesMap.xSlice = true;
    } else if(slices === 8 || slices === 4 || slices === 2 || slices === 1) {
        slicesMap.noSlice = true;
    }
    return slicesMap;
}

module.exports = {
    getSlices: getSlices
};