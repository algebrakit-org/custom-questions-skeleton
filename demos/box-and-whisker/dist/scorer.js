/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./scorer.js":
/*!*******************!*\
  !*** ./scorer.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _scorer_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scorer/index */ \"./scorer/index.js\");\n/*globals LearnosityAmd*/\n\nLearnosityAmd.define([], function () {\n  return {\n    Scorer: _scorer_index__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n  };\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY29yZXIuanMuanMiLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBRUFDLGFBQWEsQ0FBQ0MsTUFBZCxDQUFxQixFQUFyQixFQUF5QixZQUFZO0FBQ2pDLFNBQU87QUFDSEMsSUFBQUEsTUFBTSxFQUFFSCxxREFBbUJBO0FBRHhCLEdBQVA7QUFHSCxDQUpEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc2NvcmVyLmpzP2ZiOGYiXSwic291cmNlc0NvbnRlbnQiOlsiLypnbG9iYWxzIExlYXJub3NpdHlBbWQqL1xuaW1wb3J0IEJveEFuZFdoaXNrZXJTY29yZXIgZnJvbSAnLi9zY29yZXIvaW5kZXgnO1xuXG5MZWFybm9zaXR5QW1kLmRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIFNjb3JlcjogQm94QW5kV2hpc2tlclNjb3JlclxuICAgIH07XG59KTtcbiJdLCJuYW1lcyI6WyJCb3hBbmRXaGlza2VyU2NvcmVyIiwiTGVhcm5vc2l0eUFtZCIsImRlZmluZSIsIlNjb3JlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./scorer.js\n");

/***/ }),

/***/ "./scorer/index.js":
/*!*************************!*\
  !*** ./scorer/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ BoxAndWhiskerScorer)\n/* harmony export */ });\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"../node_modules/lodash/lodash.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar BoxAndWhiskerScorer = /*#__PURE__*/function () {\n  function BoxAndWhiskerScorer(question, response) {\n    _classCallCheck(this, BoxAndWhiskerScorer);\n\n    this.question = question;\n    this.response = response;\n    this.validResponse = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.get)(question, 'valid_response');\n  }\n\n  _createClass(BoxAndWhiskerScorer, [{\n    key: \"isValid\",\n    value: function isValid() {\n      var response = this.response,\n          validResponse = this.validResponse;\n      return response && validResponse && (0,lodash__WEBPACK_IMPORTED_MODULE_0__.isEqual)(response.value, validResponse.value);\n    }\n  }, {\n    key: \"validateIndividualResponses\",\n    value: function validateIndividualResponses() {\n      var response = this.response,\n          validResponse = this.validResponse;\n      var validResponseValue = validResponse.value || {};\n      var responseValue = response && response.value || {};\n      var partial = {};\n      ['min', 'max', 'quartile_1', 'median', 'quartile_3'].forEach(function (key) {\n        partial[key] = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.isNumber)(responseValue[key]) && responseValue[key] === validResponseValue[key];\n      });\n      return partial;\n    }\n  }, {\n    key: \"score\",\n    value: function score() {\n      return this.isValid() ? this.maxScore() : 0;\n    }\n  }, {\n    key: \"maxScore\",\n    value: function maxScore() {\n      return this.question.score || 0;\n    }\n  }, {\n    key: \"canValidateResponse\",\n    value: function canValidateResponse() {\n      return !!(this.validResponse && this.validResponse.value);\n    }\n  }]);\n\n  return BoxAndWhiskerScorer;\n}();\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY29yZXIvaW5kZXguanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0lBRXFCRztBQUNqQiwrQkFBWUMsUUFBWixFQUFzQkMsUUFBdEIsRUFBZ0M7QUFBQTs7QUFDNUIsU0FBS0QsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtDLGFBQUwsR0FBcUJOLDJDQUFHLENBQUNJLFFBQUQsRUFBVyxnQkFBWCxDQUF4QjtBQUNIOzs7O1dBRUQsbUJBQVU7QUFDTixVQUFRQyxRQUFSLEdBQW9DLElBQXBDLENBQVFBLFFBQVI7QUFBQSxVQUFrQkMsYUFBbEIsR0FBb0MsSUFBcEMsQ0FBa0JBLGFBQWxCO0FBRUEsYUFBT0QsUUFBUSxJQUNSQyxhQURBLElBRUFMLCtDQUFPLENBQUNJLFFBQVEsQ0FBQ0UsS0FBVixFQUFpQkQsYUFBYSxDQUFDQyxLQUEvQixDQUZkO0FBR0g7OztXQUVELHVDQUE4QjtBQUMxQixVQUFRRixRQUFSLEdBQW9DLElBQXBDLENBQVFBLFFBQVI7QUFBQSxVQUFrQkMsYUFBbEIsR0FBb0MsSUFBcEMsQ0FBa0JBLGFBQWxCO0FBQ0EsVUFBTUUsa0JBQWtCLEdBQUdGLGFBQWEsQ0FBQ0MsS0FBZCxJQUF1QixFQUFsRDtBQUNBLFVBQU1FLGFBQWEsR0FBSUosUUFBUSxJQUFJQSxRQUFRLENBQUNFLEtBQXRCLElBQWdDLEVBQXREO0FBQ0EsVUFBTUcsT0FBTyxHQUFHLEVBQWhCO0FBRUEsT0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLFlBQWYsRUFBNkIsUUFBN0IsRUFBdUMsWUFBdkMsRUFBcURDLE9BQXJELENBQTZELFVBQUNDLEdBQUQsRUFBUztBQUNsRUYsUUFBQUEsT0FBTyxDQUFDRSxHQUFELENBQVAsR0FBZVYsZ0RBQVEsQ0FBQ08sYUFBYSxDQUFDRyxHQUFELENBQWQsQ0FBUixJQUFnQ0gsYUFBYSxDQUFDRyxHQUFELENBQWIsS0FBdUJKLGtCQUFrQixDQUFDSSxHQUFELENBQXhGO0FBQ0gsT0FGRDtBQUlBLGFBQU9GLE9BQVA7QUFDSDs7O1dBRUQsaUJBQVE7QUFDSixhQUFPLEtBQUtHLE9BQUwsS0FBaUIsS0FBS0MsUUFBTCxFQUFqQixHQUFtQyxDQUExQztBQUNIOzs7V0FFRCxvQkFBVztBQUNQLGFBQU8sS0FBS1YsUUFBTCxDQUFjVyxLQUFkLElBQXVCLENBQTlCO0FBQ0g7OztXQUVELCtCQUFzQjtBQUNsQixhQUFPLENBQUMsRUFBRSxLQUFLVCxhQUFMLElBQXNCLEtBQUtBLGFBQUwsQ0FBbUJDLEtBQTNDLENBQVI7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3Njb3Jlci9pbmRleC5qcz9kMjFiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldCwgaXNFcXVhbCwgaXNOdW1iZXIgfSBmcm9tICdsb2Rhc2gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3hBbmRXaGlza2VyU2NvcmVyIHtcbiAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbiwgcmVzcG9uc2UpIHtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uO1xuICAgICAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gICAgICAgIHRoaXMudmFsaWRSZXNwb25zZSA9IGdldChxdWVzdGlvbiwgJ3ZhbGlkX3Jlc3BvbnNlJyk7XG4gICAgfVxuXG4gICAgaXNWYWxpZCgpIHtcbiAgICAgICAgY29uc3QgeyByZXNwb25zZSwgdmFsaWRSZXNwb25zZSB9ID0gdGhpcztcblxuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgICAgICAgICYmIHZhbGlkUmVzcG9uc2VcbiAgICAgICAgICAgICYmIGlzRXF1YWwocmVzcG9uc2UudmFsdWUsIHZhbGlkUmVzcG9uc2UudmFsdWUpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlSW5kaXZpZHVhbFJlc3BvbnNlcygpIHtcbiAgICAgICAgY29uc3QgeyByZXNwb25zZSwgdmFsaWRSZXNwb25zZSB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgdmFsaWRSZXNwb25zZVZhbHVlID0gdmFsaWRSZXNwb25zZS52YWx1ZSB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VWYWx1ZSA9IChyZXNwb25zZSAmJiByZXNwb25zZS52YWx1ZSkgfHwge307XG4gICAgICAgIGNvbnN0IHBhcnRpYWwgPSB7fTtcblxuICAgICAgICBbJ21pbicsICdtYXgnLCAncXVhcnRpbGVfMScsICdtZWRpYW4nLCAncXVhcnRpbGVfMyddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgcGFydGlhbFtrZXldID0gaXNOdW1iZXIocmVzcG9uc2VWYWx1ZVtrZXldKSAmJiByZXNwb25zZVZhbHVlW2tleV0gPT09IHZhbGlkUmVzcG9uc2VWYWx1ZVtrZXldO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcGFydGlhbDtcbiAgICB9XG5cbiAgICBzY29yZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy5tYXhTY29yZSgpIDogMDtcbiAgICB9XG5cbiAgICBtYXhTY29yZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVlc3Rpb24uc2NvcmUgfHwgMDtcbiAgICB9XG5cbiAgICBjYW5WYWxpZGF0ZVJlc3BvbnNlKCkge1xuICAgICAgICByZXR1cm4gISEodGhpcy52YWxpZFJlc3BvbnNlICYmIHRoaXMudmFsaWRSZXNwb25zZS52YWx1ZSk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbImdldCIsImlzRXF1YWwiLCJpc051bWJlciIsIkJveEFuZFdoaXNrZXJTY29yZXIiLCJxdWVzdGlvbiIsInJlc3BvbnNlIiwidmFsaWRSZXNwb25zZSIsInZhbHVlIiwidmFsaWRSZXNwb25zZVZhbHVlIiwicmVzcG9uc2VWYWx1ZSIsInBhcnRpYWwiLCJmb3JFYWNoIiwia2V5IiwiaXNWYWxpZCIsIm1heFNjb3JlIiwic2NvcmUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./scorer/index.js\n");

/***/ }),

/***/ "../node_modules/lodash/lodash.js":
/*!****************************************!*\
  !*** ../node_modules/lodash/lodash.js ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./scorer.js");
/******/ 	
/******/ })()
;