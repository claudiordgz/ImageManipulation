/*  The test bed
    Images were pulled from several sites
 */
var image_list = [
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/848/MI0003848198.jpg?partner=allrovi.com',
    'https://a248.e.akamai.net/f/1726/3609/1m/media.cmgdigital.com/shared/img/photos/2014/06/20/ad/bb/Jeanne_Headshot_2.jpg',
    'https://a248.e.akamai.net/f/1726/3609/1m/media.cmgdigital.com/shared/lt/lt_cache/thumbnail/292/img/staff/2014/386998_512092287718_750833973_n.jpg',
    'https://a248.e.akamai.net/f/1726/3609/1m/media.cmgdigital.com/shared/lt/lt_cache/thumbnail/908/img/photos/2011/08/01/mookie.jpg',
    'https://s-media-cache-ak0.pinimg.com/236x/88/e3/4c/88e34c17bf76c1d5178b0ce08d9934e6.jpg',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/361/MI0003361490.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/497/MI0003497930.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/627/MI0003627097.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/418/MI0001418164.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/495/MI0003495398.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/277/MI0003277352.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/405/MI0001405664.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/590/MI0003590626.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/877/MI0003877513.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/388/MI0003388458.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/348/MI0003348271.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/358/MI0003358377.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/594/MI0003594278.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/090/MI0003090459.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/484/MI0003484215.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/877/MI0003877705.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/798/MI0003798761.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/397/MI0001397350.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/627/MI0003627193.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/404/MI0001404843.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/436/MI0003436833.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/347/MI0003347847.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/360/MI0003360551.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/413/MI0001413988.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/842/MI0003842964.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/327/MI0001327893.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/770/MI0003770022.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/840/MI0003840529.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/584/MI0003584762.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/795/MI0003795325.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/803/MI0003803855.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/840/MI0003840374.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/832/MI0003832775.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/802/MI0003802021.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/795/MI0003795324.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/535/MI0003535164.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/854/MI0003854385.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/795/MI0003795321.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/840/MI0003840183.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/867/MI0003867863.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/903/MI0003903748.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/869/MI0003869675.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/814/MI0003814405.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/273/MI0003273649.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/837/MI0003837167.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/045/MI0003045399.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/433/MI0003433721.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/709/MI0003709783.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/592/MI0003592855.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/859/MI0003859455.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/182/MI0003182022.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/832/MI0003832974.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/779/MI0003779361.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/848/MI0003848198.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/328/MI0001328037.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/888/MI0003888856.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/399/MI0001399175.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/327/MI0001327874.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/345/MI0001345160.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/481/MI0003481272.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/874/MI0003874107.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/752/MI0003752413.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/436/MI0003436909.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/395/MI0001395010.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/849/MI0003849319.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/421/MI0003421888.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/874/MI0003874501.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/364/MI0001364912.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/709/MI0003709999.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/465/MI0001465413.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/406/MI0001406460.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/720/MI0003720987.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/326/MI0001326338.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/888/MI0003888881.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/879/MI0003879160.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/879/MI0003879885.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/325/MI0001325433.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/364/MI0003364458.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/879/MI0003879671.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/571/MI0003571143.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/828/MI0003828479.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/891/MI0003891169.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/402/MI0001402140.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/641/MI0003641474.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/351/MI0003351373.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/276/MI0003276341.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/689/MI0003689189.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/835/MI0003835479.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/401/MI0001401684.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0002/749/MI0002749679.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/590/MI0003590035.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/892/MI0003892823.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/594/MI0003594464.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/732/MI0003732467.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/329/MI0001329620.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/405/MI0001405078.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/366/MI0001366608.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/329/MI0001329528.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/712/MI0003712617.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0001/336/MI0001336784.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0003/148/MI0003148875.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/445/MI0003445129.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_250/MI0003/378/MI0003378772.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/399/MI0001399345.jpg?partner=allrovi.com',
    'https://cps-static.rovicorp.com/3/JPG_400/MI0001/401/MI0001401588.jpg?partner=allrovi.com' ];


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

if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

// cm_mobHeader_artist_overlay - The full header background div
// cm_mobHeader_artist_image - The circle div that will contain the image
// cm_mobHeader_artist-overlay--style - We will put everything related to the background of artist_overlay in here
// cm_mobHeader_artist-image--style - We will put everything related to background of artist_image in here
function defaultPolicy(index, element, imgUrl, policy) {
    var ovalBackgroundClassName = String.format('cm_mobHeader_artist-image--style-{0}', index);
    var overlayClassName = String.format('cm_mobHeader_artist-overlay--style-{0}', index);

    var overlayBackground = String.format('background-image: url(\'{0}\'); background-color: transparent;', imgUrl);
    createClass('.' + overlayClassName, overlayBackground);

    var overlayImg = new Image();
    overlayImg.element = element;
    overlayImg.overlayClassName = overlayClassName;
    overlayImg.onload = function() {
        this.element.find('.cm_mobHeader_artist_overlay').addClass(this.overlayClassName);
    };
    overlayImg.src = imgUrl;

    var ovalImg = new Image();

    ovalImg.element = element;
    ovalImg.className = ovalBackgroundClassName;
    ovalImg.imageSrc = imgUrl;
    ovalImg.policy = policy;
    ovalImg.onload = function() {
        if(this.policy) {
            var style = this.policy(this, this.element, this.imageSrc, this.width, this.height, this.className);
//            console.log(style);
            createClass('.' + this.className, style);
            this.element.find('.cm_mobHeader_artist_image').addClass(this.className);
        }
    };
    ovalImg.src = imgUrl;
}

function currentPolicy(imageElement, element, imgUrl, width, height, imgClass) {
//    console.log('Current Policy ' + width.toString() + 'x' + height.toString() +  ' ' + imgClass);
    return String.format('background-image: url(\'{0}\');', imgUrl);
}


function trackingJsPolicy(imageElement, element, imgUrl,  width, height, imgClass) {
    console.log('Tracking JS Policy ' + width.toString() + 'x' + height.toString() +  ' ' + imgClass);
    var canvas = document.createElement('canvas');

    var context = canvas.getContext('2d');

    context.drawImage(imageElement,0,0);
    return String.format('background-image: url(\'{0}\'); background-size: 100% auto;', canvas.toDataURL());
}

function trackingJsFromImage(imageElement, element, imgUrl,  width, height, imgClass) {
//    console.log('Image as Background Policy ' + width.toString() + 'x' + height.toString() +  ' ' + imgClass );
    var tracker = new tracking.ObjectTracker(['face']);
    tracker.sourceElement = {
        width: width,
        height: height
    };
    tracker.setStepSize(1.7);
    tracking.track(imageElement, tracker);
    tracker.on('track', function(event) {
        if (event.data.length === 0) {
            console.log('No elements found');
        } else {
            event.data.forEach(function(data) {
                console.log(data);
            });
        }
    });
    return String.format('background-image: url(\'{0}\');', imgUrl);
}

function appendElement(index, imageUrl, row, element, policy, subPolicy) {
    var card = element({
        'songName': 'Song Name',
        'artistName': 'Artist Name'
    });
    policy(index, card, imageUrl, subPolicy);
    $(row).append(card);
}

function fromFile() {
    var items = null;
    $.ajaxSetup({async: false});
    $.get("js/assets/images.txt", function(data) {
        items = data.split('\n');
    });
    return items;
}

function retrieveFromFile(fileName){
    var items = null;
    $.ajaxSetup({async: false});
    $.get(String.format("js/assets/{0}", fileName), function(data) {
        items = data.split('\n');
    });
    return items;
}

function fromDirectorySmallSubset() {
    return retrieveFromFile('small_image_testbed.txt');
}

function fromDirectory() {
    return retrieveFromFile('list.txt');
}

function completeAssetWithPath(images) {
    for(var i = 0; i !== images.length; ++i) {
        images[i] = '../trackingjs-playground/js/assets/img/' + images[i];
    }
}

function main() {
    var items = fromDirectorySmallSubset();
    completeAssetWithPath(items);

    for(i = 0; i !== items.length; ++i) {
        var row = ich.elRow();
        var indexString = i.toString();
        appendElement(indexString+'-a', items[i], row, ich.element, defaultPolicy, trackingJsFromImage);
        appendElement(indexString+'-b', items[i], row, ich.element, defaultPolicy, currentPolicy);
        appendElement(indexString+'-c', items[i], row, ich.element, defaultPolicy, currentPolicy);
        $(".mass").append(row);
    }
}

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

$(document).one('ready', function() {
    main();
});