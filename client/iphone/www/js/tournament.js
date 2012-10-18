
function drawBattle( battle ) {

var tournamentContext = {};

function initTournament( battle ) {
    var tree = new Tree( battle );
    drawOnStage('container', tree.rootNode);
}

$( document ).on('pageshow', '#tournament-page', function() {
    var currentNode = tournamentContext.currentNode,
        winnerId = tournamentContext.winnerId;

    if ( currentNode && winnerId ) {
        currentNode.result( winnerId );
    }
});


function drawOnStage(container, rootNode) {
    var stage = new Kinetic.Stage({
        container: 'container',
        width: 1000,
        height: 1000
    });

    var layer = new Kinetic.Layer(),
        stack = [],
        node, children;

    stack.push(rootNode);
    while (stack.length !== 0) {
        node = stack.pop();
        node.draw(layer, {
            rootNode: rootNode
        });

        children = node.children;
        if ( children ) {
            for (var i = 0, len = children.length; i < len; i++) {
                stack.push( children[i] );
            }
        }
    }

    stage.add(layer);
}


//
// Observer
//
function Observer() {
}

Observer.prototype.handleMessage = function( data, sender ) {
};


//
// Subject
//
function Subject() {
    this.Observers = [];
}

Subject.prototype = {
    
    addObserver: function( o ) {
        this.Observers.push( o );
    },

    notifyObservers: function( data ) {
        var observers = this.observers,
            observersLen = observers.length,
            observer, i;
        for (i = 0; i < observersLen; i++) {
            observer = observers[ i ];
            observer.handleMessage( data, this );
        }
    }

};



//
// Node
//
function Node(args) {
    var children = args.children || [],
        childrenLen = children.length;

    if (childrenLen !== 0 && childrenLen !== 2) {
        throw new Error('error');
    }

    this.position = args.position;
    this.children = children;

    if ( childrenLen > 0 ) {
        for (var i = 0; i < childrenLen; i++) {
            children[i].parent = this;
        }
    }
}

Node.prototype = Object.create(new Subject());

Node.prototype.bindParticipant = function(user) {
    this.participant = user;
};

Node.prototype.draw = function(layer, context) {
    var info = new DrawingInfo(this, context),
        node = this,
        handle = info.handle;

    this.info = info;
    info.draw(layer);

    handle.on('mousedown touchstart', function() {
        if ( !node.hasChildren ) return;

        var children = node.children, participants = [], p;
        for (var i = 0, len = children.length; i < len; i++) {
            p = children[i].participant;
            if ( !p ) {
                break;
            }
            participants.push(p);
        }

        if ( participants.length !== 2 ) return;

        tournamentContext.participants = participants;
        tournamentContext.currentNode = node;

        // node.markWin(1);
        // node.markLose(0);
        node.result(node.children[0].participant.uid);
        layer.draw();
        // $.mobile.changePage('dialog.html');
    });
};

Node.prototype.result = function( id ) {
    var children = this.children, p, found = false;
    for (var i = 0, len = children.length; i < len; i++) {
        p = children[i].participant;
        if ( !p ) break;

        if ( p.uid === id ) {
            this.markWin( i );
        } else {
            this.markLose( i );
        }
    }
    var info = this.info,
        topEdge = info.topEdge;
    if ( topEdge ) {

    }
};

Node.prototype.markWin = function( index ) {
    var child = this.children[ index ],
        info = this.info;
    
    info.markWin( index );
    this.bindParticipant( child.participant );
};

Node.prototype.markLose = function( index ) {
    var child = this.children[ index ],
        info = this.info;
    
    info.markLose( index );
};

Object.defineProperties(Node.prototype, {
    'hasChildren': {
        get: function() {
            var children = this.children;
            return (children && children.length > 0);
        }
    }
});


//
// DrawingInfo
//
function DrawingInfo(node, context) {
    var rootNode = context.rootNode,
        treeHeight = rootNode.position.actualY,
        children = node.children,
        lines = [];

    this.node = node;
    this.handle = this._createHandle(node, rootNode/*treeHeight*/);
    for (var i = 0, len = children.length; i < len; i++) {
        lines.push( this._createEdge(children[i], rootNode/*treeHeight*/) );
    }
    if ( node === rootNode ) {
        this.topLine = this._createTopEdge( node );
    }
    this.lines = lines;
}

DrawingInfo.prototype = {

    _createHandle: function( node, treeHeight ) {
        var pos = node.position,
            x = pos.actualX,
            // y = Math.abs(pos.actualY - treeHeight),
            y = pos.getHeight( treeHeight ),
            circle;

        return new Kinetic.Circle({
            x: x,
            y: y,
            radius: 10,
            fill: (node.participant) ? 'red' : 'gray'
        });
    },

    _createEdge: function(node, treeHeight) {
        if (!node) return;

        var handle = this.handle,
            handleX = handle.getX(),
            handleY = handle.getY(),
            pos = node.position,
            x = pos.actualX,
//            y = Math.abs(pos.actualY - treeHeight);
            y = pos.getHeight( treeHeight );

        return new Kinetic.Line({
            points: [x, y, x, handleY, handleX, handleY],
            stroke: 'gray',
            strokeWidth: 2
        });
    },

    _createTopEdge: function( rootNode, treeHeight ) {
        var x = rootNode.position.actualX,
            y = rootNode.position.actualY;
        console.log('y:' + y);
        return new Kinetic.Line({
            points: [ x, y - 50, x, 50 ],
            stroke: 'gray',
            strokeWidth: 2
        });
    },

    draw: function(layer) {
        var lines = this.lines, len = lines.length, i;
        for (i = 0; i < len; i++) {
            layer.add(lines[i]);
        }
        if ( this.topLine ) {
            layer.add(this.topLine);
        }
        layer.add(this.handle);
    },

    markWin: function( index ) {
        this.handle.setFill('red');
        var line = this.lines[ index ];
        if ( line ) {
            line.setStroke('red');
            line.setStrokeWidth(5);
        }
        this.winnerIndex = index;
    },

    markLose: function( index ) {
        if ( typeof index === 'undefined' ) {
            index = this.winnerIndex;
            this.handle.setFill('lightgray');
        }

        var line = this.lines[ index ];
        if ( line ) {
            line.setStroke('lightgray');
        }
        var children = this.node.children;
        if ( children && children[index]) {
            children[index].info.markLose();
        }
    }
};


//
// Position
//
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

Position.prototype.getHeight = function( base ) {
    var k = Math.abs( this.y - base.position.y );
    console.log( k * Position.ySpacing );
    var foo =  k * Position.ySpacing + 100;
    console.log(foo);
    return foo;
};


//
// Tree
//
function Tree( battle ) {
    var leafs = this.createLeafs( battle.participants ),
        allMatches = [];
    this.rootNode = this.constructToRoot( leafs, allMatches );
    this.height = this.rootNode.position.actualY;
    this.leafs = leafs;
    this.allMatches = allMatches;
    this.currentNode = null;
}

Tree.prototype = Object.create(new Observer());

Tree.prototype.createLeafs = function( participants ) {
    if ( !Array.isArray(participants) || participants.length === 0 ) return;
    var participantsLen = participants.length,
        leafs = [],
        leaf;
    
    for (var i = 0; i < participantsLen; i++) {
        leaf = new Node({
            position: new Position(i, 0)
        });
        leaf.bindParticipant(participants[i]);
        leafs.push(leaf);
    }
    return leafs;
};

Tree.prototype.constructToRoot = function( nodes, allMatches ) {
    if (nodes.length === 1) {
        return nodes[0];
    }

    var parents = [],
        currentNode, nextNode, p, x, y;
    for (var i = 0, len = nodes.length; i < len; i = i + 2) {
        currentNode = nodes[i], nextNode = nodes[i + 1];

        if ( !nextNode ) {
            parents.push( currentNode );
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
    allMatches.concat( parents );
    
    return this.constructToRoot( parents, allMatches );
};

Tree.prototype.findBattle = function( players ) {
    var allMatches = this.allMatches, match;
    for (var i = 0, len = allMatches.length; i < len; i++) {
        match = allMatches[i];
        var children = match.children, foundAll = true, found = false;
        for (var j, playersLen = players.length; j < len; j++ ) {
            found = false;
            for (var k, childrenLen = children.length; k < len; k++ ) {
                found = found || ( players[j] === children[k] );
            }
            foundAll = (foundAll && found);
        }

        if ( foundAll ) {
            return match;
        }
    }
};


Tree.prototype.handleMessage = function( data, sender) {
    if (typeof data === 'undefined' ) return;

    var currentNode = data.currentNode;
    if ( currentNode ) {
        this.currentNode = currentNode;
    }
};

}
