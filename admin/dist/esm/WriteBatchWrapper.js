import "core-js/modules/es.array.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.symbol.description.js";
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import DocumentWrapper from "./DocumentWrapper";

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

  /**
   * Creates a `WriteBatchWrapper` object around the specified `WriteBatch`
   * object.
   *
   * @param ref The `WriteBatch` object to wrap.
   */
  constructor(ref) {
    _defineProperty(this, "ref", void 0);
    this.ref = ref;
  }

  /**
   * Create the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`. The operation will fail the batch if a document exists
   * at the specified location.
   *
   * @param documentRef A reference to the document to be created.
   * @param data The object data to serialize as the document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @return This `WriteBatchWrapper` instance. Used for chaining method calls.
   */

  create(documentRef, data) {
    this.ref.create(documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef, data);
    return this;
  }

  /**
   * Write to the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`. If the document does not exist yet, it will be created.
   * If you pass `SetOptions`, the provided data can be merged into the existing
   * document.
   *
   * @param documentRef A reference to the document to be set.
   * @param data An object of the fields and values for the document.
   * @param options An object to configure the set behavior.
   * @param options.merge - If true, set() merges the values specified in its
   *        data argument. Fields omitted from this set() call remain untouched.
   *        If your input sets any field to an empty map, all nested fields are
   *        overwritten.
   * @param options.mergeFields - If provided, set() only replaces the specified
   *        field paths. Any field path that is not specified is ignored and
   *        remains untouched. If your input sets any field to an empty map, all
   *        nested fields are overwritten.
   * @throws Error If the provided input is not a valid Firestore document.
   * @return This `WriteBatch` instance. Used for chaining method calls.
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
   * Update fields of the document referred to by the provided
   * `DocumentReference` / `DocumentWrapper`. If the document doesn't yet exist,
   * the update fails and the entire batch will be rejected.
   *
   * Nested fields can be updated by providing dot-separated field path strings.
   *
   * @param documentRef A reference to the document to be updated.
   * @param data An object containing the fields and values with which to update
   *        the document.
   * @param precondition A Precondition to enforce on this update.
   * @throws Error If the provided input is not valid Firestore data.
   * @returns This `WriteBatchWrapper` instance. Used for chaining method calls.
   */

  update(documentRef, dataOrField, preconditionOrValue) {
    for (var _len = arguments.length, moreFieldsOrPrecondition = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      moreFieldsOrPrecondition[_key - 3] = arguments[_key];
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
   * @return This `WriteBatchWrapper` instance. Used for chaining method calls.
   */
  delete(documentRef, precondition) {
    this.ref.delete(documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef, precondition);
    return this;
  }

  /**
   * Commits all of the writes in this write batch as a single atomic unit.
   *
   * @return A Promise resolved once all of the writes in the batch have been
   *        successfully written to the backend as an atomic unit.
   */
  commit() {
    return this.ref.commit();
  }
}
export default WriteBatchWrapper;