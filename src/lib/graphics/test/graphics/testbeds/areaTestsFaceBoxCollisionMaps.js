/*globals module*/

var resultsOneVertexPerQuadrant = {
    "TopLeft": {
        "collisions": [{"x": 45.65, "y": 81.25, "identifier": "A"}],
        "properties": {
            "width": 82,
            "height": 124,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 0},
                "B": {"x": 82, "y": 0},
                "C": {"x": 82, "y": 124},
                "D": {"x": 0, "y": 124}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 0},
                "B": {"x": 82, "y": 0},
                "C": {"x": 82, "y": 124},
                "D": {"x": 0, "y": 124}
            },
            "__isReady": true,
            "AB": {"x": 82, "y": 0},
            "AD": {"x": 0, "y": 124}
        }
    },
    "TopRight": {
        "collisions": [{"x": 120.35, "y": 81.25, "identifier": "B"}],
        "properties": {
            "width": 83,
            "height": 124,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 0},
                "B": {"x": 166, "y": 0},
                "C": {"x": 166, "y": 124},
                "D": {"x": 83, "y": 124}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 0},
                "B": {"x": 166, "y": 0},
                "C": {"x": 166, "y": 124},
                "D": {"x": 83, "y": 124}
            },
            "__isReady": true,
            "AB": {"x": 83, "y": 0},
            "AD": {"x": 0, "y": 124}
        }
    },
    "LowerLeft": {
        "collisions": [{"x": 45.65, "y": 168.75, "identifier": "D"}],
        "properties": {
            "width": 82,
            "height": 125,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 125},
                "B": {"x": 82, "y": 125},
                "C": {"x": 82, "y": 250},
                "D": {"x": 0, "y": 250}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 125},
                "B": {"x": 82, "y": 125},
                "C": {"x": 82, "y": 250},
                "D": {"x": 0, "y": 250}
            },
            "__isReady": true,
            "AB": {"x": 82, "y": 0},
            "AD": {"x": 0, "y": 125}
        }
    },
    "LowerRight": {
        "collisions": [{"x": 120.35, "y": 168.75, "identifier": "C"}],
        "properties": {
            "width": 83,
            "height": 125,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 125},
                "B": {"x": 166, "y": 125},
                "C": {"x": 166, "y": 250},
                "D": {"x": 83, "y": 250}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 125},
                "B": {"x": 166, "y": 125},
                "C": {"x": 166, "y": 250},
                "D": {"x": 83, "y": 250}
            },
            "__isReady": true,
            "AB": {"x": 83, "y": 0},
            "AD": {"x": 0, "y": 125}
        }
    }
};
var resultsAllVertexTopLeftQuadrant = {
    "TopLeft": {
        "collisions": [{"x": 0, "y": 0, "identifier": "A"}, {
            "x": 74.7,
            "y": 0,
            "identifier": "B"
        }, {"x": 74.7, "y": 87.5, "identifier": "C"}, {"x": 0, "y": 87.5, "identifier": "D"}],
        "properties": {
            "width": 82,
            "height": 124,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 0},
                "B": {"x": 82, "y": 0},
                "C": {"x": 82, "y": 124},
                "D": {"x": 0, "y": 124}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 0},
                "B": {"x": 82, "y": 0},
                "C": {"x": 82, "y": 124},
                "D": {"x": 0, "y": 124}
            },
            "__isReady": true,
            "AB": {"x": 82, "y": 0},
            "AD": {"x": 0, "y": 124}
        }
    }
};
var resultsAllVertexTopRightQuadrant = {
    "TopRight": {
        "collisions": [{"x": 83, "y": 0, "identifier": "A"}, {
            "x": 157.7,
            "y": 0,
            "identifier": "B"
        }, {"x": 157.7, "y": 87.5, "identifier": "C"}, {"x": 83, "y": 87.5, "identifier": "D"}],
        "properties": {
            "width": 83,
            "height": 124,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 0},
                "B": {"x": 166, "y": 0},
                "C": {"x": 166, "y": 124},
                "D": {"x": 83, "y": 124}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 0},
                "B": {"x": 166, "y": 0},
                "C": {"x": 166, "y": 124},
                "D": {"x": 83, "y": 124}
            },
            "__isReady": true,
            "AB": {"x": 83, "y": 0},
            "AD": {"x": 0, "y": 124}
        }
    }
};
var resultsAllVertexLowerLeftQuadrant = {
    "LowerLeft": {
        "collisions": [{"x": 0, "y": 125, "identifier": "A"}, {
            "x": 74.7,
            "y": 125,
            "identifier": "B"
        }, {"x": 74.7, "y": 212.5, "identifier": "C"}, {"x": 0, "y": 212.5, "identifier": "D"}],
        "properties": {
            "width": 82,
            "height": 125,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 125},
                "B": {"x": 82, "y": 125},
                "C": {"x": 82, "y": 250},
                "D": {"x": 0, "y": 250}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 125},
                "B": {"x": 82, "y": 125},
                "C": {"x": 82, "y": 250},
                "D": {"x": 0, "y": 250}
            },
            "__isReady": true,
            "AB": {"x": 82, "y": 0},
            "AD": {"x": 0, "y": 125}
        }
    }
};
var resultsAllVertexLowerRightQuadrant = {
    "LowerRight": {
        "collisions": [{
            "x": 83,
            "y": 125,
            "identifier": "A"
        }, {"x": 157.7, "y": 125, "identifier": "B"}, {"x": 157.7, "y": 212.5, "identifier": "C"}, {
            "x": 83,
            "y": 212.5,
            "identifier": "D"
        }],
        "properties": {
            "width": 83,
            "height": 125,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 125},
                "B": {"x": 166, "y": 125},
                "C": {"x": 166, "y": 250},
                "D": {"x": 83, "y": 250}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 125},
                "B": {"x": 166, "y": 125},
                "C": {"x": 166, "y": 250},
                "D": {"x": 83, "y": 250}
            },
            "__isReady": true,
            "AB": {"x": 83, "y": 0},
            "AD": {"x": 0, "y": 125}
        }
    }
};
var resultsAllVertexTopLeftTopRightQuadrant = {
    "TopLeft": {
        "collisions": [{
            "x": 41.5,
            "y": 0,
            "identifier": "A"
        }, {"x": 41.5, "y": 87.5, "identifier": "D"}],
        "properties": {
            "width": 82,
            "height": 124,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 0},
                "B": {"x": 82, "y": 0},
                "C": {"x": 82, "y": 124},
                "D": {"x": 0, "y": 124}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 0},
                "B": {"x": 82, "y": 0},
                "C": {"x": 82, "y": 124},
                "D": {"x": 0, "y": 124}
            },
            "__isReady": true,
            "AB": {"x": 82, "y": 0},
            "AD": {"x": 0, "y": 124}
        }
    },
    "TopRight": {
        "collisions": [{"x": 116.2, "y": 0, "identifier": "B"}, {"x": 116.2, "y": 87.5, "identifier": "C"}],
        "properties": {
            "width": 83,
            "height": 124,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 0},
                "B": {"x": 166, "y": 0},
                "C": {"x": 166, "y": 124},
                "D": {"x": 83, "y": 124}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 0},
                "B": {"x": 166, "y": 0},
                "C": {"x": 166, "y": 124},
                "D": {"x": 83, "y": 124}
            },
            "__isReady": true,
            "AB": {"x": 83, "y": 0},
            "AD": {"x": 0, "y": 124}
        }
    }
};
var resultsAllVertexLowerLeftLowerRightQuadrant = {
    "LowerLeft": {
        "collisions": [{
            "x": 41.5,
            "y": 125,
            "identifier": "A"
        }, {"x": 41.5, "y": 212.5, "identifier": "D"}],
        "properties": {
            "width": 82,
            "height": 125,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 125},
                "B": {"x": 82, "y": 125},
                "C": {"x": 82, "y": 250},
                "D": {"x": 0, "y": 250}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 125},
                "B": {"x": 82, "y": 125},
                "C": {"x": 82, "y": 250},
                "D": {"x": 0, "y": 250}
            },
            "__isReady": true,
            "AB": {"x": 82, "y": 0},
            "AD": {"x": 0, "y": 125}
        }
    },
    "LowerRight": {
        "collisions": [{"x": 116.2, "y": 125, "identifier": "B"}, {
            "x": 116.2,
            "y": 212.5,
            "identifier": "C"
        }],
        "properties": {
            "width": 83,
            "height": 125,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 125},
                "B": {"x": 166, "y": 125},
                "C": {"x": 166, "y": 250},
                "D": {"x": 83, "y": 250}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 125},
                "B": {"x": 166, "y": 125},
                "C": {"x": 166, "y": 250},
                "D": {"x": 83, "y": 250}
            },
            "__isReady": true,
            "AB": {"x": 83, "y": 0},
            "AD": {"x": 0, "y": 125}
        }
    }
};
var resultsAllVertexTopLeftLowerLeftQuadrant = {
    "TopLeft": {
        "collisions": [{
            "x": 0,
            "y": 62.5,
            "identifier": "A"
        }, {"x": 74.7, "y": 62.5, "identifier": "B"}],
        "properties": {
            "width": 82,
            "height": 124,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 0},
                "B": {"x": 82, "y": 0},
                "C": {"x": 82, "y": 124},
                "D": {"x": 0, "y": 124}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 0},
                "B": {"x": 82, "y": 0},
                "C": {"x": 82, "y": 124},
                "D": {"x": 0, "y": 124}
            },
            "__isReady": true,
            "AB": {"x": 82, "y": 0},
            "AD": {"x": 0, "y": 124}
        }
    },
    "LowerLeft": {
        "collisions": [{"x": 74.7, "y": 150, "identifier": "C"}, {"x": 0, "y": 150, "identifier": "D"}],
        "properties": {
            "width": 82,
            "height": 125,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 125},
                "B": {"x": 82, "y": 125},
                "C": {"x": 82, "y": 250},
                "D": {"x": 0, "y": 250}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 0, "y": 125},
                "B": {"x": 82, "y": 125},
                "C": {"x": 82, "y": 250},
                "D": {"x": 0, "y": 250}
            },
            "__isReady": true,
            "AB": {"x": 82, "y": 0},
            "AD": {"x": 0, "y": 125}
        }
    }
};
var resultsAllVertexTopRightLowerRightQuadrant = {
    "TopRight": {
        "collisions": [{
            "x": 83,
            "y": 62.5,
            "identifier": "A"
        }, {"x": 157.7, "y": 62.5, "identifier": "B"}],
        "properties": {
            "width": 83,
            "height": 124,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 0},
                "B": {"x": 166, "y": 0},
                "C": {"x": 166, "y": 124},
                "D": {"x": 83, "y": 124}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 0},
                "B": {"x": 166, "y": 0},
                "C": {"x": 166, "y": 124},
                "D": {"x": 83, "y": 124}
            },
            "__isReady": true,
            "AB": {"x": 83, "y": 0},
            "AD": {"x": 0, "y": 124}
        }
    },
    "LowerRight": {
        "collisions": [{"x": 157.7, "y": 150, "identifier": "C"}, {"x": 83, "y": 150, "identifier": "D"}],
        "properties": {
            "width": 83,
            "height": 125,
            "vertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 125},
                "B": {"x": 166, "y": 125},
                "C": {"x": 166, "y": 250},
                "D": {"x": 83, "y": 250}
            },
            "__previousStateVertices": {
                "pMembers": ["A", "B", "C", "D"],
                "A": {"x": 83, "y": 125},
                "B": {"x": 166, "y": 125},
                "C": {"x": 166, "y": 250},
                "D": {"x": 83, "y": 250}
            },
            "__isReady": true,
            "AB": {"x": 83, "y": 0},
            "AD": {"x": 0, "y": 125}
        }
    }
};


module.exports = {
    resultsOneVertexPerQuadrant: resultsOneVertexPerQuadrant,
    resultsAllVertexTopLeftQuadrant: resultsAllVertexTopLeftQuadrant,
    resultsAllVertexTopRightQuadrant: resultsAllVertexTopRightQuadrant,
    resultsAllVertexLowerLeftQuadrant: resultsAllVertexLowerLeftQuadrant,
    resultsAllVertexLowerRightQuadrant: resultsAllVertexLowerRightQuadrant,
    resultsAllVertexTopLeftTopRightQuadrant: resultsAllVertexTopLeftTopRightQuadrant,
    resultsAllVertexLowerLeftLowerRightQuadrant: resultsAllVertexLowerLeftLowerRightQuadrant,
    resultsAllVertexTopLeftLowerLeftQuadrant: resultsAllVertexTopLeftLowerLeftQuadrant,
    resultsAllVertexTopRightLowerRightQuadrant: resultsAllVertexTopRightLowerRightQuadrant
};