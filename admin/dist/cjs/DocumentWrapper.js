"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CollectionWrapper = _interopRequireDefault(require("./CollectionWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class DocumentWrapper {
  /**
   * The raw Firebase `DocumentReference` instance.
   */
  ref;
  constructor(ref) {
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
    return new _CollectionWrapper.default(this.ref.collection(collectionName));
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

  update(dataOrField, preconditionOrValue, ...moreFieldsOrPrecondition) {
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
var _default = DocumentWrapper;
exports.default = _default;