function Graph() {}

Graph.modules = {};

Graph.modules.draw = function (array) {
    var canvas = document.getElementById('graph'),
        i;
    if (null == canvas || !canvas.getContext) return;
    var axes = {}, ctx = canvas.getContext("2d");
    axes.y0 = .5 * canvas.height;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';

    for(i = 0; i < array.length; i += 1) {
        var x = i * canvas.width / 100;
        var y = array[i] + axes.y0;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
};

Graph.modules.ajaxForPoints = function () {
    $.ajax({
        url: '/api/v1/points',
        method: 'GET',
        success: function (data) {
            if (data) {
                Graph.modules.draw(data);
            }
        }
    });
};

Graph.modules.init = (function () {
    Graph.modules.ajaxForPoints();
})();

