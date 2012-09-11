


function kine() {

    function drawOnStage( container, rootNode ) {
        var stage = new Kinetic.Stage({
            container: 'container',
            width: 500,
            height: 500
        });
        
        var layer = new Kinetic.Layer(), stack = [], node;
        
        stack.push(rootNode);
        while( stack.length !== 0 ) {
            node = stack.pop();
            layer.add(new Kinetic.Circle({
                x: node.position.x,
                y: node.position.y,
                radius: 20,
                fill: 'blue'
            }));
            if ( node.childLeft && node.childRight ) {
                stack.push(node.childRight);
                stack.push(node.childLeft);
            }
        }
        
        stage.add(layer);
    }
    
    function Node( args ) {
        var children = args.children || [],
            childrenLen = children.length,
            childLeft, childRight;
        
        if ( childrenLen !== 0 && childrenLen !== 2) {
            throw new Error('error');
        }
        
        childLeft = children[0], childRight = children[1];
        
        this.childLeft = childLeft;
        this.childRight = childRight;
        if ( childLeft && childRight ) {
            childLeft.parent = childRight.parent = this;
        }
        this.position = args.position;
    }

    function Position( x, y ) {
        this.x = x;
        this.y = y;
    }
    
    Position.xSpacing = 100;
    Position.ySpacing = 50;
    
    Object.defineProperty(Position.prototype, 'x', {
        get: function() {
            return this._x * Position.xSpacing;
        },
        set: function( newX ) {
            this._x = newX;
        }
    });
    
    Object.defineProperty(Position.prototype, 'y', {
        get: function() {
            return this._y * Position.ySpacing;
        },
        set: function( newY ) {
            this._y = newY;
        }
    });


    function Tree( leafsNum, xSpacing, ySpacing ) {
        xSpacing = xSpacing || 100;
        ySpacing = ySpacing || 50;
        
        var leafs = [], leaf;
        for (var i = 0; i < leafsNum; i++) {
            leaf = new Node({
                position: new Position( i, 0 )
            });
            leafs.push(leaf);
        }
        this.rootNode = this.constructToRoot(leafs);
        this.leafs = leafs;
    }
    
    Tree.prototype.constructToRoot = function( nodes ) {
        if ( nodes.length === 1 ) {
            return nodes[0];
        }

        var parents = [], currentNode, nextNode, p, position, x, y;
        for (var i = 0, len = nodes.length; i < len; i = i + 2) {
            currentNode = nodes[i], nextNode = nodes[i+1];
            
            if ( !nextNode ) {
                parents.push(currentNode);
                continue;
            }
            
            x = ( currentNode.position.x + nextNode.position.x ) / 2;
            y = Math.max( currentNode.position.y, nextNode.position.y ) + 1;

            position = new Position();
            p = new Node({
                children: [ currentNode, nextNode ],
                position: new Position(x, y)
            });
            parents.push(p);
        }
        parents.reverse();
        
        return this.constructToRoot(parents);
    };
    console.log('next hoge');
    var tree = new Tree(7);
    drawOnStage('container', tree.rootNode);
};    


window.onload = function() {
    kine();

    console.log('gren');
    
    var stage = new Kinetic.Stage({
        container: 'container',
        width: 578,
        height: 200
    });
    
    var layer = new Kinetic.Layer();

    var oval = new Kinetic.Ellipse({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        radius: {
            x: 100,
            y: 50
        },
        fill: 'yellow',
        stroke: 'black',
        strokeWidth: 4
    });
    oval.on('mousedown', function() {
        alert('kitayo');
    });

    var text = new Kinetic.Text({
        x: 190,
        y: 15,
        text: "Chrono Trigger",
        fontSize: 30,
        textFill: 'blue'
    });

    layer.add(oval);
    layer.add(text);
    stage.add(layer);
};
