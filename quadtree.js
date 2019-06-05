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
  constructor(boundary, n) {
    this.boundary = boundary;
    this.capacity = n;
    this.points   = [];
    this.divided  = false;
  }

  subdivide() {
    let x  = this.boundary.x,
        y  = this.boundary.y,
        w  = this.boundary.w,
        h  = this.boundary.h,
        ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2),
        nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2),
        se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2),
        sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);

    this.northeast = new QuadTree(ne, this.capacity);
    this.northwest = new QuadTree(nw, this.capacity);
    this.southeast = new QuadTree(se, this.capacity);
    this.southwest = new QuadTree(sw, this.capacity);
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
    stroke(strokeColor);
    noFill();
    strokeWeight(lineThickness);
    rectMode(CENTER);
    rect( this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2 );
    for (let p of this.points) {
      strokeWeight(pointThickness);
      point(p.x, p.y);
    }

    if (this.divided) {
      this.northeast.show();
      this.northwest.show();
      this.southeast.show();
      this.southwest.show();
    }
  }
}
