"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CollectionGroupWrapper", {
  enumerable: true,
  get: function () {
    return _CollectionGroupWrapper.default;
  }
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
exports.withSchema = exports.default = void 0;
var _CollectionGroupWrapper = _interopRequireDefault(require("./CollectionGroupWrapper"));
var _CollectionWrapper = _interopRequireDefault(require("./CollectionWrapper"));
var _DocumentWrapper = _interopRequireDefault(require("./DocumentWrapper"));
var _Path = _interopRequireDefault(require("./Path"));
var _QueryWrapper = _interopRequireDefault(require("./QueryWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const withSchema = firestore => {
  return new _Path.default(firestore);
};
exports.withSchema = withSchema;
var _default = withSchema;
exports.default = _default;