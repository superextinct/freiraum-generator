Number.prototype.toPixel = function() {
  return Math.round(this.valueOf() * scaleFactor);
};

shuffle = function(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

var ui = ui || {};

var a8 = new Format(7.4 , 5.2 , "l"),
    a7 = new Format(10.5, 7.4 , "l"),
    a6 = new Format(14.8, 10.5, "l"),
    a5 = new Format(14.8, 21  , "p"),
    a4 = new Format(21  , 29.7, "p"),
    a3 = new Format(29.7, 42  , "p"),
    a2 = new Format(42  , 59.4, "p");

var size = a3;

const scaleFactor = 10;
const colors = [
  {
    name: 'White',
    hex: '#fff',
    cmyk: [0, 0, 0, 0]
  },
  {
    name: 'Sunset Orange',
    hex: '#fd533d',
    cmyk: [0, 78, 72, 0]
  },
  {
    name: 'Neon Carrot',
    hex: '#fe9a36',
    cmyk: [0, 48, 81, 0]
  },
  {
    name: 'Gorse',
    hex: '#ffed4f',
    cmyk: [3, 0, 76, 0]
  },
  {
    name: 'Martinique',
    hex: '#2b304e',
    cmyk: [90, 80, 40, 40]
  },
  {
    name: 'Casal',
    hex: '#2e696d',
    cmyk: [80, 37, 46, 27]
  },
  {
    name: 'Mountain Meadow',
    hex: '#24c17b',
    cmyk: [70, 0, 70, 0]
  },
  {
    name: 'Persian Blue',
    hex: '#3519c2',
    cmyk: [92, 83, 0, 0]
  },
  {
    name: 'Royal Blue',
    hex: '#4959ee',
    cmyk: [82, 67, 0, 0]
  },
  {
    name: 'Stone Wood',
    hex: '#4959ee',
    cmyk: [35, 37, 44, 18]
  },
  {
    name: 'Cascade',
    hex: '#93aaad',
    cmyk: [46, 23, 28, 4]
  },
  {
    name: 'Lola',
    hex: '#d9d1d9',
    cmyk: [17, 18, 10, 0]
  },
  {
    name: 'Peach Ice',
    hex: '#f3d4d4',
    cmyk: [3, 21, 12, 0]
  },
  {
    name: 'White Rock',
    hex: '#ede6d8',
    cmyk: [8, 5, 21, 0]
  }
];

const blockNums = {
  high: 12,
  medium: 3,
  low: 1
};

const sequences = {
  fibonacci: [1, 1, 2, 3, 5, 8, 13, 24, 57, 81],
  triangular: [1, 3, 6, 10, 15, 21, 28, 36, 45],
  square: [1, 4, 9, 16, 25, 36, 49, 64, 81],
  pentagonal: [1, 5, 12, 22, 35, 51, 70, 92],
  listmerge: [1, 3, 5, 9, 11, 14, 17, 25, 27]
};

var app = {
  init: () => {
    app.el = {
      canvas: $("#format")[0],
      fabric: $("#fabric")[0]
    };

    app.fabric = new fabric.Canvas('fabric');
    app.fabric.selectionColor = "rgba(0,0,0,0)";
    app.fabric.selectionBorderColor = "rgba(0,0,0,0)";
    app.fabric.selectionLineWidth = 0;

    window.addEventListener("keydown", (e) => {
      if(e.keyCode === 8) {
        var active = app.fabric.getActiveObject();
        app.fabric.remove(active);
        active.parent.hasChild = false;
      }
    });

    app.fabric.on("mouse:over", (e) => {
      if(!e.target.text) {
        e.target.set("fill", "#eaeaea");
        app.fabric.renderAll();
      }
    });

    $("#textfields").css({
      width:  size.width.toPixel(),
      height: size.height.toPixel()
    });

    app.fabric.on("mouse:out", (e) => {
      if(!e.target.text) {
        var hoverColor = ui.colorselect ? colors[ui.colorselect].hex : "#fff";
        e.target.set("fill", hoverColor);
        app.fabric.renderAll();
      }
    });

    app.fabric.on("mouse:down", (e) => {
      if(!e.target.text && !e.target.hasChild) {
        var color = ui.colorselect ? colors[ui.colorselect].hex : "#fff";
        e.target.set("fill", color);
        app.fabric.renderAll();
      }
    });

    app.fabric.on("mouse:up", (e) => {
      if(!e.target.text && !e.target.hasChild) {
        app.createTextField(e.target.left, e.target.top, e.target.width, e.target.height, e.target);
        e.target.hasChild = true;
      }
    });

    if (!app.el.canvas.getContext)
      return false;

    app.el.draw = app.el.canvas.getContext("2d");
    app.run();
  },
  run: () => {
    var blocks = shuffle(app.blocks);

    if (ui.blockselect) {
      var limit = Math.floor(blockNums[ui.blockselect] + Math.random() * 2);
      limit = (limit > 1) ? limit : 1;
      blocks = blocks.slice(0, limit);
      shuffle(blocks);
      console.log("slice", blocks);
    }

    var packer = app.packer();

    app.grid = [];

    app.sort.now(blocks);
    app.fabric.remove(...app.fabric.getObjects());
    packer.fit(blocks);

    app.canvas.reset(packer.root.w, packer.root.h);
    app.canvas.blocks(blocks);
    app.canvas.boundary(packer.root);
    app.report(blocks, packer.root.w, packer.root.h);
  },
  packer: () => {
    size = a3;
    if (size == 'automatic') {
      return new GrowingPacker();
    }
    else {
      var w = size.width * scaleFactor,
          h = size.height * scaleFactor;
      return new Packer(parseInt(w), parseInt(h));
    }
  },
  createTextField: (x, y, w, h, parent) => {
    var text = new fabric.Textbox("Titel", {
      left: x + 10,
      top: y + 10,
      width: w - 20,
      height: h - 20,
      fontSize: 20,
      fontFamily: "Inter Work",
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true
    });
    app.fabric.add(text);
    text.parent = parent;

    console.log(text);/*
    var textField = $("<textarea>");
    textField.css({
      left: x + 10,
      top: y + 10,
      width: w - 20,
      height: h - 20
    });
    $("#textfields").append(textField);*/
  },
  report: (blocks, w, h) => {
    var fit = 0, nofit = [], layout = [], block, n, len = blocks.length;
    for (n = 0 ; n < len ; n++) {
      block = blocks[n];
      if (block.fit) {
        fit = fit + block.area;
        layout.push("" + block.w + "x" + block.h);
      } else {
        nofit.push("" + block.w + "x" + block.h);
      }
    }

    console.log("Did not fit (" + nofit.length + ") :\n" + nofit.join(", "));
    app.previousLayout = layout;
  },
  sort: {
    random  : (a,b) => { return Math.random() - 0.5; },
    w       : (a,b) => { return b.w - a.w; },
    h       : (a,b) => { return b.h - a.h; },
    a       : (a,b) => { return b.area - a.area; },
    max     : (a,b) => { return Math.max(b.w, b.h) - Math.max(a.w, a.h); },
    min     : (a,b) => { return Math.min(b.w, b.h) - Math.min(a.w, a.h); },
    height  : (a,b) => { return app.sort.msort(a, b, ['h', 'w']);               },
    width   : (a,b) => { return app.sort.msort(a, b, ['w', 'h']);               },
    area    : (a,b) => { return app.sort.msort(a, b, ['a', 'h', 'w']);          },
    maxside : (a,b) => { return app.sort.msort(a, b, ['max', 'min', 'h', 'w']); },
    msort   : (a, b, criteria) => {
      var diff, n;
      for (n = 0 ; n < criteria.length ; n++) {
        diff = app.sort[criteria[n]](a,b);
        if (diff != 0)
          return diff;
      }
      return 0;
    },
    now: (blocks) => {
      var sort = (ui.sorting) ? ui.sorting : "random";
      console.log(sort);
      if (sort != 'none')
        blocks.sort(app.sort[sort]);
    }
  },
  canvas: {
    reset: (width, height) => {
      app.el.canvas.width  = width  + 4; // Linienstrichstärke hinzufügen für scharfe Kanten
      app.el.canvas.height = height + 4; // (dito)
      app.fabric.setDimensions( {
        width: width + 4,
        height: height + 4
      });
      app.el.draw.clearRect(0, 0, app.el.canvas.width, app.el.canvas.height);
    },
    rect:  (x, y, w, h) => {
      app.el.draw.strokeRect(x + 2, y + 2, w, h);
    },
    stroke: (x, y, w, h) => {
      app.el.draw.strokeRect(x + 2, y + 2, w, h);
      var fillColor = ui.colorselect ? colors[ui.colorselect].hex : "#fff";

      var rect = new fabric.Rect({
        width: w,
        height: h,
        fill: fillColor,
        left: x,
        top: y,
        hasControls: false,
        hoverCursor: "cell",
        selectable: false,
        lockMovementY: true,
        lockMovementX: true
      });
      app.fabric.add(rect);
      app.fabric.moveTo(rect, 10000-(w*h/100));

      app.grid.push({x, y, w, h});
    },
    blocks: (blocks) => {
      var n, block;
      for (n = 0 ; n < blocks.length ; n++) {
        block = blocks[n];
        if (block.fit)
          app.el.draw.lineWidth = 4;
          if(Number.isInteger(block.fit))
            app.canvas.rect(block.fit.x, block.fit.y, block.w, block.h);
      }
    },
    boundary: (node) => {
      if (node) {
        app.canvas.stroke(node.x, node.y, node.w, node.h);
        app.canvas.boundary(node.down);
        app.canvas.boundary(node.right);
      }
    },
    intersects: (a, b) => {
      return !(
        a.x - a.w > b.x + b.w ||
        a.x + a.w < b.x - b.w ||
        a.y - a.h > b.y + b.h ||
        a.y + a.h < b.y - b.h
      );
    }
  },
  blocks: [
    {w: size.width.toPixel() / 3    , h: size.width.toPixel() / 3 * 1.5, num: Math.floor(Math.round() * (ui.sequence) ? ui.sequence[0] : sequences.fibonacci[0])},
    {w: size.width.toPixel() / 3    , h: size.width.toPixel() / 3 * 2  , num: Math.floor(Math.round() * (ui.sequence) ? ui.sequence[1] : sequences.fibonacci[1])},
    {w: size.width.toPixel() / 3 * 2, h: size.width.toPixel() * 0.25   , num: Math.floor(Math.round() * (ui.sequence) ? ui.sequence[2] : sequences.fibonacci[2])},
    {w: size.width.toPixel() / 3 * 2, h: size.width.toPixel() * 2      , num: Math.floor(Math.round() * (ui.sequence) ? ui.sequence[3] : sequences.fibonacci[3])},
    {w: size.width.toPixel() / 2    , h: size.width.toPixel()          , num: Math.floor(Math.round() * (ui.sequence) ? ui.sequence[4] : sequences.fibonacci[4])},
    {w: size.width.toPixel() / 2    , h: size.width.toPixel() / 3 * 2  , num: Math.floor(Math.round() * (ui.sequence) ? ui.sequence[5] : sequences.fibonacci[5])},
    {w: size.width.toPixel() / 2    , h: size.width.toPixel() / 2      , num: Math.floor(Math.round() * (ui.sequence) ? ui.sequence[6] : sequences.fibonacci[6])},
    {h: size.width.toPixel() / 3    , h: size.height.toPixel()         , num: Math.floor(Math.round() * (ui.sequence) ? ui.sequence[7] : sequences.fibonacci[7])}
  ]
};
