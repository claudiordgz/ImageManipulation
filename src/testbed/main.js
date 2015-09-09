fromVariable = require('./testbed_variable');
fromFiles = require('./testbed_loading');

module.exports = {
    fromDirectorySmallSubset: fromFiles.fromDirectorySmallSubset,
    fromDirectory: fromFiles.fromDirectory,
    image_list: fromVariable.image_list
};