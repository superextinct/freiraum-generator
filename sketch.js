var a10 = { w: 260, h: 37},
    a9 = { w: 350, h: 520};

/* Optionen */
const canvasWidth = 600;
const canvasHeight = 800;
const scaleFactor = 10;

/* Pixel und MM Konvertierung */
Number.prototype.toPixel = function() {
  return this.valueOf() * scaleFactor;
}

Number.prototype.toMm = function() {
  return this.valueOf() / scaleFactor;
}

function setup() {
  var a8 = new Format(5.2 , 7.4),
      a7 = new Format(7.4 , 10.5),
      a6 = new Format(10.5, 14.8),
      a5 = new Format(14.8, 21),
      a4 = new Format(21  , 29.7),
      a3 = new Format(29.7, 42),
      a2 = new Format(42  , 59.4);

}

function draw() {
  // put drawing code here
}
