$(function () {
  var canvas = $("<canvas width='" + 500 +
                 "' height='" + 500 + "' style= 'background-color: #000000;'></canvas>");
  $('body').append(canvas);
  
  var scoreBoard = $("<div id='score' style='font-size: .9em; font-family: sans-serif;'></div>")
  $('body').append(scoreBoard);

  // `canvas.get(0)` unwraps the jQuery'd DOM element;
  new Game(500, 500, 10).start(canvas.get(0));
});