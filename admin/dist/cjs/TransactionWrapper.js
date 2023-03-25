"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReadWriteTransactionWrapper = exports.ReadOnlyTransactionWrapper = void 0;
require("core-js/modules/esnext.async-iterator.map.js");
require("core-js/modules/esnext.iterator.map.js");
var _DocumentWrapper = _interopRequireDefault(require("./DocumentWrapper"));
var _QueryWrapper = _interopRequireDefault(require("./QueryWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
class ReadOnlyTransactionWrapper {
  /** The raw Firebase `Transaction` instance. */
  ref;

  /**
   * Creates a `ReadOnlyTransactionWrapper` object around the specified
   * `Transaction` object.
   *
   * @param ref The `Transaction` object to wrap.
   */
  constructor(ref) {
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
    if (queryOrDocumentRefOrAggregateQuery instanceof _QueryWrapper.default) {
      return this.ref.get(queryOrDocumentRefOrAggregateQuery.ref);
    } else if (queryOrDocumentRefOrAggregateQuery instanceof _DocumentWrapper.default) {
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

  getAll(...documentRefsOrReadOptions) {
    const unwrappedArgs = documentRefsOrReadOptions.map(refOrReadOpts => {
      if (refOrReadOpts instanceof _DocumentWrapper.default) {
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
exports.ReadOnlyTransactionWrapper = ReadOnlyTransactionWrapper;
class ReadWriteTransactionWrapper extends ReadOnlyTransactionWrapper {
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
    this.ref.create(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef, data);
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
      this.ref.set(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef, data);
    } else {
      this.ref.set(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef, data, options);
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

  update(documentRef, dataOrField, preconditionOrValue, ...moreFieldsOrPrecondition) {
    this.ref.update(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef, dataOrField, preconditionOrValue, ...moreFieldsOrPrecondition);
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
    this.ref.delete(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef, precondition);
    return this;
  }
}
exports.ReadWriteTransactionWrapper = ReadWriteTransactionWrapper;