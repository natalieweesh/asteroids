$(function () {
  var canvas = $("<canvas width='" + 500 +
                 "' height='" + 500 + "' style= 'background-color: #000000'></canvas>");
  $('body').append(canvas);

  // `canvas.get(0)` unwraps the jQuery'd DOM element;
  new Game(500, 500, 10).start(canvas.get(0));
});