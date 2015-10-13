/*globals module, $, console*/
var getData = function () {
    'use strict';
    var apiUrl = 'http://lsp.powerathens.com/api/v1/station/now-playing/';
    var ajaxObj = {
        url: apiUrl,
        data: {
            callback: 'cmg.radioheader.lsploop_callbacks.callback0'
        },
        success: function() {
            console.log('success');
        },
        method: 'GET',
        error: function () {
            console.log('Error polling LSP API:', arguments);
        }
    };
    try {
        $.ajax(ajaxObj);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    getData: getData
};