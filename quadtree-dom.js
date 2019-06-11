class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x <  this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <  this.y + this.h
    );
  }

  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

class QuadTree {
  constructor(boundary, n, zoom, parent) {
    this.boundary = boundary;
    this.capacity = n;
    this.points   = [];
    this.divided  = false;
    this.zoom = zoom;
    this.parent = parent;
  }

  subdivide() {
    let x  = this.boundary.x,
        y  = this.boundary.y,
        w  = this.boundary.w,
        h  = this.boundary.h;

    let ne = new Rectangle(Math.round(x + w / 2), Math.round(y - h / 2), Math.round(w / 2), Math.round(h / 2)),
        nw = new Rectangle(Math.round(x - w / 2), Math.round(y - h / 2), Math.round(w / 2), Math.round(h / 2)),
        se = new Rectangle(Math.round(x + w / 2), Math.round(y + h / 2), Math.round(w / 2), Math.round(h / 2)),
        sw = new Rectangle(Math.round(x - w / 2), Math.round(y + h / 2), Math.round(w / 2), Math.round(h / 2));

    this.zoom = this.zoom + 1;
    this.northeast = new QuadTree(ne, this.capacity, this.zoom, "#cell" + Math.round((x+w/2)) + "-" + Math.round((y-h/2)));
    this.northwest = new QuadTree(nw, this.capacity, this.zoom, "#cell" + Math.round((x-w/2)) + "-" + Math.round((y-h/2)));
    this.southeast = new QuadTree(se, this.capacity, this.zoom, "#cell" + Math.round((x+w/2)) + "-" + Math.round((y+h/2)));
    this.southwest = new QuadTree(sw, this.capacity, this.zoom, "#cell" + Math.round((x-w/2)) + "-" + Math.round((y+h/2)));
    this.divided   = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided)
        this.subdivide();

      if (this.northeast.insert(point)) {
        return true;
      } else if (this.northwest.insert(point)) {
        return true;
      } else if (this.southeast.insert(point)) {
        return true;
      } else if (this.southwest.insert(point)) {
        return true;
      }
    }
  }

  query(range, found) {
    if (!found)
      found = [];

    if (!this.boundary.intersects(range)) {
      return;
    } else {
      for (let p of this.points) {
        if (range.contains(p))
          found.push(p);
      }

      if (this.divided) {
        this.northwest.query( range, found );
        this.northeast.query( range, found );
        this.southwest.query( range, found );
        this.southeast.query( range, found );
      }
    }
    return found;
  }

  show() {
    var rectangle = new Rectangle(new Point(this.boundary.x, this.boundary.y), new Size(width, height));
    var path = new Path.Rectangle(rectangle);
    path.strokeColor = "#000";
    path.strokeWidth = 2;

  /*  var svg = d3.select("#"+this.svg);
    var nodes = svg.append("rect")
      .attr("class", "node")
      .attr("x", (d) => { return 2; })
      .attr("y", this.boundary.y)
      .attr("width", this.boundary.w)
      .attr("height", this.boundary.h);

    var point = svg.selectAll(".point")
      .data(this.points)
      .enter().append("circle")
        .attr("class", "point")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 2);*/

    if (this.divided) {
      this.northeast.show();
      this.northwest.show();
      this.southeast.show();
      this.southwest.show();
    }
  }
}
