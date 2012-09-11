
paper.install(window);

$(document).on('pageinit', '#tournament-page', function() {
    paper.setup('cnvs');
    
    var T = cordova.require('tournament');
    
    // test code
    var allNodes = [], leafs = [];
    for (var i = 0; i < 6; i++) {
        leafs.push(new T.Node(i, 1, {isLeaf: true}));
    }
    T.Tournament.makeTree(allNodes, leafs, 1);

    var rootNode = allNodes[allNodes.length - 1][0];
    var treeHeight = rootNode.y;
    var path = new CompoundPath();
    var tool = new Tool();

    function drawPath( node ) {
        var children = node.children,
            x = node.x + 50, y = (treeHeight - node.y) * 50;

        var circle = new Path.Circle(new Point(x, y), 10);
        circle.fillColor = "blue";
        circle.data = node;

        if ( children ) {
            children.forEach(function(child) {
                var childX = child.x + 50,
                    childY = (treeHeight - child.y) * 50;
                var p = new Path(new Point(x, y), new Point(childX, y), new Point(childX, childY));
                p.strokeColor = 'black';
                path.addChild(p);
                drawPath(child);
            });
        }
    }

    var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5
    };
    tool.onMouseDown = function(event) {
        var hitResult = paper.project.hitTest(event.point, hitOptions),
            data;
        
        function isClickable(children) {
            var ok = true, i;
            for (i = 0; i < children.length; i++) {
                var c = data.children[i];
                if (!c.isLeaf && !c.ok) {
                    ok = false;
                    break;
                }
            }
            return ok;
        }
        
        if (hitResult && hitResult.item) {
            data = hitResult.item.data;
            if (data && data.children) {
                if ( isClickable(data.children) ) {
                    var child;
                    // if ( confirm() ) {
                    //     child = data.children[0];
                    // } else {
                    //     child = data.children[1];
                    // }
                    
                    $.mobile.changePage('inputresult.html');

                    var x = data.x + 50, y = (treeHeight - data.y) * 50;
                    var cx = child.x + 50, cy = (treeHeight - child.y) * 50;
                    var p = new Path(new Point(x, y), new Point(cx, y), new Point(cx, cy));
                    p.strokeColor = "red";
                    data.ok = true;
                }
            }
        }
    };

//    setTimeout(function() { drawPath(rootNode);}, 0);
});
