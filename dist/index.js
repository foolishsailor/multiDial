module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/MultiDial.js":
/*!**************************!*\
  !*** ./src/MultiDial.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction MultiDial({\n  container = \"multidial\",\n  numberDials = 1,\n  radius = 40,\n  multiDialOffset = 1,\n  individualDialOpts = [],\n  dialX = 50,\n  dialY = 50,\n  dialComponentClass = \"dial-component\",\n  dialPathClass = \"dial-path\",\n  dialTextClass = \"dial-text\",\n  dialCurrentClass = \"dial-current\",\n  viewBox = \"0 0 100 100\",\n  //defaults for all dials if individual values not set\n  defaultColor = \"#ffffff\",\n  defaultStroke = 2,\n  defaultInitialValue = 0,\n  defaultLineCap = \"round\",\n  //[round | butt | square]\n  defaultArc = 300,\n  defaultOrientation = 0,\n  defaultMaxValue = 100,\n  defaultMinValue = 0,\n  defaultColorSchedule = function (value) {\n    switch (true) {\n      case value < 25:\n        return \"blue\";\n\n      case value >= 25 && value < 50:\n        return \"green\";\n\n      case value >= 50 && value < 75:\n        return \"yellow\";\n\n      case value >= 75:\n        return \"red\";\n    }\n  },\n  label = function (val) {\n    return Math.round(val);\n  }\n}) {\n  /**\r\n   * Normalizes the angle to between 0 and 359\r\n   * @param {Nnteger} value - angle\r\n   * @return {number} - Normalized angle\r\n   */\n  const normalizeAngle = value => {\n    if (value >= 0 && value < 360) return value;\n    if (value > 359) return value - 360;\n    if (value < 0) return 360 + value;\n  };\n\n  const SVG_ORIG = \"http://www.w3.org/2000/svg\";\n\n  let _container = document.getElementById(container),\n      dials = [];\n  /**\r\n   * Creates SVG DOM element - including nesting dials, text etc.  Returns single SVGElement\r\n   * @param {String} tag The SVG element type name\r\n   * @param {Object} opts The svg attributes\r\n   * @param {Array} nestedDials An array of nested dials or text\r\n   * @return {SVGElement} The SVG element\r\n   */\n\n\n  const buildSVG = ({\n    tag,\n    opts,\n    nestedDials\n  }) => {\n    let svg = document.createElementNS(SVG_ORIG, tag);\n\n    for (var opt in opts) {\n      svg.setAttribute(opt, opts[opt]);\n    }\n\n    if (nestedDials) {\n      nestedDials.forEach(function (dial) {\n        svg.appendChild(dial);\n      });\n    }\n\n    return svg;\n  };\n  /**\r\n   * Translates percentage value to angle. e.g. If gauge span angle is 180deg, then 50%\r\n   * will be 90deg\r\n   */\n\n\n  const getAngle = (percentage, arcAngle) => {\n    return percentage * arcAngle / 100;\n  };\n  /**\r\n   * Checks if user has entered a custom value for a given property on a given dial\r\n   * If not then default value applied\r\n   * @param {Objectr} opts - User created options for each dial\r\n   * @param {String} prop - Property to check\r\n   * @param {*} defaultProp - Default property to apply\r\n   */\n\n\n  const checkUserProp = (opts, prop, defaultProp) => {\n    return opts && opts.hasOwnProperty(prop) ? opts[prop] : defaultProp;\n  };\n  /**\r\n   * Limits value generated to given min/max values set by user\r\n   */\n\n\n  const limitValue = (value, min, max) => {\n    var val = Number(value);\n    if (val > max) return max;\n    if (val < min) return min;\n    return val;\n  };\n  /**\r\n   * Changes given value to percentage based on min / max\r\n   */\n\n\n  const getValueInPercentage = (value, min, max) => {\n    var newMax = max - min,\n        newVal = value - min;\n    return 100 * newVal / newMax;\n  };\n  /**\r\n   * Gets cartesian points for a specified radius and angle (in degrees)\r\n   * @param {Number} centerX  The center x coord\r\n   * @param {Number} centerY  The center y coord\r\n   * @param {Number} radius  The radius of the circle\r\n   * @param {Number} angle The angle in degrees\r\n   * @return {Object} An object with x,y coords\r\n   */\n\n\n  const getCartesianPoints = (centerX, centerY, radius, angle) => {\n    var rad = angle * Math.PI / 180;\n    return {\n      x: Math.round((centerX + radius * Math.cos(rad)) * 1000) / 1000,\n      y: Math.round((centerY + radius * Math.sin(rad)) * 1000) / 1000\n    };\n  };\n  /**\r\n   * Takes in radius and start and end angles and returns x,y points for start and end of dial\r\n   * @param {Number} radius radis of circle\r\n   * @param {Number} startAngle angle of start point\r\n   * @param {Number} endAngle andgle of end point\r\n   * @return {Object} AN oject with x,y values for start and end points of dial\r\n   */\n\n\n  const getDialCoords = (radius, startAngle, endAngle) => {\n    var cx = dialX,\n        cy = dialY;\n    return {\n      end: getCartesianPoints(cx, cy, radius, endAngle),\n      start: getCartesianPoints(cx, cy, radius, startAngle)\n    };\n  };\n  /**\r\n   * Generates the path string to draw an svg path of the dial radius.  Takes a flag to determeine\r\n   * if drawing the larger or smaller of a given arc on a circle\r\n   * @param {Number} radius - radius of circle\r\n   * @param {Number} startAngle - angle of start point\r\n   * @param {Number} endAngle - angle of end point\r\n   * @param {bool} useLargeArc - boolean the decide to use larger of two given arcs\r\n   * @return {String} An svg path string\r\n   */\n\n\n  const pathString = (radius, startAngle, endAngle, useLargeArc) => {\n    var coords = getDialCoords(radius, startAngle, endAngle),\n        start = coords.start,\n        end = coords.end,\n        largeArcFlag = typeof useLargeArc === \"undefined\" ? 1 : useLargeArc;\n    return [\"M\", start.x, start.y, \"A\", radius, radius, 0, largeArcFlag, 1, end.x, end.y].join(\" \");\n  };\n  /**\r\n   *\r\n   * @param {object} options - Animation options\r\n   * @param {number} options.duration - duration in seconds of anumation\r\n   * @param {number} options.start - start angle of dial\r\n   * @param {number} options.end - end angle of dial\r\n   * @param {function} options.step - fucntion to execute on each anuimation step\r\n   * @param {function} options.easing - function to execute for the type of easing\r\n   */\n\n\n  const animateDial = options => {\n    let duration = options.duration,\n        currentIteration = 1,\n        iterations = 60 * duration,\n        start = options.start || 0,\n        end = options.end,\n        change = end - start,\n        step = options.step,\n        easing = options.easing || function easeInOutCubic(pos) {\n      if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3);\n      return 0.5 * (Math.pow(pos - 2, 3) + 2);\n    };\n\n    function animate() {\n      let progress = currentIteration / iterations,\n          value = change * easing(progress) + start;\n      step(value, currentIteration);\n      currentIteration += 1;\n\n      if (progress < 1) {\n        requestAnimationFrame(animate);\n      }\n    }\n\n    requestAnimationFrame(animate);\n  };\n  /**\r\n   * Draws change in dial value\r\n   * @param {Number} value - value to change to\r\n   * @param {SVGElement} svg_text - Text svg element to update\r\n   * @param {SVGElement} svg_path - Path svg element to update\r\n   */\n\n\n  const updateDial = (value, svg_text, svg_path) => {\n    let newVal = getValueInPercentage(value, svg_path.minValue, svg_path.maxValue);\n    let angle = svg_path.startAngle > svg_path.endAngle ? normalizeAngle(getAngle(newVal, 360 - Math.abs(svg_path.startAngle - svg_path.endAngle))) : normalizeAngle(getAngle(newVal, Math.abs(svg_path.startAngle - svg_path.endAngle))); // this is because we are using arc greater than 180deg\n\n    let useLargeArc = angle <= 180 ? 0 : 1;\n    svg_text.textContent = newVal;\n    svg_path.svg.setAttribute(\"d\", pathString(svg_path.radius, svg_path.startAngle, angle + svg_path.startAngle, useLargeArc));\n  };\n  /**\r\n   * Updates color of dails based on value and colorSchedule\r\n   * @param {Number} value - DIal or text value to change to\r\n   * @param {Number} duration - Duration of animation\r\n   * @param {SVGElement} ring - WHich dial to update\r\n   */\n\n\n  const setColor = (value, duration, ring) => {\n    let color = checkUserProp(ring, \"colorSchedule\", defaultColorSchedule)(value),\n        dur = duration * 1000,\n        pathTransition = \"stroke \" + dur + \"ms ease\"; // textTransition = \"fill \" + dur + \"ms ease\";\n\n    ring.svg.style.stroke = color;\n    ring.svg.style.transition = pathTransition;\n    /*\r\n    gaugeValueElem.style = [\r\n      \"fill: \" + c,\r\n      \"-webkit-transition: \" + textTransition,\r\n      \"-moz-transition: \" + textTransition,\r\n      \"transition: \" + textTransition,\r\n    ].join(\";\");\r\n    */\n  };\n  /**\r\n   * Builds each dial and text assoicated with it.\r\n   * Checks for dial specific options and if not found then reverts to global defaults set.\r\n   * Creates object with SVGElement and all user options\r\n   */\n\n\n  const initializeDial = () => {\n    for (let i = 0; i < numberDials; i++) {\n      //Check if custom values for dials exist otherwise use defaults\n      let orientation = checkUserProp(individualDialOpts[i], \"orientation\", defaultOrientation) - 90;\n      let stroke = checkUserProp(individualDialOpts[i], \"stroke\", defaultStroke);\n      let color = checkUserProp(individualDialOpts[i], \"color\", defaultColor);\n      let arc = checkUserProp(individualDialOpts[i], \"arc\", defaultArc);\n      let lineCap = checkUserProp(individualDialOpts[i], \"lineCap\", defaultLineCap);\n      let minValue = checkUserProp(individualDialOpts[i], \"minValue\", defaultMinValue);\n      let maxValue = checkUserProp(individualDialOpts[i], \"maxValue\", defaultMaxValue);\n      let colorSchedule = checkUserProp(individualDialOpts[i], \"colorSchedule\", defaultColorSchedule); //Compensate for stroke width when applying offset for nested dials\n\n      let strokeOffset = individualDialOpts.slice(0, i).map(e => {\n        return e.hasOwnProperty(\"stroke\") ? e.stroke : defaultStroke;\n      }).reduce((a, c) => a + c, 0); //Get angles and radii for dials\n\n      let startAngle = normalizeAngle(orientation + (360 - arc) / 2);\n      let endAngle = normalizeAngle(startAngle + arc);\n      let angle = getAngle(100, 360 - Math.abs(startAngle - endAngle));\n      let useLargeArc = startAngle < endAngle ? angle >= 180 ? 0 : 1 : angle <= 180 ? 0 : 1;\n      let newRadius = radius - strokeOffset - multiDialOffset * i;\n      /*\r\n        Create svg path and text\r\n      */\n\n      let dialText = {\n        svg: buildSVG({\n          tag: \"text\",\n          opts: {\n            x: 50,\n            y: 50,\n            fill: \"#999\",\n            class: dialTextClass,\n            \"font-size\": \"100%\",\n            \"font-family\": \"sans-serif\",\n            \"font-weight\": \"normal\",\n            \"text-anchor\": \"middle\",\n            \"alignment-baseline\": \"middle\",\n            \"dominant-baseline\": \"central\"\n          }\n        }),\n        currentValue: \"\"\n      },\n          dialPath = {\n        svg: buildSVG({\n          tag: \"path\",\n          opts: {\n            class: dialPathClass,\n            fill: \"none\",\n            stroke: \"#666\",\n            \"stroke-width\": 2.5,\n            d: pathString(newRadius, startAngle, startAngle) // value of 0\n\n          }\n        }),\n        startAngle: startAngle,\n        endAngle: endAngle,\n        radius: newRadius,\n        type: \"background Path\"\n      },\n          dialCurrent = {\n        svg: buildSVG({\n          tag: \"path\",\n          opts: {\n            class: dialCurrentClass,\n            fill: \"none\",\n            stroke: color,\n            \"stroke-width\": stroke,\n            \"stroke-linecap\": lineCap,\n            d: pathString(newRadius, startAngle, endAngle, useLargeArc)\n          }\n        }),\n        startAngle: startAngle,\n        endAngle: endAngle,\n        radius: newRadius,\n        currentValue: defaultInitialValue,\n        type: \"Current Value Path\",\n        minValue: minValue,\n        maxValue: maxValue,\n        colorSchedule: colorSchedule\n      };\n      dials.push(dialText, dialPath, dialCurrent);\n    } //Composes all SVGElements to gether and adds to DOM\n\n\n    let dialComplete = buildSVG({\n      tag: \"svg\",\n      opts: {\n        viewBox: viewBox || \"0 0 100 100\",\n        class: dialComponentClass\n      },\n      nestedDials: dials.map(e => e.svg)\n    });\n\n    _container.appendChild(dialComplete);\n  };\n\n  const init = () => {\n    initializeDial();\n  };\n\n  init();\n  /**\r\n   *   PUBLIC FUNCTIONS\r\n   *\r\n   */\n\n  return {\n    /**\r\n     * setDialValue\r\n     *\r\n     * Update the value of a given dial\r\n     * @param {Number} val - the value to update the dial to\r\n     * @param {Integer} ring - which of the nested dials to update 0 being outside ring\r\n     * @param {boolean} animate - animate change\r\n     * @param {double} duration - the duration in seconds of animate\r\n     */\n    setDialValue: (val, ring, animate, duration) => {\n      console.log(`Dial: ${ring} - Value: ${val}`);\n      let svg_text = dials[3 * ring],\n          svg_path = dials[3 * ring + 2],\n          value = limitValue(val, svg_path.minValue, svg_path.maxValue);\n\n      if (defaultColor) {\n        setColor(value, duration, svg_path);\n      }\n\n      if (animate) {\n        animateDial({\n          start: svg_path.currentValue || 0,\n          end: value,\n          duration: duration || 1,\n          step: function (val, frame) {\n            svg_path.currentValue = val;\n            updateDial(val, svg_text, svg_path);\n          }\n        });\n      } else {\n        updateDial(val, svg_text, svg_path);\n      }\n    },\n    returnTestString: thisString => {}\n  };\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MultiDial);\n\n//# sourceURL=webpack://MultiDial/./src/MultiDial.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const MultiDial = __webpack_require__(/*! ./MultiDial */ \"./src/MultiDial.js\").default;\n\nmodule.exports = MultiDial;\n\n//# sourceURL=webpack://MultiDial/./src/index.js?");

/***/ })

/******/ });