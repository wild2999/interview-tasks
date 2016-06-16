/**
 * @author Igor Lishchuk
 *
 *
 */


(function () {


    /**
     *
     * @type {{DEFAULTS: {CANVAS_WIDTH: number, CANVAS_HEIGHT: number}}}
     */
    var CONFIG = {
        DEFAULTS: {
            CANVAS_WIDTH : 900,
            CANVAS_HEIGHT : 500
        }
    };

    var graph = {};

    /**
     *
     * Creates an instance of graph.Canvas.
     *
     * @constructor
     * @this {graph.Canvas}
     * @param {String} id The id of the canvas
     * @param {Number} w The width of the canvas
     * @param {Number} h The height of the canvas
     */

    graph.Canvas = function (id, w, h) {

        var canvas = document.createElement('canvas'),
            width = w,
            height = h;

        canvas.id = id;
        canvas.width = width;
        canvas.height = height;


        /**
         * Get canvas element from the DOM.
         *
         * @return {DOMElement} The DOM element
         */
        this.getCanvas = function () {
            return canvas;
        };

        /**
         * Get the width of the canvas
         *
         * @return {Number} The width of the canvas
         */
        this.getWidth = function () {
            return width;
        };

        /**
         * Get the height of the canvas
         *
         * @return {Number} The height of the canvas
         */
        this.getHeight = function () {
            return height;
        };

        document.body.appendChild(canvas);

    };

    /**
     *
     * Creates an instance of graph.Brush.
     *
     * @constructor
     * @this {graph.Brush}
     * @param {Function} canvas The DOM element
     * @param {Function} width The width of the canvas
     * @param {Function} height The height of the canvas
     */
    graph.Brush = function (canvas, width, height) {
        this.canvas = canvas();
        this.width = width();
        this.height = height();
    };

    /**
     *
     * Inherit values and methods ​​from the class rabbit animal class
     *
     * @type {Canvas}
     */
    graph.Brush.prototype = Object.create(graph.Canvas.prototype);
    /**
     * Write constructor clearly
     *
     * @type {Brush}
     */
    graph.Brush.prototype.constructor = graph.Brush;

    /**
     * Draw a graph
     *
     * @this {graph.Brush}
     * @param array Array with points
     */
    graph.Brush.prototype.draw = function (array) {
        var i;

        var axes = {}, ctx = this.canvas.getContext("2d");
        axes.y0 = .5 * this.height;

        ctx.clearRect(0,0, this.width , this.height);

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';

        for (i = 0; i < array.length; i += 1) {
            var x = i * this.width / 100;
            var y = array[i] + axes.y0;


            ctx.lineTo(x, y);
        }
        ctx.stroke();
    };

    /**
     *
     * Creates an instance of graph.Coord.
     *
     * @constructor
     * @this {graph.Coord}
     * @param url The url for ajax-request
     */

    graph.Coord = function (url) {
        /**
         * Do ajax request using promise
         *
         * @return {Promise}
         */
        var ajax = function () {
            return new Promise(function (resolve, reject) {

                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);

                xhr.onload = function () {
                    if (this.status == 200) {
                        resolve(JSON.parse(this.response));
                    } else {
                        var error = new Error(this.statusText);
                        error.code = this.status;
                        reject(error);
                    }
                };

                xhr.onerror = function () {
                    reject(new Error("Network Error"));
                };

                xhr.send();
            });
        };

        /**
         *
         * @returns {ajax}
         * @private
         */
        this._getAjaxFunc = function () {
            return ajax;
        };
    };

    /**
     *
     * @type {Canvas}
     */
    var canvas = new graph.Canvas('graph', CONFIG.DEFAULTS.CANVAS_WIDTH, CONFIG.DEFAULTS.CANVAS_HEIGHT);

    /**
     *
     * @type {Brush}
     */
    var brush = new graph.Brush(canvas.getCanvas, canvas.getWidth, canvas.getHeight);

    /**
     *
     * @type {Coord}
     */
    var config = new graph.Coord('/api/v1/config');

    /**
     *
     * @type {Coord}
     */
    var coord = new graph.Coord('/api/v1/points');

    graph.init = function () {
        var interval = (config._getAjaxFunc())()
                            .then(function (response) {
                                return response.POINTS.UPDATE_INTERVAL;
                            });
        
        setInterval(function () {
            (coord._getAjaxFunc())()
                .then(function (response) {
                    brush.draw(response);
                }, function (error) {
                    return console.log("Rejected: " + error);
                })
        }, interval);
    };

    graph.init();
})();

