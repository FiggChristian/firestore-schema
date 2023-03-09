"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CollectionWrapper = _interopRequireDefault(require("./CollectionWrapper"));
var _DocumentWrapper = _interopRequireDefault(require("./DocumentWrapper"));
var _QueryWrapper = _interopRequireDefault(require("./QueryWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Path {
  /**
   * The Firestore object that was used to create the `Path`.
   */
  firestore;
  constructor(firestore) {
    this.firestore = firestore;
  }
  castToSchema(value) {
    return value;
  }

  /**
   * Gets a `CollectionWrapper` instance that refers to the collection at the
   * specified path.
   *
   * @example
   * ```ts
   * path.collection("users");
   * path.collection("users/userID/posts");
   * path.collection("users", "userID", "posts");
   * ```
   *
   * @param collectionPath A slash-separated path to a collection.
   * @return The `CollectionWrapper` instance.
   */

  collection(collectionPath, ...additionalSegments) {
    if (additionalSegments.length > 0) {
      let lastCollectionRef = this.firestore.collection(collectionPath);
      let lastDocRef;
      for (let i = 0; i < additionalSegments.length; i++) {
        if (i % 2 === 0) {
          lastDocRef = lastCollectionRef.doc(additionalSegments[i]);
        } else {
          lastCollectionRef = lastDocRef.collection(additionalSegments[i]);
        }
      }
      return new _CollectionWrapper.default(lastCollectionRef);
    } else {
      return new _CollectionWrapper.default(this.firestore.collection(collectionPath));
    }
  }

  /**
   * Gets a `DocumentWrapper` instance that refers to the document at the
   * specified path.
   *
   * @example
   * ```ts
   * path.doc("users/userID");
   * path.collection("users", "userID");
   * ```
   *
   * @param documentPath A slash-separated path to a document.
   * @return The `DocumentWrapper` instance.
   */

  doc(docPath, ...additionalSegments) {
    if (additionalSegments.length > 0) {
      let lastCollectionRef = this.firestore.collection(docPath);
      let lastDocRef;
      for (let i = 0; i < additionalSegments.length; i++) {
        if (i % 2 === 0) {
          lastDocRef = lastCollectionRef.doc(additionalSegments[i]);
        } else {
          lastCollectionRef = lastDocRef.collection(additionalSegments[i]);
        }
      }
      return new _DocumentWrapper.default(lastDocRef);
    } else {
      return new _DocumentWrapper.default(this.firestore.doc(docPath));
    }
  }

  /**
   * Creates and returns a new `QueryWrapper` that includes all documents in the
   * database that are contained in a collection or subcollection with the given
   * `collectionId`.
   *
   * @param collectionId Identifies the collections to query over. Every
   *        collection or subcollection with this ID as the last segment of its
   *        path will be included. Cannot contain a slash.
   * @return The created `CollectionGroup`.
   */

  collectionGroup(collectionId) {
    return new _QueryWrapper.default(this.firestore.collectionGroup(collectionId));
  }
}
var _default = Path;
exports.default = _default;