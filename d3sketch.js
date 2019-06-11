/* Optionen */
const scaleFactor    = 12;
const bgColor        = 235;
const strokeColor    = 0;
const pointThickness = 2;
const padding        = 10;
const svg            = d3.select("svg");
const rows           = 3;

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

var seeded = false,
    previous = false,
    level = 1;

Methods = {};
Methods.random = function(min, max) {
  var rand;

  if (seeded) {
    rand = lcg.rand();
  } else {
    rand = Math.random();
  }
  if (typeof min === 'undefined') {
    return rand;
  } else if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max - min) + min;
  }
};

Methods.randomGaussian = function(mean, sd) {
  var y1, x1, x2, w;
  if (previous) {
    y1 = y2;
    previous = false;
  } else {
    do {
      x1 = Methods.random(2) - 1;
      x2 = Methods.random(2) - 1;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt(-2 * Math.log(w) / w);
    y1 = x1 * w;
    y2 = x2 * w;
    previous = true;
  }

  var m = mean || 0;
  var s = sd || 1;
  return y1 * s + m;
};


function setup() {
  let size = a4;

  dimension = size.fitIntoView(canvasWidth, canvasHeight);
  canvasWidth = Math.min(size.computedWidth, canvasWidth);
  canvasHeight = Math.min(size.computedHeight, canvasHeight);

  var random = Math.random,
      chance = [Math.round(random()*5), Math.round(random()*2), Math.round(random()*4), Math.round(random()*6), Math.round(random()*2), Math.round(random()*3), Math.round(random()*8), Math.round(random()*2), Math.round(random()*3) ]
      width  = height = Math.round(canvasHeight / rows),
      cols   = Math.round(canvasWidth / width),
      root   = [];

      console.log(canvasHeight + padding * 2);

  document.querySelector("#format").style.width = canvasWidth + padding + "px";
  document.querySelector("#format").style.height = canvasHeight + padding * 2 + "px";

  var i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      var startX = padding + width * c,
          startY = padding + height * r,
          data = d3.range(Math.round(random() * random() * 3 + 1)).map(function() { return [random() * width, random() * height]; });

      var quadtree = d3.quadtree()
          .extent([[0,0], [width, height]])
          .addAll(data);

      var svg = d3.select("#format").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", (d) => { return "cell"+r+"-"+c; })
        .style("left", startX)
        .style("top", startY)

      var group = svg.append("g")
        .attr("class", "inner")
        .attr("id", "g-" + (r * i + c + 1))
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("vector-effect", "non-scaling-stroke");

      group.selectAll(".node")
        .data(nodes(quadtree))
        .enter().append("rect")
          .attr("class", "node")
          .attr("x", (d) => { return d.x0; })
          .attr("y", (d) => { return d.y0; })
          .attr("vector-effect", "non-scaling-stroke")
          .attr("width", (d) => { return d.y1 - d.y0; })
          .attr("height", (d) => { return d.x1 - d.x0; })
          .style("stroke-width", (d) => {
            if(d.y1 - d.y0 < width * 0.8) {
              if (d.y1 - d.y0 < width * 0.4)
                return 1;

              return 1.5;
            }
          });

      root.push(svg);
      i++;
    }
  }
  console.log(i);

  for (let k = 0; k<i; k++) {
    root[k].selectAll(".node")
      .each( (d, i) => {
        console.log(d);
        if(d.x1 < width / 2 || d.y1 < height / 2) {
          root[k].selectAll(".node").filter(":nth-child("+i+")")
            .style("stroke", "teal")
            .style("stroke-width", 1.5);
        } else if (d.x1 > width) {
          root[k].selectAll(".node").filter(":nth-child("+i+")")
            .style("stroke", "red")
            .style("stroke-width", 1.5);
        } else if (d.x1 < width / 3) {
          root[k].selectAll(".node").filter(":nth-child("+i+")")
            .style("stroke", "yellow")
            .style("stroke-width", 1.5);
        }
      });
  }
}

function gridData() {
    var data = new Array();
    let xpos = padding, //starting xpos and ypos at 1 so the stroke will show when we make the grid belo
        ypos = padding,
        width = height = Math.round(canvasHeight / rows),
        cols = Math.round(canvasWidth / width);

    // iterate for rows
    for (var row = 0; row < rows; row++) {
        data.push( new Array() );

        // iterate for cells/columns inside rows
        for (var column = 0; column < cols; column++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height
            })
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += width;
        }
        // reset the x position after a row is complete
        xpos = padding;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += height;
    }
    return data;
}

function nodes(quadtree) {
  var nodes = [];
  quadtree.visit( (node, x0, y0, x1, y1) => {
    node.x0 = x0, node.y0 = y0;
    node.x1 = x1, node.y1 = y1;
    nodes.push(node);
  });

  return nodes;
}
setup();
