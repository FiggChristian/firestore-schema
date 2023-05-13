"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _DocumentWrapper = _interopRequireDefault(require("./DocumentWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestoreTypes.Transaction `Transaction`} objects.
 *
 * Instances of this class are usually created automatically by calling
 * `.runTransaction()` on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * @example
 * ```ts
 * firestore.runTransaction((wrappedTransaction) => { ... });
 * ```
 *
 * It includes most of the same methods as the underlying `Transaction` object
 * with the same behavior so that it can be used interchangeably. Methods that
 * would only be available in a read-write transaction are omitted since they
 * throw errors at runtime. It also includes the following additional
 * properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
class TransactionWrapper {
  /** The raw Firebase `Transaction` instance. */
  ref;

  /**
   * Creates a `TransactionWrapper` object around the specified `Transaction`
   * object.
   *
   * @param ref The `Transaction` object to wrap.
   */
  constructor(ref) {
    this.ref = ref;
  }

  /**
   * Deletes the document referred to by the provided `DocumentReference`.
   *
   * @example
   * ```ts
   * const docRef = firestore.doc('users/alovelace');
   *
   * await firestore.runTransaction((transaction) => {
   *   return transaction.delete(docRef);
   * });
   * ```
   *
   * @param documentRef A reference to the document to be deleted.
   * @returns This `TransactionWrapper` instance. Used for chaining method
   * calls.
   */
  delete(documentRef) {
    this.ref.delete(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef);
    return this;
  }

  /**
   * Reads the document referenced by the provided `DocumentReference` /
   * `DocumentWrapper`.
   *
   * @example
   * ```ts
   * const docRef = firestore.doc('users/alovelace');
   *
   * await firestore.runTransaction(async (transaction) => {
   *   const snapshot = await transaction.get(docRef);
   *    // use snapshot with transaction (see set() or update())
   *    ...
   * });
   * ```
   *
   * @param documentRef A reference to the document to be read.
   * @returns A `DocumentSnapshot` for the read data.
   */

  get(documentRef) {
    return this.ref.get(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef);
  }

  /**
   * Writes to the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`. If the document does not exist yet, it will be created.
   * If you pass `SetOptions`, the provided data can be merged into the existing
   * document.
   *
   * @example
   * ```ts
   * const docRef = firestore.doc('users/alovelace');
   *
   * await firestore.runTransaction((transaction) => {
   *   const snapshot = await transaction.get(docRef);
   *   const snapshotData = snapshot.data();
   *
   *   return transaction.set(docRef, {
   *     ...data,
   *     age: 30, // new field
   *   });
   * });
   * ```
   *
   * @param documentRef A reference to the document to be set.
   * @param data An object of the fields and values for the document.
   * @param options An object to configure the set behavior.
   * @returns This `TransactionWrapper` instance. Used for chaining method
   * calls.
   */
  set(documentRef, data, options) {
    if (options === undefined) {
      // Call overload with 2 arguments.
      this.ref.set(documentRef, data);
    } else {
      // Call overload with 3 arguments.
      this.ref.set(documentRef, data, options);
    }
    return this;
  }

  /**
   * Updates fields in the document referred to by the provided
   * `DocumentReference` / `DocumentWrapper`. The update will fail if applied to
   * a document that does not exist.
   *
   * @example
   * ```ts
   * const docRef = firestore.doc('users/alovelace');
   *
   * await firestore.runTransaction((transaction) => {
   *   const snapshot = await transaction.get(docRef);
   *
   *   return transaction.update(docRef, {
   *     age: snapshot.data().age + 1,
   *   });
   * });
   * ```
   *
   * @param documentRef A reference to the document to be updated.
   * @param data An object containing the fields and values with which to update
   * the document. Fields can contain dots to reference nested fields within the
   * document.
   * @returns This `TransactionWrapper` instance. Used for chaining method
   * calls.
   */

  update(documentRef, dataOrField, ...moreFieldsAndValues) {
    this.ref.update(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef, dataOrField, ...moreFieldsAndValues);
    return this;
  }
}
var _default = TransactionWrapper;
exports.default = _default;