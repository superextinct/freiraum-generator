var Format = class Format {
  constructor (width, height, orientation) {
    this.width       = width;
    this.height      = height;
    this.orientation = orientation;
  }

  changeOrientation(to) {
    this.orientation = to;

    if (this.orientation == "p") {
      this.width  = Math.min(this.width, this.height);
      this.height = Math.max(this.height, this.height);
    } else if (this.orientation == "l") {
      this.width  = Math.max(this.width, this.width);
      this.height = Math.min(this.height, this.height);
    } else {
      return new Error("Orientierung kann nicht geändert werden. Bitte p für Portrait oder l für Landschaft angeben");
    }
  }

  fitIntoView (canvasWidth, canvasHeight) {
    let ratio  = canvasHeight/canvasWidth,
        width  = this.width.toPixel(),
        height = this.height.toPixel();

    if (height > canvasHeight) {
        width  = Math.round( width * (canvasHeight / height ));
        height = canvasHeight;
    }

    if (width > canvasWidth) {
      width  = canvasWidth;
      height = Math.round( height * (canvasWidth / width ));
    }

    this.computedWidth = width;
    this.computedHeight = height;

    // Skalierte Werte zurückgeben
    return { width, height };
  }
}
