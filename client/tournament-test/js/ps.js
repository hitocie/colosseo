
var path = new Path();
path.strokeColor = "black";
var start = new Point(100, 500), length = start;
path.moveTo(start);

var path2 = new Path();
path2.strokeColor = "blue";
var start2 = new Point(150, 500), length2 = start2;
path2.moveTo(start2);

var onFrame = function(event) {
    var cnt = event.count * 5;
    if (cnt <= 50) {
	path.lineTo(length + [0, -cnt]);
	path2.lineTo(length2 + [0, -cnt]);
    }
};

// var path2 = new Path.Circle(view.center, 30);
// path2.strokeColor = "black";
// function onResize(event) {
//     path2.position = view.center;
// }