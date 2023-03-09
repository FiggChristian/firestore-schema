"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CollectionWrapper", {
  enumerable: true,
  get: function () {
    return _CollectionWrapper.default;
  }
});
Object.defineProperty(exports, "DocumentWrapper", {
  enumerable: true,
  get: function () {
    return _DocumentWrapper.default;
  }
});
Object.defineProperty(exports, "Path", {
  enumerable: true,
  get: function () {
    return _Path.default;
  }
});
Object.defineProperty(exports, "QueryWrapper", {
  enumerable: true,
  get: function () {
    return _QueryWrapper.default;
  }
});
exports.path = exports.makePath = exports.default = void 0;
var _Path = _interopRequireDefault(require("./Path"));
var _DocumentWrapper = _interopRequireDefault(require("./DocumentWrapper"));
var _CollectionWrapper = _interopRequireDefault(require("./CollectionWrapper"));
var _QueryWrapper = _interopRequireDefault(require("./QueryWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const makePath = firestore => {
  return new _Path.default(firestore);
};
exports.makePath = makePath;
const path = makePath;
exports.path = path;
var _default = makePath;
exports.default = _default;