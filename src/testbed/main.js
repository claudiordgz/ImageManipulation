/*globals require, module */
var fromVariable = require('./testbed_variable');
var fromFiles = require('./testbed_loading');

module.exports = {
    fromDirectorySmallSubset: fromFiles.fromDirectorySmallSubset,
    fromDirectory: fromFiles.fromDirectory,
    imageList: fromVariable.imageList
};