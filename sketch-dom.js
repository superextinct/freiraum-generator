/* Optionen */
const scaleFactor    = 12;
const bgColor        = 235;
const strokeColor    = 0;
const pointThickness = 2;
const padding        = 10;

let canvasWidth    = 600;
let canvasHeight   = 800;
let lineThickness  = 1;

/* Formate */
let a8 = new Format(7.4 , 5.2 , "l"),
    a7 = new Format(10.5, 7.4 , "l"),
    a6 = new Format(14.8, 10.5, "l"),
    a5 = new Format(14.8, 21  , "p"),
    a4 = new Format(21  , 29.7, "p"),
    a3 = new Format(29.7, 42  , "p"),
    a2 = new Format(42  , 59.4, "p");

/* Master QuadTree */
let qtree, dimension;

/* Pixel und MM Konvertierung */
Number.prototype.toPixel = function() {
  return Math.round(this.valueOf() * scaleFactor);
};

Number.prototype.toMm = function() {
  return this.valueOf() / scaleFactor;
};

window.onload = function() {
  setup();
};

function setup() {
  let size = a3,
      canvas = document.getElementById("format");

  paper.setup(canvas);

  dimension = size.fitIntoView(canvasWidth, canvasHeight);
  canvasWidth = Math.min(size.computedWidth, canvasWidth);
  canvasHeight = Math.min(size.computedHeight, canvasHeight);

  document.querySelector("#format").style.width = canvasWidth + padding * 2 + "px";
  document.querySelector("#format").style.height = canvasHeight + padding * 2 + "px";

  let boundary = new Rectangle(dimension.width / 2 + padding, dimension.height / 2 + padding, dimension.width / 2, dimension.height / 2);
  qtree = new QuadTree(boundary, 6, 1, "#format");

  console.log(boundary);

  for (let i =0; i < 100; i++) {
    let x = Math.floor( Math.random() * dimension.width / 2 ) + dimension.width / 8,
        y = Math.floor( Math.random() * dimension.height / 2 ) + dimension.height / 8,
        p = new Point(x, y);
      qtree.insert(p);
  }

		paper.view.draw();
}

function draw() {
  background(bgColor);
  qtree.show();
}
