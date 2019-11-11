export const multiDial = function({
  container = "multidial",
  numberDials = 1,
  radius = 30,
  multiDialOffset = 1,
  individualDialOpts = [],

  max = 100,
  min = 0,
  dialX = 50,
  dialY = 50,
  dialComponentClass = "dial-component",
  dialPathClass = "dial-path",
  dialTextClass = "dial-text",
  dialCurrentClass = "dial-current",
  viewBox = "0 0 100 100",

  //defaults for all dials if individual values not set
  defaultColor = "#ffffff",
  defaultStroke = 2,
  defaultInitialValue = 0,
  defaultLineCap = "round", //[round | butt | square]
  defaultArc = 300,
  defaultOrientation = 0,

  label = function(val) {
    return Math.round(val);
  }
}) {
  const normalizeAngle = value => {
    if (value >= 0 && value < 360) return value;
    if (value > 359) return value - 360;
    if (value < 0) return 360 + value;
  };

  const SVG_ORIG = "http://www.w3.org/2000/svg";

  let _container = document.getElementById(container),
    _dials = [];

  //normalize orientation from x axis to yasix 'up'
  defaultOrientation = defaultOrientation - 90;

  /**
   * A utility function to create SVG dom tree
   * @param {String} name The SVG element name
   * @param {Object} attrs The attributes as they appear in DOM e.g. stroke-width and not strokeWidth
   * @param {Array} children An array of children (can be created by this same function)
   * @return The SVG element
   */
  const buildSVG = ({ tag, opts, nestedDials }) => {
    let svg = document.createElementNS(SVG_ORIG, tag);

    for (var opt in opts) {
      svg.setAttribute(opt, opts[opt]);
    }

    if (nestedDials) {
      nestedDials.forEach(function(dial) {
        svg.appendChild(dial);
      });
    }

    return svg;
  };

  /**
   * Translates percentage value to angle. e.g. If gauge span angle is 180deg, then 50%
   * will be 90deg
   */
  const getAngle = (percentage, arcAngle) => {
    return (percentage * arcAngle) / 100;
  };

  const normalize = (value, min, max) => {
    var val = Number(value);
    if (val > max) return max;
    if (val < min) return min;
    return val;
  };

  const getValueInPercentage = (value, min, max) => {
    var newMax = max - min,
      newVal = value - min;
    return (100 * newVal) / newMax;
  };

  /**
   * Gets cartesian points for a specified radius and angle (in degrees)
   * @param centerX {Number} The center x co-oriinate
   * @param centerY {Number} The center y co-ordinate
   * @param radius {Number} The radius of the circle
   * @param angle {Number} The angle in degrees
   * @return An object with x,y co-ordinates
   */
  const getCartesianPoints = (
    centerX,
    centerY,
    radius,
    angle,
    strokeOffset
  ) => {
    var rad = (angle * Math.PI) / 180;
    return {
      x: Math.round((centerX + radius * Math.cos(rad)) * 1000) / 1000,
      y: Math.round((centerY + radius * Math.sin(rad)) * 1000) / 1000
    };
  };

  const getDialCoords = (radius, startAngle, endAngle) => {
    var cx = dialX,
      cy = dialY;
    return {
      end: getCartesianPoints(cx, cy, radius, endAngle),
      start: getCartesianPoints(cx, cy, radius, startAngle)
    };
  };

  const pathString = (radius, startAngle, endAngle, useLargeArc) => {
    var coords = getDialCoords(radius, startAngle, endAngle),
      start = coords.start,
      end = coords.end,
      largeArcFlag = typeof useLargeArc === "undefined" ? 1 : useLargeArc;

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      end.x,
      end.y
    ].join(" ");
  };

  const Animation = options => {
    var duration = options.duration,
      currentIteration = 1,
      iterations = 60 * duration,
      start = options.start || 0,
      end = options.end,
      change = end - start,
      step = options.step,
      easing =
        options.easing ||
        function easeInOutCubic(pos) {
          // https://github.com/danro/easing-js/blob/master/easing.js
          if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3);
          return 0.5 * (Math.pow(pos - 2, 3) + 2);
        };

    function animate() {
      let progress = currentIteration / iterations,
        value = change * easing(progress) + start;
      step(value, currentIteration);
      currentIteration += 1;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    // start!
    requestAnimationFrame(animate);
  };

  const updateDial = (value, svg_text, svg_path) => {
    let newVal = getValueInPercentage(value, min, max);
    let angle =
        svg_path.startAngle > svg_path.endAngle
          ? normalizeAngle(
              getAngle(
                newVal,
                360 - Math.abs(svg_path.startAngle - svg_path.endAngle)
              )
            )
          : normalizeAngle(
              getAngle(
                newVal,
                Math.abs(svg_path.startAngle - svg_path.endAngle)
              )
            );

    // this is because we are using arc greater than 180deg
    let useLargeArc = angle <= 180 ? 0 : 1;

    svg_text.textContent = newVal;
    svg_path.svg.setAttribute(
      "d",
      pathString(
        svg_path.radius,
        svg_path.startAngle,
        angle + svg_path.startAngle,
        useLargeArc
      )
    );
  };

  const initializeDial = () => {
    for (let i = 0; i < numberDials; i++) {
      //Check if custom values for dials exist otherwise use defaults
      let orientation =
        individualDialOpts.length > i &&
        individualDialOpts[i].hasOwnProperty("orientation")
          ? individualDialOpts[i].orientation - 90
          : defaultOrientation;
      let stroke =
        individualDialOpts.length > i &&
        individualDialOpts[i].hasOwnProperty("stroke")
          ? individualDialOpts[i].stroke
          : defaultStroke;
      let color =
        individualDialOpts.length > i &&
        individualDialOpts[i].hasOwnProperty("color")
          ? individualDialOpts[i].color
          : defaultColor;
      let arc =
        individualDialOpts.length > i &&
        individualDialOpts[i].hasOwnProperty("arc")
          ? individualDialOpts[i].arc
          : defaultArc;
      let lineCap =
        individualDialOpts.length > i &&
        individualDialOpts[i].hasOwnProperty("lineCap")
          ? individualDialOpts[i].lineCap
          : defaultLineCap;

      let strokeOffset = individualDialOpts
        .slice(0, i)
        .map(e => {
          return e.hasOwnProperty("stroke") ? e.stroke : defaultStroke;
        })
        .reduce((a, c) => a + c, 0);

      let startAngle = normalizeAngle(orientation + (360 - arc) / 2);
      let endAngle = normalizeAngle(startAngle + arc);

      let angle = getAngle(100, 360 - Math.abs(startAngle - endAngle));
      let useLargeArc = startAngle < endAngle ? angle >= 180 ? 0 : 1 : angle <= 180 ? 0 : 1;
      let newRadius = radius - strokeOffset - multiDialOffset * i;

      let dialText = {
          svg: buildSVG({
            tag: "text",
            opts: {
              x: 50,
              y: 50,
              fill: "#999",
              class: dialTextClass,
              "font-size": "100%",
              "font-family": "sans-serif",
              "font-weight": "normal",
              "text-anchor": "middle",
              "alignment-baseline": "middle",
              "dominant-baseline": "central"
            }
          }),
          currentValue: "",
          index: i
        },
        dialPath = {
          svg: buildSVG({
            tag: "path",
            opts: {
              class: dialPathClass,
              fill: "none",
              stroke: "#666",
              "stroke-width": 2.5,
              d: pathString(newRadius, startAngle, startAngle) // value of 0
            }
          }),
          startAngle: startAngle,
          endAngle: endAngle,
          radius: newRadius,
          type: "background Path",
          index: i
        },
        dialCurrent = {
          svg: buildSVG({
            tag: "path",
            opts: {
              class: dialCurrentClass,
              fill: "none",
              stroke: color,
              "stroke-width": stroke,
              "stroke-linecap": lineCap,
              d: pathString(newRadius, startAngle, endAngle, useLargeArc)
            }
          }),
          startAngle: startAngle,
          endAngle: endAngle,
          radius: newRadius,
          currentValue: defaultInitialValue,
          type: "Current Value Path",
          index: i
        };

      _dials.push(dialText, dialPath, dialCurrent);
    }

    let dialComplete = buildSVG({
      tag: "svg",
      opts: {
        viewBox: viewBox || "0 0 100 100",
        class: dialComponentClass
      },
      nestedDials: _dials.map(e => e.svg)
    });

    _container.appendChild(dialComplete);
  };

  const init = () => {
    initializeDial();
  };

  init();

  /**
   *   PUBLIC FUNCTIONS
   *
   */

  /**
   * setDialValue
   *
   * Update the value of a given dial
   * @param {Number} val - the value to update the dial to
   * @param {Integer} ring - which of the nested dials to update 0 being outside ring
   * @param {boolean} animate - animate change
   * @param {double} duration - the duration in seconds of animation
   */
  this.setDialValue = (val, ring, animate, duration) => {
    console.log(`Dial: ${ring} - Value: ${val}`);
    let svg_text = _dials[3 * ring],
      svg_path = _dials[3 * ring + 2],
      value = normalize(val, min, max);

    if (defaultColor) {
      //setGaugeColor(value, duration, ring);
    }

    if (animate) {
      Animation({
        start: svg_path.currentValue || 0,
        end: value,
        duration: duration || 1,
        step: function(val, frame) {
          svg_path.currentValue = val;
          updateDial(val, svg_text, svg_path);
        }
      });
    } else {
      updateDial(val, svg_text, svg_path);
    }
  };
};
