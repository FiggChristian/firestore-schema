"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _DocumentWrapper = _interopRequireDefault(require("./DocumentWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.WriteBatch `WriteBatch`} objects.
 *
 * Instances of this class are usually created automatically by calling
 * `.batch()` on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * const wrappedWriteBatch = firestore.batch();
 * ```
 *
 * It includes the same methods as the underlying `WriteBatch` object with the
 * same behavior so that it can be used interchangeably. It also includes the
 * following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
class WriteBatchWrapper {
  /** The raw Firebase `WriteBatch` instance. */
  ref;

  /**
   * Creates a `WriteBatchWrapper` object around the specified `WriteBatch`
   * object.
   *
   * @param ref The `WriteBatch` object to wrap.
   */
  constructor(ref) {
    this.ref = ref;
  }

  /**
   * Commits all of the writes in this write batch as a single atomic unit.
   *
   * Returns a Promise resolved once all of the writes in the batch have been successfully written
   * to the backend as an atomic unit. Note that it won't resolve while you're offline.
   *
   * @example
   * ```ts
   * const batch = firestore.batch();
   *
   * // Perform batch operations...
   *
   * await batch.commit();
   * ```
   */
  commit() {
    return this.ref.commit();
  }

  /**
   * Deletes the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`.
   *
   * @example
   * ```ts
   * const batch = firestore.batch();
   * const docRef = firestore.doc('users/alovelace');
   *
   * batch.delete(docRef);
   * ```
   *
   * @param documentRef A reference to the document to be deleted.
   */
  delete(documentRef) {
    this.ref.delete(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef);
    return this;
  }

  /**
   * Writes to the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`. If the document does not exist yet, it will be created.
   * If you pass `SetOptions`, the provided data can be merged into the existing
   * document.
   *
   * @example
   * ```ts
   * const batch = firestore.batch();
   * const docRef = firestore.doc('users/dsmith');
   *
   * batch.set(docRef, {
   *   name: 'David Smith',
   *   age: 25,
   * });
   * ```
   *
   * @param documentRef A reference to the document to be set.
   * @param data An object of the fields and values for the document.
   * @param options An object to configure the set behavior.
   */
  set(documentRef, data, options) {
    if (options === undefined) {
      // Call overload with 2 arguments.
      this.ref.set(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef, data);
    } else {
      // Call overload with 3 arguments.
      this.ref.set(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef, data, options);
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
   * const batch = firestore.batch();
   * const docRef = firestore.doc('users/alovelace');
   *
   * batch.update(docRef, {
   *   city: 'SF',
   * });
   * ```
   *
   * @param documentRef A reference to the document to be updated.
   * @param data An object containing the fields and values with which to update
   * the document. Fields can contain dots to reference nested fields within the
   * document.
   */

  update(documentRef, dataOrField, ...moreFieldsAndValues) {
    this.ref.update(documentRef instanceof _DocumentWrapper.default ? documentRef.ref : documentRef, dataOrField, ...moreFieldsAndValues);
    return this;
  }
}
var _default = WriteBatchWrapper;
exports.default = _default;