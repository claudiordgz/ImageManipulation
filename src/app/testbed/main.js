/*globals require, module */
var fromVariable = require('faces/testbed/testbed_variable');
var fromFiles = require('faces/testbed/testbed_loading');

module.exports = {
    fromDirectorySmallSubset: fromFiles.fromDirectorySmallSubset,
    fromDirectory: fromFiles.fromDirectory,
    imageList: fromVariable.imageList
};