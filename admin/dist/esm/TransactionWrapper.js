import "core-js/modules/esnext.async-iterator.map.js";
import "core-js/modules/esnext.iterator.map.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.symbol.description.js";
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import DocumentWrapper from "./DocumentWrapper";
import QueryWrapper from "./QueryWrapper";

/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.Transaction `Transaction`} objects. This is a
 * read-only variation of a normal Firebase `Transaction`. The full read-write
 * version of a Transaction (which is the same as a normal Firebase
 * `Transaction`) is available as a
 * {@link ReadWriteTransactionWrapper `ReadWriteTransactionWrapper`}.
 *
 * Instances of this class are usually created automatically by calling
 * `.runTransaction()` on a {@link FirestoreWrapper `runTransaction`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * firestore.runTransaction((wrappedTransaction) => { ... }, { readOnly: true });
 * ```
 *
 * It includes most of the same methods as the underlying `Transaction` object
 * with the same behavior so that it can be used interchangeably. Methods that
 * would only be available in a read-write transaction are omitted since they
 * throw errors at runtime. It also includes the following additional properties
 * :
 *
 * Properties:
 * - {@link ref `ref`}
 */
export class ReadOnlyTransactionWrapper {
  /** The raw Firebase `Transaction` instance. */

  /**
   * Creates a `ReadOnlyTransactionWrapper` object around the specified
   * `Transaction` object.
   *
   * @param ref The `Transaction` object to wrap.
   */
  constructor(ref) {
    _defineProperty(this, "ref", void 0);
    this.ref = ref;
  }

  /**
   * Retrieves a query result. Holds a pessimistic lock on all returned
   * documents.
   *
   * @param query A query to execute.
   * @returns A `QuerySnapshot` for the retrieved data.
   */

  get(queryOrDocumentRefOrAggregateQuery) {
    if (queryOrDocumentRefOrAggregateQuery instanceof QueryWrapper) {
      return this.ref.get(queryOrDocumentRefOrAggregateQuery.ref);
    } else if (queryOrDocumentRefOrAggregateQuery instanceof DocumentWrapper) {
      return this.ref.get(queryOrDocumentRefOrAggregateQuery.ref);
    } else {
      return this.ref.get(queryOrDocumentRefOrAggregateQuery);
    }
  }

  /**
   * Retrieves multiple documents from Firestore. Holds a pessimistic lock on
   * all returned documents.
   *
   * The first argument is required and must be of type `DocumentReference` /
   * `DocumentWrapper` followed by any additional `DocumentReference` /
   * `DocumentWrapper` documents. If used, the optional `ReadOptions` must be
   * the last argument.
   *
   * @param documentRefsOrReadOptions The `DocumentReferences` to receive,
   *        followed by an optional field mask.
   * @returns A Promise that resolves with an array of resulting document
   *        snapshots.
   */

  getAll() {
    for (var _len = arguments.length, documentRefsOrReadOptions = new Array(_len), _key = 0; _key < _len; _key++) {
      documentRefsOrReadOptions[_key] = arguments[_key];
    }
    var unwrappedArgs = documentRefsOrReadOptions.map(refOrReadOpts => {
      if (refOrReadOpts instanceof DocumentWrapper) {
        return refOrReadOpts.ref;
      }
      return refOrReadOpts;
    });
    return this.ref.getAll(...unwrappedArgs);
  }
}

/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.Transaction `Transaction`} objects. This is a
 * read-write variation of a normal Firebase `Transaction`. The read-only
 * version of a Transaction (which has a subset of methods that are usable in a
 * read-only transaction) is available as a
 * {@link ReadOnlyTransactionWrapper `ReadOnlyTransactionWrapper`}.
 *
 * Instances of this class are usually created automatically by calling
 * `.runTransaction()` on a {@link FirestoreWrapper `runTransaction`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * firestore.runTransaction((wrappedTransaction) => { ... });
 * ```
 *
 * It includes the same methods as the underlying `DocumentReference` object
 * with the same behavior so that it can be used interchangeably. It also
 * includes the following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
export class ReadWriteTransactionWrapper extends ReadOnlyTransactionWrapper {
  /**
   * Creates a `ReadWriteTransactionWrapper` object around the specified
   * `Transaction` object.
   *
   * @param ref The `Transaction` object to wrap.
   */
  constructor(ref) {
    super(ref);
  }

  /**
   * Create the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`. The operation will fail the transaction if a document
   * exists at the specified location.
   *
   * @param documentRef A reference to the document to be create.
   * @param data The object data to serialize as the document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */

  create(documentRef, data) {
    this.ref.create(documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef, data);
    return this;
  }

  /**
   * Writes to the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`. If the document does not exist yet, it will be created.
   * If you pass `SetOptions`, the provided data can be merged into the existing
   * document.
   *
   * @param documentRef A reference to the document to be set.
   * @param data An object of the fields and values for the document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */

  set(documentRef, data, options) {
    if (options === undefined) {
      this.ref.set(documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef, data);
    } else {
      this.ref.set(documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef, data, options);
    }
    return this;
  }

  /**
   * Updates fields in the document referred to by the provided
   * `DocumentReference` / `DocumentWrapper`. The update will fail if applied to
   * a document that does not exist.
   *
   * Nested fields can be updated by providing dot-separated field path strings.
   *
   * @param documentRef A reference to the document to be updated.
   * @param data An object containing the fields and values with which to update
   *        the document.
   * @param precondition A Precondition to enforce on this update.
   * @throws Error If the provided input is not valid Firestore data.
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */

  update(documentRef, dataOrField, preconditionOrValue) {
    for (var _len2 = arguments.length, moreFieldsOrPrecondition = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      moreFieldsOrPrecondition[_key2 - 3] = arguments[_key2];
    }
    this.ref.update(documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef, dataOrField, preconditionOrValue, ...moreFieldsOrPrecondition);
    return this;
  }

  /**
   * Deletes the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`.
   *
   * @param documentRef A reference to the document to be deleted.
   * @param precondition A Precondition to enforce for this delete.
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */
  delete(documentRef, precondition) {
    this.ref.delete(documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef, precondition);
    return this;
  }
}