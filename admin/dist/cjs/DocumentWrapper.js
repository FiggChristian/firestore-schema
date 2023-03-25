"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/esnext.async-iterator.map.js");
require("core-js/modules/esnext.iterator.map.js");
var _CollectionWrapper = _interopRequireDefault(require("./CollectionWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.DocumentReference `DocumentReference`} objects.
 *
 * Instances of this class are usually created automatically by calling `.doc()`
 * on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * const documentWrapper = firestore.doc("path/to/your/document");
 * ```
 *
 * It includes the same methods as the underlying `DocumentReference` object
 * with the same behavior so that it can be used interchangeably. It also
 * includes the following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
class DocumentWrapper {
  /** The raw Firebase `DocumentReference` instance. */
  ref;

  /**
   * Creates a typed `DocumentWrapper` object around the specified
   * `DocumentReference` object.
   *
   * @param ref The `DocumentReference` object to wrap.
   */
  constructor(ref) {
    this.ref = ref;
  }

  /** The identifier of the document within its collection. */
  get id() {
    return this.ref.id;
  }

  /**
   * The `Firestore` for the Firestore database (useful for performing
   * transactions, etc.).
   */
  get firestore() {
    // This is wrapped in a getter instead of being assigned directly because
    // the implementation of `Query.firestore` is also a getter, and thus not
    // guaranteed to return the same value every time (even though I'm pretty
    // sure it does, but to ensure consistency in future version...).
    return this.ref.firestore;
  }

  /**
   * A reference to the `CollectionWrapper` to which this `DocumentWrapper`
   * belongs.
   *
   * The returned `CollectionWrapper` will be **untyped** since this
   * `DocumentWrapper` only knows about its own children's schemas.
   */
  get parent() {
    return new _CollectionWrapper.default(this.ref.parent);
  }

  /**
   * A string representing the path of the referenced document (relative
   * to the root of the database).
   */
  get path() {
    return this.ref.path;
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
   * Fetches the subcollections that are direct children of this document.
   *
   * @returns A Promise that resolves with an array of `CollectionWrapper`s.
   */
  listCollections() {
    return this.ref.listCollections().then(collections => collections.map(collection => new _CollectionWrapper.default(collection)));
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
   * Updates fields in the DOcument referred to by this `DocumentWrapper`. The
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
    // get it to work somehow, we just choose the second function overload since
    // the actual JavaScript implementation of `update()` should be able to
    // handle either one anyway.
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

  /**
   * Returns true if this `DocumentWrapper` is equal to the provided one.
   *
   * @param other The `DocumentWrapper` to compare against.
   * @return true if this `DocumentWrapper` is equal to the provided one.
   */

  isEqual(other) {
    return other instanceof DocumentWrapper ? this.ref.isEqual(other.ref) : this.ref.isEqual(other);
  }

  /**
   * Applies a custom data converter to this `DocumentWrapper`, allowing you to
   * use your own custom model objects with Firestore. When you call `get()` on
   * the returned `DocumentWrapper`, the provided converter will convert between
   * Firestore data and your custom type `U`.
   *
   * @param converter Converts objects to and from Firestore. Passing in `null`
   *        removes the current converter.
   * @return A `DocumentWrapper<U>` that uses the provided converter.
   */

  withConverter(converter) {
    return new DocumentWrapper(
    // Pretty stupid, but TypeScript forces us to choose one of the two
    // overloads, so we have to determine the type of `converter` before
    // passing it into `withConverter`, even though it's literally the same
    // function call.
    converter == null ? this.ref.withConverter(converter) : this.ref.withConverter(converter));
  }
}
var _default = DocumentWrapper;
exports.default = _default;