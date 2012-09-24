var LAST_PARITCIPANTS_KEY = 'last_participants_key';

(function() {
    var arr = [];
    for (var i = 0; i < 7; i++) {
        arr.push({
            uid: i
        });
    }
    window.localStorage.setItem(LAST_PARITCIPANTS_KEY, JSON.stringify(arr));
}());


$(document).on('pageinit', '#tour', function() {
    // get participants.
    var participants = window.localStorage[LAST_PARITCIPANTS_KEY];
    if (participants) {
        var tree = new Tree(JSON.parse(participants));
        drawOnStage('container', tree.rootNode);
    }
    window.localStorage.clear();
});


function BattleManager() {

}

BattleManager.prototype.add = function() {

};

function drawOnStage(container, rootNode) {
    var stage = new Kinetic.Stage({
        container: 'container',
        width: 1000,
        height: 1000
    });

    var layer = new Kinetic.Layer(),
        stack = [],
        node;
    var rootY = rootNode.position.actualY,
        parentX, parentY, childL, childR, childLPos, childRPos, childLX, childRX, childLY, childRY, circle, lineL, lineR;

    stack.push(rootNode);
    while (stack.length !== 0) {
        node = stack.pop();

        node.draw(layer, {
            rootNode: rootNode
        });
        // node.buildShape( rootNode );
        // circle = node.circle;
        // lineL = node.lineL;
        // lineR = node.lineR;
        // if ( lineR && lineL ) {
        //     layer.add(lineL);
        //     layer.add(lineR);
        // }
        // layer.add(circle);
        //         (function(node) {
        //             circle.on('mousedown', function() {
        //                 var childL = node.childLeft,
        //                     childR = node.childRight,
        //                     participantL, participantR,
        //                     lineL, lineR;
        //                 if (childL && childR) {
        //                     participantL = childL.participant;
        //                     participantR = childR.participant;
        //                     lineL = node.lineL;
        //                     lineR = node.lineR;
        //                     if ( participantL && participantR ) {
        //                         var result = confirm();
        //                         if ( result ) {
        //                             lineR.setStroke('red');
        //                             lineR.setStrokeWidth(4);
        //                             layer.draw();
        //                             childL.markLose();
        //                         }
        //                     }
        //                 }
        //                 this.setFill('red');
        //                 layer.draw();
        // //                $.mobile.changePage('dialog.html');
        //             });
        //         }(node));
        if (node.childLeft && node.childRight) {
            stack.push(node.childRight);
            stack.push(node.childLeft);
        }
    }

    stage.add(layer);
}

function Node(args) {
    var children = args.children || [],
        childrenLen = children.length,
        childLeft, childRight;

    if (childrenLen !== 0 && childrenLen !== 2) {
        throw new Error('error');
    }

    childLeft = children[0], childRight = children[1];

    this.childLeft = childLeft;
    this.childRight = childRight;
    if (childLeft && childRight) {
        childLeft.parent = childRight.parent = this;
    }
    this.position = args.position;
}

Node.prototype = {

    bindParticipant: function(user) {
        this.participant = user;
    },

    draw: function(layer, context) {
        var info = new DrawingInfo(this, context),
            node = this,
            handle = info.handle,
            lineR = info.lineRight, lineL = info.lineLeft;

        info.draw(layer);

        handle.on('mousedown', function() {
            if ( !node.hasChildren ) return;

            var childL = node.childLeft,
                childR = node.childRight,
                participantL = childL.participant,
                participantR = childR.participant;

            if ( participantL && participantR ) {
                var result = confirm();
                if (result) {
                    lineR.setStroke('red');
                    lineR.setStrokeWidth(4);
                    layer.draw();

                    info.markLose();
                }
            }

            this.setFill('red');
            layer.draw();
            // $.mobile.changePage('dialog.html');
        });
    }
};

Object.defineProperties(Node.prototype, {
    'hasChildren': {
        get: function() {
            return (this.childRight && this.childLeft);
        }
    }
});


function DrawingInfo(node, context) {
    var rootNode = context.rootNode,
        treeHeight = rootNode.position.actualY;

    this.node = node;
    this.handle = this._createHandle(node, treeHeight);
    this.lineLeft = this._createEdge(node.childLeft, treeHeight);
    this.lineRight = this._createEdge(node.childRight, treeHeight);
}

DrawingInfo.prototype = {

    _createHandle: function(node, treeHeight) {
        var pos = node.position,
            x = pos.actualX,
            y = Math.abs(pos.actualY - treeHeight),
            circle;

        return new Kinetic.Circle({
            x: x,
            y: y,
            radius: 10,
            fill: (node.participant) ? 'red' : 'lightgray'
        });
    },

    _createEdge: function(node, treeHeight) {
        if (!node) return;

        var handle = this.handle,
            handleX = handle.getX(),
            handleY = handle.getY(),
            pos = node.position,
            x = pos.actualX,
            y = Math.abs(pos.actualY - treeHeight);

        return new Kinetic.Line({
            points: [x, y, x, handleY, handleX, handleY],
            stroke: 'lightgray',
            strokeWidth: 2
        });
    },

    draw: function(layer) {
        if (this.lineRight) {
            layer.add(this.lineRight);
        }
        if (this.lineLeft) {
            layer.add(this.lineLeft);
        }
        layer.add(this.handle);
    },

    markLose: function() {
        var lineR = this.lineRight,
            lineL = this.lineLeft;
        this.handle.setFill('black');

        if (!lineR || !lineL) return;

        [lineR, lineL].forEach(function(line) {
            line.setStroke('black');
            line.setStrokeWidth(2);
        });
    }
};

function Position(x, y) {
    this.x = x;
    this.y = y;
}

Position.xSpacing = 100;
Position.ySpacing = 50;
Position.margin = 30;

Object.defineProperty(Position.prototype, 'actualX', {
    get: function() {
        return this.x * Position.xSpacing + Position.margin;
    }
});

Object.defineProperty(Position.prototype, 'actualY', {
    get: function() {
        return this.y * Position.ySpacing;
    }
});

function Tree(participants) {
    var leafs = [],
        participantsLen = participants.length,
        leaf;

    for (var i = 0; i < participantsLen; i++) {
        leaf = new Node({
            position: new Position(i, 0)
        });
        leaf.bindParticipant(participants[i]);
        leafs.push(leaf);
    }

    this.rootNode = this.constructToRoot(leafs);
    this.leafs = leafs;
    this.height = this.rootNode.position.actualY;
}
Tree.prototype = {

    constructToRoot: function(nodes) {
        if (nodes.length === 1) {
            return nodes[0];
        }

        var parents = [],
            currentNode, nextNode, p, x, y;
        for (var i = 0, len = nodes.length; i < len; i = i + 2) {
            currentNode = nodes[i], nextNode = nodes[i + 1];

            if (!nextNode) {
                parents.push(currentNode);
                continue;
            }

            x = (currentNode.position.x + nextNode.position.x) / 2;
            y = Math.max(currentNode.position.y, nextNode.position.y) + 1;

            p = new Node({
                children: [currentNode, nextNode],
                position: new Position(x, y)
            });
            parents.push(p);
        }
        parents.reverse();

        return this.constructToRoot(parents);
    },

    applyBattlesResult: function(battleManager) {
        this.battleManager = battleManager;
    }

};