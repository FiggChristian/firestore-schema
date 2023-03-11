import "core-js/modules/es.symbol.description.js";
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import CollectionGroupWrapper from "./CollectionGroupWrapper";
class Path {
  /**
   * The Firestore object that was used to create the `Path`.
   */

  constructor(firestore) {
    _defineProperty(this, "firestore", void 0);
    this.firestore = firestore;
  }
  castToSchema(value) {
    // This function is purely to tell TypeScript the type of the passed-in
    // value, but the value itself is not used. We can just return it as-is.
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

  collection(collectionPath) {
    for (var _len = arguments.length, additionalSegments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      additionalSegments[_key - 1] = arguments[_key];
    }
    if (additionalSegments.length > 0) {
      var lastCollectionRef = this.firestore.collection(collectionPath);
      var lastDocRef;
      for (var i = 0; i < additionalSegments.length; i++) {
        if (i % 2 === 0) {
          lastDocRef = lastCollectionRef.doc(additionalSegments[i]);
        } else {
          lastCollectionRef = lastDocRef.collection(additionalSegments[i]);
        }
      }
      return new CollectionWrapper(lastCollectionRef);
    } else {
      return new CollectionWrapper(this.firestore.collection(collectionPath));
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

  doc(docPath) {
    for (var _len2 = arguments.length, additionalSegments = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      additionalSegments[_key2 - 1] = arguments[_key2];
    }
    if (additionalSegments.length > 0) {
      var lastCollectionRef = this.firestore.collection(docPath);
      var lastDocRef;
      for (var i = 0; i < additionalSegments.length; i++) {
        if (i % 2 === 0) {
          lastDocRef = lastCollectionRef.doc(additionalSegments[i]);
        } else {
          lastCollectionRef = lastDocRef.collection(additionalSegments[i]);
        }
      }
      return new DocumentWrapper(lastDocRef);
    } else {
      return new DocumentWrapper(this.firestore.doc(docPath));
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
    return new CollectionGroupWrapper(this.firestore.collectionGroup(collectionId));
  }
}
export default Path;