
window.onload = function() {
    var stageW = 590, stageH = 300;
    var paper = Raphael("svg", stageW, stageH);
    var circle = paper
	    .circle(150, 100, 50)
            .attr({
		fill : '#4697D0',
		stroke: '#B1D2EB',
		'stroke-width': 6
	    });
    circle.animate({
	'cx': 400,
	'cy': 200
    }, 600, 'easeInOut');
    // paper.path('M200,200 L100,100 H200')
    // 	 .attr({
    // 	     'stroke': 'blue',
    // 	     'stroke-width': 4,
    // 	     'stroke-linecap': 'round',
    // 	     'stroke-linejoin': 'round'
    // 	 });
    paper.path('M100,100 L200,200')
// 	.animate({
// 	    path: 'L200,200'
// 	}, 600, function() {
// //	    this.path('L200,200');
// 	});
};