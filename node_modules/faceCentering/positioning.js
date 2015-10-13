/*globals console, module, require*/
var padding = require('./padding');

var switchQuadrantNameToIdentifier = {
    TopLeft: 'A',
    TopRight: 'B',
    LowerRight: 'C',
    LowerLeft: 'D'
};

var propertiesToCss = function(width, height, x, y) {
    'use strict';
    return {
        'background-size': Math.round(width, 0).toString() + 'px ' + Math.round(height, 0).toString() + 'px',
        'background-position': Math.round(x, 0).toString() + 'px ' + Math.round(y, 0).toString() + 'px'
    };
};

var getWidthHeightFromAnchor = {
    landscape: function(anchorPointAndPadding, faceBox)  {

    },
    portrait: {
        TopLeft: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var aspectRatio, newWidth, newHeight, positionXOffset, positionYOffset;
            if(faceBox.targetWidth < (faceBox.sourceWidth - anchorPointAndPadding.x)) {
                aspectRatio = (faceBox.sourceWidth - anchorPointAndPadding.x) / faceBox.targetWidth;
                positionYOffset = - (anchorPointAndPadding.y / aspectRatio);
            } else {
                aspectRatio = faceBox.sourceWidth / faceBox.targetWidth;
                positionYOffset = anchorPointAndPadding.y === 0 ? 0 : - (anchorPointAndPadding.y / aspectRatio);
            }
            positionXOffset = 0;
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        }
    },
    square: function(anchorPointAndPadding, faceBox) {

    }
};



var switchCaseSelection = {
    A: function(faceBox) {
        'use strict';
        var newAnchor = padding.calculateAndAddPadding.TopLeft(faceBox.vertices.A, faceBox);
        newAnchor = getWidthHeightFromAnchor[faceBox.getOrientation()].TopLeft(newAnchor, faceBox);
        console.log(newAnchor);
        return newAnchor;
    },
    B: function(faceBox, faceBoxAnalysis){
        'use strict';
        var newAnchor = padding.calculateAndAddPadding.TopRight(faceBox.vertices.B, faceBox);
        newAnchor = getWidthHeightFromAnchor[faceBox.getOrientation()].TopRight(newAnchor, faceBox);
        return newAnchor;
    },
    C: function(faceBox, faceBoxAnalysis){
        'use strict';

    },
    D: function(faceBox, faceBoxAnalysis){
        'use strict';

    },
    /* Top Quadrants Left to Right */
    AB: function(faceBox, faceBoxAnalysis){
        'use strict';

    },
    /* Bottom Quadrants Left to Right */
    DC: function(faceBox, faceBoxAnalysis){
        'use strict';

    },
    /* Top Quadrants Right to Left */
    BA: function(faceBox, faceBoxAnalysis){
        'use strict';

    },
    /* Bottom Quadrants Right to Left */
    CD: function(faceBox, faceBoxAnalysis){
        'use strict';

    },
    /* Left Quadrants Top to Bottom  */
    AD: function(faceBox, faceBoxAnalysis){
        'use strict';

    },
    /* Right Quadrants Top to Bottom  */
    BC: function(faceBox, faceBoxAnalysis){
        'use strict';

    },
    /* Left Quadrants Bottom to Top  */
    DA: function(faceBox, faceBoxAnalysis){
        'use strict';

    },
    /* Right Quadrants Bottom to Top */
    CB: function(faceBox, faceBoxAnalysis){
        'use strict';

    },
    /* Face Box collides with all the Quadrants */
    ALL: function(faceBox, faceBoxAnalysis, priorities){
        'use strict';

    }
};


function selectAnchorPoint(faceBox, faceBoxAnalysis) {
    'use strict';
    var priorities = Object.keys(faceBoxAnalysis).map(function(key) {
        return [key, faceBoxAnalysis[key].percent];
    });
    priorities.sort(function(first, second) {
        return second[1] - first[1];
    });
    var Quadrants = '';
    priorities.map(function(key){
        Quadrants += switchQuadrantNameToIdentifier[key[0]];
    });
    console.log(priorities);
    var style;
    if(priorities.length === 4) {
        style = switchCaseSelection.ALL(faceBox, faceBoxAnalysis, priorities);
    } else {
        style = switchCaseSelection[Quadrants](faceBox, faceBoxAnalysis, priorities);
    }
    return style;
}

module.exports = {
    selectAnchorPoint: selectAnchorPoint
};