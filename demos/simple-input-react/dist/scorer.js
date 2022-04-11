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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _scorer_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scorer/index */ \"./scorer/index.js\");\n/*globals LearnosityAmd*/\n\nLearnosityAmd.define([], function () {\n  return {\n    Scorer: _scorer_index__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n  };\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY29yZXIuanMuanMiLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBRUFDLGFBQWEsQ0FBQ0MsTUFBZCxDQUFxQixFQUFyQixFQUF5QixZQUFZO0FBQ2pDLFNBQU87QUFDSEYsSUFBQUEsTUFBTSxFQUFOQSxxREFBTUE7QUFESCxHQUFQO0FBR0gsQ0FKRCIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3Njb3Jlci5qcz9mYjhmIl0sInNvdXJjZXNDb250ZW50IjpbIi8qZ2xvYmFscyBMZWFybm9zaXR5QW1kKi9cbmltcG9ydCBTY29yZXIgZnJvbSAnLi9zY29yZXIvaW5kZXgnO1xuXG5MZWFybm9zaXR5QW1kLmRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIFNjb3JlclxuICAgIH07XG59KTtcbiJdLCJuYW1lcyI6WyJTY29yZXIiLCJMZWFybm9zaXR5QW1kIiwiZGVmaW5lIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./scorer.js\n");

/***/ }),

/***/ "./scorer/index.js":
/*!*************************!*\
  !*** ./scorer/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Scorer)\n/* harmony export */ });\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"../node_modules/lodash/lodash.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n\n\nvar Scorer = /*#__PURE__*/function () {\n  function Scorer(question, response) {\n    _classCallCheck(this, Scorer);\n\n    this.question = question;\n    this.response = response;\n    this.validResponse = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.get)(question, \"valid_response\");\n  }\n  /**\n   * Check if the current question's response is valid or not\n   * (Required)\n   * @returns {boolean}\n   */\n\n\n  _createClass(Scorer, [{\n    key: \"isValid\",\n    value: function isValid() {\n      var response = this.response,\n          validResponse = this.validResponse;\n      return response && validResponse && (0,lodash__WEBPACK_IMPORTED_MODULE_0__.isEqual)(response, validResponse);\n    }\n    /**\n     * Returns an object displaying the validation state of each individual item inside the stored response\n     * For example:\n     * The student response value is: { min: 10, max: 20 } and our correct answer is { min: 10, max: 30 }\n     * Then we expect the result of this validateIndividualResponses will be:\n     * { min: true, max: false }\n     * @returns {{}|null}\n     */\n\n  }, {\n    key: \"validateIndividualResponses\",\n    value: function validateIndividualResponses() {\n      // TODO: Requires implementation\n      return null;\n    }\n    /**\n     * Returns the score of the stored response\n     * @returns {number|null}\n     */\n\n  }, {\n    key: \"score\",\n    value: function score() {\n      return this.isValid() ? this.maxScore() : 0;\n    }\n    /**\n     * Returns the possible max score of the stored response\n     * @returns {number}\n     */\n\n  }, {\n    key: \"maxScore\",\n    value: function maxScore() {\n      return this.question.score || 0;\n    }\n    /**\n     * Check if the current question is scorable or not.\n     * For example:\n     * - If there is no valid response data set in the question, this method should return false\n     * - If this question type is not scorable (like an essay or open ended question) then this will return false\n     * @returns {boolean}\n     */\n\n  }, {\n    key: \"canValidateResponse\",\n    value: function canValidateResponse() {\n      return true;\n    }\n  }]);\n\n  return Scorer;\n}();\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zY29yZXIvaW5kZXguanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQ3FCRTtBQUNqQixrQkFBWUMsUUFBWixFQUFzQkMsUUFBdEIsRUFBZ0M7QUFBQTs7QUFDNUIsU0FBS0QsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtDLGFBQUwsR0FBcUJMLDJDQUFHLENBQUNHLFFBQUQsRUFBVyxnQkFBWCxDQUF4QjtBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7Ozs7V0FDSSxtQkFBVTtBQUNOLFVBQVFDLFFBQVIsR0FBb0MsSUFBcEMsQ0FBUUEsUUFBUjtBQUFBLFVBQWtCQyxhQUFsQixHQUFvQyxJQUFwQyxDQUFrQkEsYUFBbEI7QUFFQSxhQUFPRCxRQUFRLElBQ1JDLGFBREEsSUFFQUosK0NBQU8sQ0FBQ0csUUFBRCxFQUFXQyxhQUFYLENBRmQ7QUFHSDtBQUVEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDSSx1Q0FBOEI7QUFDMUI7QUFDQSxhQUFPLElBQVA7QUFDSDtBQUVEO0FBQ0o7QUFDQTtBQUNBOzs7O1dBQ0ksaUJBQVE7QUFDSixhQUFPLEtBQUtDLE9BQUwsS0FBaUIsS0FBS0MsUUFBTCxFQUFqQixHQUFtQyxDQUExQztBQUNIO0FBRUQ7QUFDSjtBQUNBO0FBQ0E7Ozs7V0FDSSxvQkFBVztBQUNQLGFBQU8sS0FBS0osUUFBTCxDQUFjSyxLQUFkLElBQXVCLENBQTlCO0FBQ0g7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNJLCtCQUFzQjtBQUNsQixhQUFPLElBQVA7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3Njb3Jlci9pbmRleC5qcz9kMjFiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldCwgaXNFcXVhbCB9IGZyb20gXCJsb2Rhc2hcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JlciB7XG4gICAgY29uc3RydWN0b3IocXVlc3Rpb24sIHJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbjtcbiAgICAgICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICB0aGlzLnZhbGlkUmVzcG9uc2UgPSBnZXQocXVlc3Rpb24sIFwidmFsaWRfcmVzcG9uc2VcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIGN1cnJlbnQgcXVlc3Rpb24ncyByZXNwb25zZSBpcyB2YWxpZCBvciBub3RcbiAgICAgKiAoUmVxdWlyZWQpXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNWYWxpZCgpIHtcbiAgICAgICAgY29uc3QgeyByZXNwb25zZSwgdmFsaWRSZXNwb25zZSB9ID0gdGhpcztcblxuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgICAgICAgICYmIHZhbGlkUmVzcG9uc2VcbiAgICAgICAgICAgICYmIGlzRXF1YWwocmVzcG9uc2UsIHZhbGlkUmVzcG9uc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gb2JqZWN0IGRpc3BsYXlpbmcgdGhlIHZhbGlkYXRpb24gc3RhdGUgb2YgZWFjaCBpbmRpdmlkdWFsIGl0ZW0gaW5zaWRlIHRoZSBzdG9yZWQgcmVzcG9uc2VcbiAgICAgKiBGb3IgZXhhbXBsZTpcbiAgICAgKiBUaGUgc3R1ZGVudCByZXNwb25zZSB2YWx1ZSBpczogeyBtaW46IDEwLCBtYXg6IDIwIH0gYW5kIG91ciBjb3JyZWN0IGFuc3dlciBpcyB7IG1pbjogMTAsIG1heDogMzAgfVxuICAgICAqIFRoZW4gd2UgZXhwZWN0IHRoZSByZXN1bHQgb2YgdGhpcyB2YWxpZGF0ZUluZGl2aWR1YWxSZXNwb25zZXMgd2lsbCBiZTpcbiAgICAgKiB7IG1pbjogdHJ1ZSwgbWF4OiBmYWxzZSB9XG4gICAgICogQHJldHVybnMge3t9fG51bGx9XG4gICAgICovXG4gICAgdmFsaWRhdGVJbmRpdmlkdWFsUmVzcG9uc2VzKCkge1xuICAgICAgICAvLyBUT0RPOiBSZXF1aXJlcyBpbXBsZW1lbnRhdGlvblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzY29yZSBvZiB0aGUgc3RvcmVkIHJlc3BvbnNlXG4gICAgICogQHJldHVybnMge251bWJlcnxudWxsfVxuICAgICAqL1xuICAgIHNjb3JlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzLm1heFNjb3JlKCkgOiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHBvc3NpYmxlIG1heCBzY29yZSBvZiB0aGUgc3RvcmVkIHJlc3BvbnNlXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBtYXhTY29yZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVlc3Rpb24uc2NvcmUgfHwgMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgY3VycmVudCBxdWVzdGlvbiBpcyBzY29yYWJsZSBvciBub3QuXG4gICAgICogRm9yIGV4YW1wbGU6XG4gICAgICogLSBJZiB0aGVyZSBpcyBubyB2YWxpZCByZXNwb25zZSBkYXRhIHNldCBpbiB0aGUgcXVlc3Rpb24sIHRoaXMgbWV0aG9kIHNob3VsZCByZXR1cm4gZmFsc2VcbiAgICAgKiAtIElmIHRoaXMgcXVlc3Rpb24gdHlwZSBpcyBub3Qgc2NvcmFibGUgKGxpa2UgYW4gZXNzYXkgb3Igb3BlbiBlbmRlZCBxdWVzdGlvbikgdGhlbiB0aGlzIHdpbGwgcmV0dXJuIGZhbHNlXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgY2FuVmFsaWRhdGVSZXNwb25zZSgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbImdldCIsImlzRXF1YWwiLCJTY29yZXIiLCJxdWVzdGlvbiIsInJlc3BvbnNlIiwidmFsaWRSZXNwb25zZSIsImlzVmFsaWQiLCJtYXhTY29yZSIsInNjb3JlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./scorer/index.js\n");

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