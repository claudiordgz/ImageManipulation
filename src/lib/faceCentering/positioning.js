/*globals console, module, require*/
var padding = require('./padding');
var graphics = require('graphics');

var switchQuadrantNameToIdentifier = {
    TopLeft: 'A',
    TopRight: 'B',
    LowerRight: 'C',
    LowerLeft: 'D'
};

var propertiesToCss = function(width, height, x, y) {
    'use strict';
    var xString = x !== 'center' ? Math.round(x, 0).toString() + 'px' : x;
    var yString = y !== 'center' ? Math.round(y, 0).toString() + 'px' : y;

    return {
        'background-size': Math.round(width, 0).toString() + 'px ' + Math.round(height, 0).toString() + 'px',
        'background-position': xString + ' ' + yString
    };
};

var getWidthHeightFromAnchor = {
    landscape: {
        TopLeft: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var aspectRatio, newWidth, newHeight, positionXOffset, positionYOffset;
            if(faceBox.targetHeight < (faceBox.sourceHeight - anchorPointAndPadding.y)) {
                aspectRatio = (faceBox.sourceHeight - anchorPointAndPadding.y) / faceBox.targetHeight;
                positionYOffset = anchorPointAndPadding.y === 0 ? 0 : - (anchorPointAndPadding.y / aspectRatio);
            } else {
                aspectRatio = faceBox.sourceHeight / faceBox.targetHeight;
                positionYOffset = 0;
            }
            positionXOffset = 0;
            if(anchorPointAndPadding.x > (faceBox.sourceWidth / 4)) {
                positionXOffset = - (anchorPointAndPadding.x / 2);
            }
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        TopRight: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var aspectRatio, newWidth, newHeight, positionXOffset, positionYOffset;
            if(faceBox.targetHeight < (faceBox.sourceHeight - anchorPointAndPadding.y)) {
                aspectRatio = (faceBox.sourceHeight - anchorPointAndPadding.y) / faceBox.targetHeight;
                positionYOffset = anchorPointAndPadding.y === 0 ? 0 : - (anchorPointAndPadding.y / aspectRatio);
            } else {
                aspectRatio = faceBox.sourceHeight / faceBox.targetHeight;
                positionYOffset = 0;
            }
            positionXOffset = 0;
            if((faceBox.sourceWidth - anchorPointAndPadding.x) > (faceBox.sourceWidth / 4)) {
                positionXOffset = - ((faceBox.sourceWidth - anchorPointAndPadding.x) / 2);
            }
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        LowerLeft: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var aspectRatio, newWidth, newHeight, positionXOffset, positionYOffset;
            if(faceBox.targetHeight < anchorPointAndPadding.y) {
                aspectRatio = anchorPointAndPadding.y / faceBox.targetHeight;
                positionYOffset = (faceBox.sourceHeight - anchorPointAndPadding.y) === 0 ? 0 : - ((faceBox.sourceHeight - anchorPointAndPadding.y) / aspectRatio);
            } else {
                aspectRatio = anchorPointAndPadding.y / faceBox.targetHeight;
                positionYOffset = 0;
            }
            positionXOffset = 0;
            if(anchorPointAndPadding.x > (faceBox.sourceWidth / 4)) {
                positionXOffset = - (anchorPointAndPadding.x / 2);
            }
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        LowerRight: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var aspectRatio, newWidth, newHeight, positionXOffset, positionYOffset;
            if(faceBox.targetHeight < (faceBox.sourceHeight - anchorPointAndPadding.y)) {
                aspectRatio = (faceBox.sourceHeight - anchorPointAndPadding.y) / faceBox.targetHeight;
                positionYOffset = anchorPointAndPadding.y === 0 ? 0 : - (anchorPointAndPadding.y / aspectRatio);
            } else {
                aspectRatio = faceBox.sourceHeight / faceBox.targetHeight;
                positionYOffset = 0;
            }
            positionXOffset = 0;
            if((faceBox.sourceWidth - anchorPointAndPadding.x) > (faceBox.sourceWidth / 4)) {
                positionXOffset = - ((faceBox.sourceWidth - anchorPointAndPadding.x) / 2);
            }
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        CenterTop: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var newWidth, newHeight, positionXOffset;
            var aspectRatio = faceBox.sourceHeight / faceBox.targetHeight;
            var positionYOffset = 0;
            positionXOffset = 'center';
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        CenterLeft: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var newWidth, newHeight, positionXOffset;
            var aspectRatio = faceBox.sourceHeight / faceBox.targetHeight;
            var positionYOffset = 'center';
            positionXOffset = 0;
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        CenterRight: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var newWidth, newHeight, positionXOffset;
            var aspectRatio = faceBox.sourceHeight / faceBox.targetHeight;
            var positionYOffset = 'center';
            positionXOffset = 0;
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        CenterBottom: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var newWidth, newHeight, positionXOffset;
            var aspectRatio = faceBox.sourceHeight / faceBox.targetHeight;
            var positionYOffset = 0;
            positionXOffset = 'center';
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        }
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
        },
        TopRight: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var aspectRatio, newWidth, newHeight, positionXOffset, positionYOffset;
            if(faceBox.targetWidth < anchorPointAndPadding.x) {
                aspectRatio = anchorPointAndPadding.x / faceBox.targetWidth;
                positionYOffset = - (anchorPointAndPadding.y / aspectRatio);
            } else {
                aspectRatio = anchorPointAndPadding.x / faceBox.targetWidth;
                positionYOffset = anchorPointAndPadding.y === 0 ? 0 : - (anchorPointAndPadding.y / aspectRatio);
            }
            positionXOffset = -((faceBox.sourceWidth - anchorPointAndPadding.x) / aspectRatio);
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        LowerLeft: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var aspectRatio, newWidth, newHeight, positionXOffset, positionYOffset;
            if(faceBox.targetWidth < (faceBox.sourceWidth - anchorPointAndPadding.x)) {
                aspectRatio = (faceBox.sourceWidth - anchorPointAndPadding.x) / faceBox.targetWidth;
                positionYOffset = - (faceBox.sourceHeight - anchorPointAndPadding.y / aspectRatio);
            } else {
                aspectRatio = faceBox.sourceWidth / faceBox.targetWidth;
                positionYOffset = (faceBox.sourceHeight - anchorPointAndPadding.y) === 0 ? 0 : - ((faceBox.sourceHeight - anchorPointAndPadding.y) / aspectRatio);
            }
            positionXOffset = 0;
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        LowerRight: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var aspectRatio, newWidth, newHeight, positionXOffset, positionYOffset;
            if(faceBox.targetWidth < anchorPointAndPadding.x) {
                aspectRatio = anchorPointAndPadding.x / faceBox.targetWidth;
                positionYOffset = - ((faceBox.sourceHeight - anchorPointAndPadding.y) / aspectRatio);
            } else {
                aspectRatio = anchorPointAndPadding.x / faceBox.targetWidth;
                positionYOffset = (faceBox.sourceHeight - anchorPointAndPadding.y) === 0 ? 0 : - ((faceBox.sourceHeight - anchorPointAndPadding.y) / aspectRatio);
            }
            positionXOffset = -((faceBox.sourceWidth - anchorPointAndPadding.x) / aspectRatio);
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        CenterTop: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var newWidth, newHeight, positionXOffset;
            var aspectRatio = faceBox.sourceWidth / faceBox.targetWidth;
            var positionYOffset = anchorPointAndPadding.y === 0 ? 0 : - (anchorPointAndPadding.y / aspectRatio);
            positionXOffset = 'center';
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        CenterLeft: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var newWidth, newHeight, positionXOffset;
            var aspectRatio = faceBox.sourceWidth / faceBox.targetWidth;
            var positionYOffset = 'center';
            positionXOffset = 0;
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        CenterRight: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var newWidth, newHeight, positionXOffset;
            var aspectRatio = faceBox.sourceWidth / faceBox.targetWidth;
            var positionYOffset = 'center';
            positionXOffset = 0;
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        },
        CenterBottom: function(anchorPointAndPadding, faceBox) {
            'use strict';
            var newWidth, newHeight, positionXOffset;
            var aspectRatio = faceBox.sourceWidth / faceBox.targetWidth;
            var positionYOffset = (faceBox.sourceHeight - anchorPointAndPadding.y) === 0 ? 0 : - ((faceBox.sourceHeight - anchorPointAndPadding.y) / aspectRatio);
            positionXOffset = 'center';
            newWidth = faceBox.sourceWidth / aspectRatio;
            newHeight = faceBox.sourceHeight / aspectRatio;
            return propertiesToCss(newWidth, newHeight, positionXOffset, positionYOffset);
        }
    }
};

var switchCaseSelection = {
    forceDefaultOrientation: function(orientation) {
        'use strict';
        if(orientation === 'square') {
            return 'landscape';
        }
        return orientation;
    },
    A: function(faceBox) {
        'use strict';
        var newAnchor = padding.calculateAndAddPadding.TopLeft(faceBox.vertices.A, faceBox);
        var orientation = this.forceDefaultOrientation(faceBox.getOrientation());
        newAnchor = getWidthHeightFromAnchor[orientation].TopLeft(newAnchor, faceBox);
        return newAnchor;
    },
    B: function(faceBox){
        'use strict';
        var newAnchor = padding.calculateAndAddPadding.TopRight(faceBox.vertices.B, faceBox);
        var orientation = this.forceDefaultOrientation(faceBox.getOrientation());
        newAnchor = getWidthHeightFromAnchor[orientation].TopRight(newAnchor, faceBox);
        return newAnchor;
    },
    C: function(faceBox){
        'use strict';
        var newAnchor = padding.calculateAndAddPadding.LowerRight(faceBox.vertices.C, faceBox);
        var orientation = this.forceDefaultOrientation(faceBox.getOrientation());
        newAnchor = getWidthHeightFromAnchor[orientation].LowerRight(newAnchor, faceBox);
        return newAnchor;
    },
    D: function(faceBox){
        'use strict';
        var newAnchor = padding.calculateAndAddPadding.LowerRight(faceBox.vertices.D, faceBox);
        var orientation = this.forceDefaultOrientation(faceBox.getOrientation());
        newAnchor = getWidthHeightFromAnchor[orientation].LowerLeft(newAnchor, faceBox);
        return newAnchor;
    },
    /* Top Quadrants Left to Right */
    AB: function(faceBox, faceBoxAnalysis){
        'use strict';
        var newAnchor;
        if(faceBoxAnalysis.TopLeft.percent > 0.75) {
            newAnchor = padding.calculateAndAddPadding.TopLeft(faceBox.vertices.A, faceBox);
        } else {
            var anchorPoint = new graphics.Vertex2D(faceBox.vertices.B.x - faceBox.vertices.A.x, faceBox.vertices.A.y);
            newAnchor = padding.calculateAndAddPadding.CenterTop(anchorPoint, faceBox);
        }
        var orientation = this.forceDefaultOrientation(faceBox.getOrientation());
        newAnchor = getWidthHeightFromAnchor[orientation].CenterTop(newAnchor, faceBox);
        return newAnchor;
    },
    /* Bottom Quadrants Left to Right */
    DC: function(faceBox, faceBoxAnalysis){
        'use strict';
        var newAnchor;
        if(faceBoxAnalysis.LowerLeft.percent > 0.75) {
            newAnchor = padding.calculateAndAddPadding.LowerLeft(faceBox.vertices.D, faceBox);
        } else {
            var anchorPoint = new graphics.Vertex2D(faceBox.vertices.C.x - faceBox.vertices.D.x, faceBox.vertices.D.y);
            newAnchor = padding.calculateAndAddPadding.CenterBottom(anchorPoint, faceBox);
        }
        var orientation = this.forceDefaultOrientation(faceBox.getOrientation());
        newAnchor = getWidthHeightFromAnchor[orientation].CenterBottom(newAnchor, faceBox);
        return newAnchor;
    },
    /* Top Quadrants Right to Left */
    BA: function(faceBox, faceBoxAnalysis){
        'use strict';
        var newAnchor;
        if(faceBoxAnalysis.TopRight.percent > 0.75) {
            newAnchor = padding.calculateAndAddPadding.TopRight(faceBox.vertices.B, faceBox);
        } else {
            var anchorPoint = new graphics.Vertex2D(faceBox.vertices.B.x - faceBox.vertices.A.x, faceBox.vertices.A.y);
            newAnchor = padding.calculateAndAddPadding.CenterTop(anchorPoint, faceBox);
        }
        var orientation = this.forceDefaultOrientation(faceBox.getOrientation());
        newAnchor = getWidthHeightFromAnchor[orientation].CenterTop(newAnchor, faceBox);
        return newAnchor;
    },
    /* Bottom Quadrants Right to Left */
    CD: function(faceBox, faceBoxAnalysis){
        'use strict';
        var newAnchor;
        if(faceBoxAnalysis.LowerRight.percent > 0.75) {
            newAnchor = padding.calculateAndAddPadding.LowerRight(faceBox.vertices.C, faceBox);
        } else {
            var anchorPoint = new graphics.Vertex2D(faceBox.vertices.C.x - faceBox.vertices.D.x, faceBox.vertices.D.y);
            newAnchor = padding.calculateAndAddPadding.CenterBottom(anchorPoint, faceBox);
        }
        var orientation = this.forceDefaultOrientation(faceBox.getOrientation());
        newAnchor = getWidthHeightFromAnchor[orientation].CenterBottom(newAnchor, faceBox);
        return newAnchor;
    },
    /* Left Quadrants Top to Bottom  */
    AD: function(faceBox, faceBoxAnalysis){
        'use strict';
        var newAnchor;
        if(faceBoxAnalysis.LowerRight.percent > 0.75) {
            newAnchor = padding.calculateAndAddPadding.LowerRight(faceBox.vertices.C, faceBox);
        } else {
            var anchorPoint = new graphics.Vertex2D(faceBox.vertices.C.x - faceBox.vertices.D.x, faceBox.vertices.D.y);
            newAnchor = padding.calculateAndAddPadding.CenterBottom(anchorPoint, faceBox);
        }
        var orientation = this.forceDefaultOrientation(faceBox.getOrientation());
        newAnchor = getWidthHeightFromAnchor[orientation].CenterBottom(newAnchor, faceBox);
        return newAnchor;
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
    console.log(Quadrants);
    var style;
    if(priorities.length === 4) {
        style = switchCaseSelection.ALL(faceBox, faceBoxAnalysis, priorities);
    } else {
        style = switchCaseSelection[Quadrants](faceBox, faceBoxAnalysis, priorities);
    }
    console.log(style);
    return style;
}

module.exports = {
    selectAnchorPoint: selectAnchorPoint
};