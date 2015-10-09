/*globals console, module*/

var switchQuadrantNameToIdentifier = {
    TopLeft: 'A',
    TopRight: 'B',
    LowerRight: 'C',
    LowerLeft: 'D'
};

var switchCaseSelection = {
    A: function(faceBox, faceBoxAnalysis) {
        'use strict';
        console.log(JSON.stringify(faceBoxAnalysis));
    },
    B: function(faceBox, faceBoxAnalysis){
        'use strict';

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
    if(priorities.length === 4) {
        switchCaseSelection.ALL(faceBox, faceBoxAnalysis, priorities);
    } else {
        switchCaseSelection[Quadrants](faceBox, faceBoxAnalysis, priorities);
    }
}

module.exports = {
    selectAnchorPoint: selectAnchorPoint
};