/* Optionen */
const canvasWidth    = 600;
const canvasHeight   = 800;
const scaleFactor    = 10;
const bgColor        = 255;
const strokeColor    = 0;
const lineThickness  = 4;
const pointThickness = 2;
const padding        = 10;

/* Formate */
let a8 = new Format(7.4 , 5.2 , "l"),
    a7 = new Format(10.5, 7.4 , "l"),
    a6 = new Format(14.8, 10.5, "l"),
    a5 = new Format(14.8, 21  , "p"),
    a4 = new Format(21  , 29.7, "p"),
    a3 = new Format(29.7, 42  , "p"),
    a2 = new Format(42  , 59.4, "p");

/* Master QuadTree */
let qtree;

/* Pixel und MM Konvertierung */
Number.prototype.toPixel = function() {
  return this.valueOf() * scaleFactor;
}

Number.prototype.toMm = function() {
  return this.valueOf() / scaleFactor;
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(bgColor);

  let size      = a3,
      dimension = size.fitIntoView(canvasWidth, canvasHeight);
      boundary  = new Rectangle(dimension.width + padding, dimension.height + padding, dimension.width, dimension.height);

  qtree = new QuadTree(boundary, 4);

  for (let i =0; i < 100; i++) {
    let x = randomGaussian(dimension.width / 2 + padding, dimension.width / 8 + padding),
        y = randomGaussian(dimension.height / 2 + padding, dimension.height / 8 + padding),
        p = new Point(x, y);
      qtree.insert(p);
  }
}

function draw() {
  background(bgColor);
  qtree.show();
}
