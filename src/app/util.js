/*globals module*/
/*

 */
function createClass(name,rules){
    'use strict';
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if(!(style.sheet||{}).insertRule) {
        (style.styleSheet || style.sheet).addRule(name, rules);
    }
    else {
        style.sheet.insertRule(name + "{" + rules + "}", 0);
    }
}

/*

 */
var format = function(format) {
    'use strict';
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};

function getWidth(element) {
    'use strict';
    return Math.max(element.clientWidth,element.offsetWidth,element.scrollWidth);
}

function getHeight(element) {
    'use strict';
    return Math.max(element.clientHeight,element.offsetHeight,element.scrollHeight);
}

var getProperty = {
    width: getWidth,
    height: getHeight
};

function getProperties(element){
    'use strict';
    return {
        width: getProperty.width(element),
        height: getProperty.height(element)
    };
}

module.exports = {
    createClass: createClass,
    format: format,
    getProperties: getProperties
};