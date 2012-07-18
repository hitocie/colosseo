
var rootNode = allNodes[allNodes.length - 1][0];
var treeHeight = rootNode.coordinates[1];

var path = new CompoundPath();

var inc = 0;
function pp(node) {
    var coordinates = node.coordinates,
	children = node.children,
	x = coordinates[0] + 50, y = (treeHeight - coordinates[1]) * 50;
//    if (node.isLeaf) {
	var circle = new Path.Circle(new Point(x, y), 10);
	circle.fillColor = "blue";
	circle.data = node;
  //  }
    if ( children ) {
	for (var i = 0; i < children.length; i++) {
	    
	    var child = children[i],
		childCoordinates = child.coordinates,
		childX = childCoordinates[0] + 50,
		childY = (treeHeight - childCoordinates[1]) * 50;
	    var p = new Path(new Point(x, y), new Point(childX, y), new Point(childX, childY));
	    p.strokeColor = 'black';
	    path.addChild(p);
	    console.log(x + ":" + y + " -> " + childX + ":" + childY);
	    pp(child);
	}
    }
}

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};
function onMouseDown(event) {
    var res = paper.project.hitTest(event.point, hitOptions);
    if (res && res.item) {
	var data = res.item.data;
	console.log(data);
	if (data && data.children) {
	    var go = true;
	    for (var i = 0; i < data.children.length; i++) {
		var c = data.children[i];
		if (!c.isLeaf && !c.ok) {
		    go = false;
		    break;
		}
	    }
	    if (go) {
		var child;
		if (confirm()) {
		    child = data.children[0];
		} else {
		    child = data.children[1];
		}
		var x = data.coordinates[0] + 50, y = (treeHeight - data.coordinates[1]) * 50;
		var cx = child.coordinates[0] + 50, cy = (treeHeight - child.coordinates[1]) * 50;
		var p = new Path(new Point(x, y), new Point(cx, y), new Point(cx, cy));
		p.strokeColor = "red";
		data.ok = true;
	    }
	}
    }
    console.log(res);
}

pp(rootNode);