
function makeTree(allNodes, nodes, height) {
    var parentNodes = [],
	numOfNodes = nodes.length,
	node, prevNode, parentNode, i;
    
    if (height == 1) {
	nodes.forEach(function(n) {
	    n.isLeaf = true;
	});
    }
    allNodes.push(nodes);
    if ( numOfNodes > 1 ) {
	for (i = 0; i < numOfNodes; i++) {
	    node = nodes[i], prevNode = nodes[i - 1];
	    if ( i % 2 != 0 && prevNode ) {
		parentNode = {};
		parentNode.children = [ node, prevNode ];
		node.parent = prevNode.parent = parentNode;
		parentNodes.push(parentNode);
	    }
	    if ( !node.coordinates ) {
		if ( node.children ) {
		    var x = 0, j, children = node.children, cLength = children.length;
		    for (j = 0; j < cLength; j++) {
			x += children[j].coordinates[0];
		    }
		    node.coordinates = [ x / 2, height ];
		} else {
		    node.coordinates = [ i * 100, height ];
		}
	    }
	    if ( node.coordinates[1] != height ) {
		nodes.pop();
	    }
	}
	if ( numOfNodes % 2 != 0 ) {
	    parentNodes.push( nodes[numOfNodes - 1] );
	}
    } else {
	node = nodes[0];
	var x = 0, j, children = node.children, cLength = children.length;
	for (j = 0; j < cLength; j++) {
	    x += children[j].coordinates[0];
	}
	node.coordinates = [ (node.isRoot)? x : x / 2, height ];
	if ( node.isRoot ) {
	    return;
	}
	parentNode = {
	    isRoot: true,
	    children: [ node ]
	};
	node.parent = parentNode;
	parentNodes.push(parentNode);
    }
    makeTree(allNodes, parentNodes, height + 1);
}

var allNodes = [], leafs = [];
for (var i = 0; i < 6; i++) {
    leafs.push({});
}
makeTree(allNodes, leafs, 1);