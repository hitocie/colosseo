
cordova.define('tournament', function(require, exports, module) {
    
    var Node = function( siblingIndex, height, attrs ) {
        this.siblingIndex = siblingIndex;
        this.height = height;
        if (attrs) {
            this.isLeaf = false || attrs.isLeaf;
            this.isRoot = false || attrs.isRoot;
            this.parent = null || attrs.parent;
            this.children = null || attrs.children;
        }
        this.calculateCoordinates();
    };
    Object.defineProperty(Node.prototype, 'children', {
        get: function() {
            return this._children;
        },
        set: function( nodes ) {
            if ( this._children != nodes ) {
                this._children = nodes;
                if ( nodes ) {
                    this.calculateCoordinates();
                }
            }
        }
    });
    Node.prototype.calculateCoordinates = function() {
        var children = this.children, x = 0;
        if ( children ) {
            if ( this.isRoot ) {
                this.x = children[0].x;
            } else {
                children.forEach(function( child ) {
                    x += child.x;
                });
                this.x = x / 2;
            }
        } else {
            // Here because this node is a Leaf.
            // FIXME:
            // 100 should be contant value.
            this.x = this.siblingIndex * 100;
        }
        this.y = this.height;
    };
    
    var Tournament = function() {
    
    };
    Tournament.makeTree = function(allNodes, nodes, height) {
        var parentNodes = [],
            numOfNodes = nodes.length, i;
        allNodes.push(nodes);
        if ( numOfNodes > 1 ) {
            for (i = 0; i < numOfNodes; i++) {
                var node = nodes[i],
                    prevNode = nodes[i - 1],
                    parentNode;
                if ( i % 2 != 0 && prevNode ) {
                    parentNode = new Node(parentNodes.length, height + 1);
                    parentNode.children = [ node, prevNode ];
                    node.parent = prevNode.parent = parentNode;
                    parentNodes.push(parentNode);
                }
            }
            if ( numOfNodes % 2 != 0 ) {
                parentNodes.push( nodes[numOfNodes - 1] );
            }
        } else {
            node = nodes[0];
            if ( node.isRoot ) {
                return;
            }
            parentNode = new Node(0, height + 1, {isRoot: true});
            parentNode.children = [ node ];
            node.parent = parentNode;
            parentNodes.push(parentNode);
        }
        Tournament.makeTree(allNodes, parentNodes, height + 1);
    };

    $(document).on('pageinit', '#canvasPage', function() {
        var allNodes = [], leafs = [];
        for (var i = 0; i < 6; i++) {
            leafs.push(new Node(i, 1, {isLeaf: true}));
        }
        Tournament.makeTree(allNodes, leafs, 1);
    });

    exports.Tournament = Tournament;
    exports.Node = Node;
});
