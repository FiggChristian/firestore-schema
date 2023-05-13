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
Object.defineProperty(exports, "DOCUMENT_SCHEMA", {
  enumerable: true,
  get: function () {
    return _core.DOCUMENT_SCHEMA;
  }
});
Object.defineProperty(exports, "DocumentWrapper", {
  enumerable: true,
  get: function () {
    return _DocumentWrapper.default;
  }
});
Object.defineProperty(exports, "FirestoreWrapper", {
  enumerable: true,
  get: function () {
    return _FirestoreWrapper.default;
  }
});
Object.defineProperty(exports, "QueryWrapper", {
  enumerable: true,
  get: function () {
    return _QueryWrapper.default;
  }
});
Object.defineProperty(exports, "TransactionWrapper", {
  enumerable: true,
  get: function () {
    return _TransactionWrapper.default;
  }
});
Object.defineProperty(exports, "WriteBatchWrapper", {
  enumerable: true,
  get: function () {
    return _WriteBatchWrapper.default;
  }
});
exports.withSchema = void 0;
var _core = require("@firestore-schema/core");
var _CollectionWrapper = _interopRequireDefault(require("./CollectionWrapper"));
var _DocumentWrapper = _interopRequireDefault(require("./DocumentWrapper"));
var _FirestoreWrapper = _interopRequireDefault(require("./FirestoreWrapper"));
var _QueryWrapper = _interopRequireDefault(require("./QueryWrapper"));
var _TransactionWrapper = _interopRequireDefault(require("./TransactionWrapper"));
var _WriteBatchWrapper = _interopRequireDefault(require("./WriteBatchWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const withSchema = firestore => {
  return new _FirestoreWrapper.default(firestore);
};
exports.withSchema = withSchema;