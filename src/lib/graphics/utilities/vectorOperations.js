/*globals require, module*/
var Victor = require('victor');

/**
 * @typedef Point
 * @type Object
 * @property {number} x The X Coordinate
 * @property {number} y The Y Coordinate
 */

/** @function getVector
 * Utility to retrieve a vector between two points in a XY space
 * @param {Point} coordinatesA Origin location
 * @param {Point} coordinatesB End point location
 * @return {Victor} A vector from Victor Library
 */
function getVector(coordinatesA, coordinatesB) {
    'use strict';
    return new Victor(coordinatesB.x - coordinatesA.x, coordinatesB.y - coordinatesA.y);
}

module.exports = {
    getVector: getVector
};