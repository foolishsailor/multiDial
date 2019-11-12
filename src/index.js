const multiDial = function({
  container = "multidial",
  numberDials = 1,
  radius = 40,
  multiDialOffset = 1,
  individualDialOpts = [],

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
  defaultMaxValue = 100,
  defaultMinValue = 0,
  defaultColorSchedule = function(value){
    switch(true){
      case value < 25:
        return 'blue';
      case value >= 25 && value < 50:
        return 'green';
      case value >= 50 && value < 75:
        return 'yellow';
      case value >= 75:
          return 'red';
    }
  },

  label = function(val) {
    return Math.round(val);
  }
}) {

  /**
   * Normalizes the angle to between 0 and 359
   * @param {Nnteger} value - angle
   * @return {number} - Normalized angle
   */
  const normalizeAngle = value => {
    if (value >= 0 && value < 360) return value;
    if (value > 359) return value - 360;
    if (value < 0) return 360 + value;
  };

  const SVG_ORIG = "http://www.w3.org/2000/svg";

  let _container = document.getElementById(container),
    dials = [];

  /**
   * Creates SVG DOM element - including nesting dials, text etc.  Returns single SVGElement
   * @param {String} tag The SVG element type name
   * @param {Object} opts The svg attributes 
   * @param {Array} nestedDials An array of nested dials or text
   * @return {SVGElement} The SVG element
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

   /**
    * Checks if user has entered a custom value for a given property on a given dial
   * If not then default value applied
    * @param {Objectr} opts - User created options for each dial
    * @param {String} prop - Property to check
    * @param {*} defaultProp - Default property to apply
    */
  const checkUserProp = (opts, prop, defaultProp) => {
    return opts &&
    opts.hasOwnProperty(prop)
      ? opts[prop]
      : defaultProp;
  };

  /**
   * Limits value generated to given min/max values set by user
   */
  const limitValue = (value, min, max) => {
    var val = Number(value);
    if (val > max) return max;
    if (val < min) return min;
    return val;
  };

  /**
   * Changes given value to percentage based on min / max
   */
  const getValueInPercentage = (value, min, max) => {
    var newMax = max - min,
      newVal = value - min;
    return (100 * newVal) / newMax;
  };

  /**
   * Gets cartesian points for a specified radius and angle (in degrees)
   * @param {Number} centerX  The center x coord
   * @param {Number} centerY  The center y coord
   * @param {Number} radius  The radius of the circle
   * @param {Number} angle The angle in degrees
   * @return {Object} An object with x,y coords
   */
  const getCartesianPoints = (centerX, centerY, radius, angle) => {
    var rad = (angle * Math.PI) / 180;
    return {
      x: Math.round((centerX + radius * Math.cos(rad)) * 1000) / 1000,
      y: Math.round((centerY + radius * Math.sin(rad)) * 1000) / 1000
    };
  };

  /**
   * Takes in radius and start and end angles and returns x,y points for start and end of dial
   * @param {Number} radius radis of circle
   * @param {Number} startAngle angle of start point
   * @param {Number} endAngle andgle of end point
   * @return {Object} AN oject with x,y values for start and end points of dial
   */
  const getDialCoords = (radius, startAngle, endAngle) => {
    var cx = dialX,
      cy = dialY;
    return {
      end: getCartesianPoints(cx, cy, radius, endAngle),
      start: getCartesianPoints(cx, cy, radius, startAngle)
    };
  };

  /**
   * Generates the path string to draw an svg path of the dial radius.  Takes a flag to determeine 
   * if drawing the larger or smaller of a given arc on a circle
   * @param {Number} radius - radius of circle
   * @param {Number} startAngle - angle of start point
   * @param {Number} endAngle - angle of end point
   * @param {bool} useLargeArc - boolean the decide to use larger of two given arcs
   * @return {String} An svg path string 
   */
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

  /**
   * 
   * @param {object} options - Animation options
   * @param {number} options.duration - duration in seconds of anumation
   * @param {number} options.start - start angle of dial
   * @param {number} options.end - end angle of dial
   * @param {function} options.step - fucntion to execute on each anuimation step
   * @param {function} options.easing - function to execute for the type of easing
   */
  const animateDial = options => {
    let duration = options.duration,
      currentIteration = 1,
      iterations = 60 * duration,
      start = options.start || 0,
      end = options.end,
      change = end - start,
      step = options.step,
      easing =
        options.easing ||
        function easeInOutCubic(pos) {
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
    requestAnimationFrame(animate);
  };

  /**
   * Draws change in dial value
   * @param {Number} value - value to change to
   * @param {SVGElement} svg_text - Text svg element to update
   * @param {SVGElement} svg_path - Path svg element to update
   */
  const updateDial = (value, svg_text, svg_path) => {
    let newVal = getValueInPercentage(value, svg_path.minValue, svg_path.maxValue);
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
  
  /**
   * Updates color of dails based on value and colorSchedule
   * @param {Number} value - DIal or text value to change to
   * @param {Number} duration - Duration of animation
   * @param {SVGElement} ring - WHich dial to update
   */
  const setColor = (value, duration, ring) => {  
    let color = checkUserProp(ring, "colorSchedule", defaultColorSchedule)(value),      
      dur = duration * 1000,
        pathTransition = "stroke " + dur + "ms ease";
        // textTransition = "fill " + dur + "ms ease";

        ring.svg.style.stroke = color;
        ring.svg.style.transition = pathTransition;
    /*
    gaugeValueElem.style = [
      "fill: " + c,
      "-webkit-transition: " + textTransition,
      "-moz-transition: " + textTransition,
      "transition: " + textTransition,
    ].join(";");
    */
  }


  /**
   * Builds each dial and text assoicated with it.
   * Checks for dial specific options and if not found then reverts to global defaults set.
   * Creates object with SVGElement and all user options and adds it to the dial array
   */
  const initializeDial = () => {
    for (let i = 0; i < numberDials; i++) {
      //Check if custom values for dials exist otherwise use defaults
      let orientation = checkUserProp(individualDialOpts[i], "orientation", defaultOrientation) - 90;
      let stroke = checkUserProp(individualDialOpts[i], "stroke", defaultStroke);
      let color = checkUserProp(individualDialOpts[i], "color", defaultColor);
      let arc = checkUserProp(individualDialOpts[i], "arc", defaultArc);
      let lineCap = checkUserProp(individualDialOpts[i], "lineCap", defaultLineCap);
      let minValue = checkUserProp(individualDialOpts[i], "minValue", defaultMinValue);
      let maxValue = checkUserProp(individualDialOpts[i], "maxValue", defaultMaxValue);
      let colorSchedule = checkUserProp(individualDialOpts[i], "colorSchedule", defaultColorSchedule);
  
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
          currentValue: ""          
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
          type: "background Path"
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
          minValue: minValue,
          maxValue: maxValue,
          colorSchedule: colorSchedule
        };

      dials.push(dialText, dialPath, dialCurrent);
    }

    let dialComplete = buildSVG({
      tag: "svg",
      opts: {
        viewBox: viewBox || "0 0 100 100",
        class: dialComponentClass
      },
      nestedDials: dials.map(e => e.svg)
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
   * @param {double} duration - the duration in seconds of animate
   */
  this.setDialValue = (val, ring, animate, duration) => {
    console.log(`Dial: ${ring} - Value: ${val}`);
    let svg_text = dials[3 * ring],
      svg_path = dials[3 * ring + 2],
      value = limitValue(val, svg_path.minValue, svg_path.maxValue);

    if (defaultColor) {
      setColor(value, duration, svg_path);
    }

    if (animate) {
      animateDial({
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

//AMD Support
if (typeof define === "function" && define.amd)
  define(function() {return multiDial;});

//CommonJS Support
 if (typeof module === "object" && module.exports)
  module.exports = multiDial;


  
  
  

