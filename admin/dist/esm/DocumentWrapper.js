import "core-js/modules/es.array.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.symbol.description.js";
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import CollectionWrapper from "./CollectionWrapper";
class DocumentWrapper {
  /**
   * The raw Firebase `DocumentReference` instance.
   */

  constructor(ref) {
    _defineProperty(this, "ref", void 0);
    this.ref = ref;
  }

  /**
   * Gets a `CollectionWrapper` instance that refers to the subcollection with
   * the specified name.
   *
   * @param collectionName The name of a subcollection in the document.
   * @return The `CollectionWrapper` instance.
   */
  collection(collectionName) {
    return new CollectionWrapper(this.ref.collection(collectionName));
  }

  /**
   * Creates a document referred to by this `DocumentWrapper` with the provided
   * object values. The write fails if the document already exists
   *
   * @param data The object data to serialize as the document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @return A Promise resolved with the write time of this create.
   */
  create(data) {
    return this.ref.create(data);
  }

  /**
   * Writes to the document referred to by this `DocumentWrapper`. If the
   * document does not yet exist, it will be created.
   *
   * @param data A map of the fields and values for the document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @return A Promise resolved with the write time of this set.
   */

  set(data, options) {
    if (options === undefined) {
      return this.ref.set(data);
    } else {
      return this.ref.set(data, options);
    }
  }

  /**
   * Updates fields in the document referred to by this `DocumentWrapper`. The
   * update will fail if applied to a document that does not exist.
   *
   * Nested fields can be updated by providing dot-separated field path strings.
   *
   * @param data An object containing the fields and values with which to update
   *        the document.
   * @param precondition A Precondition to enforce on this update.
   * @throws Error If the provided input is not valid Firestore data.
   * @return A Promise resolved with the write time of this update.
   */

  update(dataOrField, preconditionOrValue) {
    for (var _len = arguments.length, moreFieldsOrPrecondition = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      moreFieldsOrPrecondition[_key - 2] = arguments[_key];
    }
    // Firestore has two function overloads for `update()` that aren't
    // compatible with each other. Instead of trying to play with TypeScript to
    // get it to work somehow, just choose the second function overload since
    // the implementation of `update()` should be able to handle either one.
    return this.ref.update(dataOrField, preconditionOrValue, ...moreFieldsOrPrecondition);
  }

  /**
   * Deletes the document referred to by this `DocumentWrapper`.
   *
   * @param precondition A Precondition to enforce for this delete.
   * @return A Promise resolved with the write time of this delete.
   */
  delete(precondition) {
    return this.ref.delete(precondition);
  }

  /**
   * Reads the document referred to by this `DocumentWrapper`.
   *
   * @return A Promise resolved with a `DocumentSnapshot` containing the
   *        current document contents.
   */
  get() {
    return this.ref.get();
  }

  /**
   * Attaches a listener for DocumentSnapshot events.
   *
   * @param onNext A callback to be called every time a new `DocumentSnapshot`
   *        is available.
   * @param onError A callback to be called if the listen fails or is
   *        cancelled. No further callbacks will occur.
   * @return An unsubscribe function that can be called to cancel
   *        the snapshot listener.
   */
  onSnapshot(onNext, onError) {
    return this.ref.onSnapshot(onNext, onError);
  }
}
export default DocumentWrapper;