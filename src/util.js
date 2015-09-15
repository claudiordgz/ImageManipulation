/*

 */
function createClass(name,rules){
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if(!(style.sheet||{}).insertRule)
        (style.styleSheet || style.sheet).addRule(name, rules);
    else
        style.sheet.insertRule(name+"{"+rules+"}",0);
}

/*

 */
format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};

function getWidth(element) {
    return Math.max(element.clientWidth,element.offsetWidth,element.scrollWidth);
}

function getHeight(element) {
    return Math.max(element.clientHeight,element.offsetHeight,element.scrollHeight);
}

var getProperty = {
    width: getWidth,
    height: getHeight
};

function getProperties(element){
    return {
        width: getProperty.width(element),
        height: getProperty.height(element)
    }
}

module.exports = {
    createClass: createClass,
    format: format,
    getProperties: getProperties
};