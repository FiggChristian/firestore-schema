"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CollectionWrapper = _interopRequireDefault(require("./CollectionWrapper"));
var _DocumentWrapper = _interopRequireDefault(require("./DocumentWrapper"));
var _CollectionGroupWrapper = _interopRequireDefault(require("./CollectionGroupWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class FirestoreWrapper {
  /** The Firestore object that was used to create the `FirestoreWrapper`. */
  firestore;

  /**
   * Creates a typed `FirestoreWrapper` object around the specified `Firestore`
   * object.
   *
   * @param firestore The `Firestore` object to wrap.
   */
  constructor(firestore) {
    this.firestore = firestore;
  }

  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value (i.e., `castToSchema<"path/to/document">(value)`) or as a JavaScript
   * string value (i.e., `castToSchema(value, "path/to/collection")`).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * @example
   * ```ts
   * type Schema = {
   *   users: {
   *     [uid: string]: {
   *       [DOCUMENT_SCHEMA]: UserDataType;
   *     }
   *   },
   *   posts: {
   *     specificPostID: {
   *       [DOCUMENT_SCHEMA]: SomePostDataType;
   *     }
   *   }
   * }
   * const path = withSchema<Schema>(firestore);
   *
   * ( ... ).get(documentSnapshot => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = path.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and should be narrowed if necessary.
   *   const dataAsUserOrPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "{any collection}/specificPostID"
   *   );
   * });
   * ```
   *
   * @param value The object to cast to the specified schema.
   * @param optionalPath A path to the collection or document from the root of
   *        the database whose schema will be used for casting the value.
   * @returns The passed-in `value`, cast to the specified schema.
   */

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

  collection(collectionPath, ...additionalSegments) {
    if (additionalSegments.length > 0) {
      if (additionalSegments.length % 2 === 1) {
        // The total number of path segments (counting `collectionPath`) is
        // even. For a collection, the number of path segments must be odd.
        throw new TypeError("Number of segments for a collection must be odd.");
      }
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
      if (additionalSegments.length % 2 === 0) {
        // The total number of path segments (counting `docPath`) is odd. For a
        // document, the number of path segments must be even.
        throw new TypeError("Number of segments for a document must be even.");
      }
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
    return new _CollectionGroupWrapper.default(this.firestore.collectionGroup(collectionId));
  }
}
var _default = FirestoreWrapper;
exports.default = _default;