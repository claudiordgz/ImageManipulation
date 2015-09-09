
var get_data = function get_data () {
    var api_url = 'http://lsp.powerathens.com/api/v1/station/now-playing/';
    var ajax_obj = {
        url: api_url,
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
        $.ajax(ajax_obj);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    get_data: get_data
};