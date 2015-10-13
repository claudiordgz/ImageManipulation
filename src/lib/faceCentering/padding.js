/*globals require, console, module*/

var calculateAndAddPadding = {
    PADDING_TOP_BOTTOM_PERCENT: 0.30,
    PADDING_LEFT_RIGHT_PERCENT: 0.15,
    applyPaddingCorner: function(anchorVertex, faceBox, boundaryX, boundaryY, operationX, operationY) {
        'use strict';
        var faceBoxTopOrBottomPadding = faceBox.height * this.PADDING_TOP_BOTTOM_PERCENT,
            faceBoxLeftOrRightPadding = faceBox.width * this.PADDING_LEFT_RIGHT_PERCENT;
        faceBoxLeftOrRightPadding = boundaryX(faceBoxLeftOrRightPadding, anchorVertex.x, faceBox.sourceWidth) ? anchorVertex.x : faceBoxLeftOrRightPadding;
        faceBoxTopOrBottomPadding = boundaryY(faceBoxTopOrBottomPadding, anchorVertex.y, faceBox.sourceHeight)? anchorVertex.y : faceBoxTopOrBottomPadding;
        return {
            x: operationX(anchorVertex.x, faceBoxLeftOrRightPadding),
            y: operationY(anchorVertex.y, faceBoxTopOrBottomPadding),
            xPadding: faceBoxLeftOrRightPadding,
            yPadding: faceBoxTopOrBottomPadding
        };
    },
    applyPaddingCenterOfEdge: {
        PADDING_TOP_BOTTOM_PERCENT: 0.30,
        PADDING_LEFT_RIGHT_PERCENT: 0.15,
        TopBottom: function(anchorVertex, faceBox, boundaryY, operationY) {
            'use strict';
            var faceBoxTopOrBottomPadding = faceBox.height * this.PADDING_TOP_BOTTOM_PERCENT;
            faceBoxTopOrBottomPadding = boundaryY(faceBoxTopOrBottomPadding, anchorVertex.y, faceBox.sourceHeight) ? anchorVertex.y : faceBoxTopOrBottomPadding;
            return {
                x: anchorVertex.x,
                y: operationY(anchorVertex.y, faceBoxTopOrBottomPadding),
                xPadding: 0,
                yPadding: faceBoxTopOrBottomPadding
            };
        },
        LeftRight: function(anchorVertex, faceBox, boundaryX, operationX) {
            'use strict';
            var faceBoxLeftOrRightPadding = faceBox.width * this.PADDING_LEFT_RIGHT_PERCENT;
            faceBoxLeftOrRightPadding = boundaryX(faceBoxLeftOrRightPadding, anchorVertex.x, faceBox.sourceWidth) ? anchorVertex.x : faceBoxLeftOrRightPadding;
            return {
                x: operationX(anchorVertex.x, faceBoxLeftOrRightPadding),
                y: anchorVertex.y,
                xPadding: faceBoxLeftOrRightPadding,
                yPadding: 0
            };
        }
    },
    CenterTop: function(anchorVertex, faceBox) {
        'use strict';
        return this.applyPaddingCenterOfEdge.TopBottom(anchorVertex, faceBox, this.boundaryYTop, this.minus);
    },
    CenterLeft: function(anchorVertex, faceBox) {
        'use strict';
        return this.applyPaddingCenterOfEdge.LeftRight(anchorVertex, faceBox, this.boundaryXLeft, this.minus);
    },
    CenterBottom: function(anchorVertex, faceBox) {
        'use strict';
        return this.applyPaddingCenterOfEdge.TopBottom(anchorVertex, faceBox, this.boundaryYBottom, this.add);
    },
    CenterRight: function(anchorVertex, faceBox) {
        'use strict';
        return this.applyPaddingCenterOfEdge.LeftRight(anchorVertex, faceBox, this.boundaryXRight, this.add);
    },
    TopLeft: function(anchorVertex, faceBox) {
        'use strict';
        return this.applyPaddingCorner(anchorVertex, faceBox, this.boundaryXLeft, this.boundaryYTop, this.minus, this.minus);
    },
    TopRight: function(anchorVertex, faceBox) {
        'use strict';
        return this.applyPaddingCorner(anchorVertex, faceBox, this.boundaryXRight, this.boundaryYTop, this.add, this.minus);
    },
    LowerLeft: function(anchorVertex, faceBox) {
        'use strict';
        return this.applyPaddingCorner(anchorVertex, faceBox, this.boundaryXLeft, this.boundaryYBottom, this.minus, this.add);
    },
    LowerRight: function(anchorVertex, faceBox) {
        'use strict';
        return this.applyPaddingCorner(anchorVertex, faceBox, this.boundaryXRight, this.boundaryYBottom, this.add, this.add);
    },
    minus: function(a, b){
        'use strict';
        return a - b;
    },
    add: function(a, b){
        'use strict';
        return a + b;
    },
    boundaryXLeft: function(a, b) {
        'use strict';
        return a > b;
    },
    boundaryXRight: function(a, b, c) {
        'use strict';
        return (a + b) > c;
    },
    boundaryYTop: function(a, b) {
        'use strict';
        return a > b;
    },
    boundaryYBottom: function(a, b, c) {
        'use strict';
        return (a + b) > c;
    }
};

module.exports = {
    calculateAndAddPadding: calculateAndAddPadding
};