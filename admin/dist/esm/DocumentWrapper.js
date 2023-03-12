import "core-js/modules/esnext.async-iterator.map.js";
import "core-js/modules/esnext.iterator.map.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.symbol.description.js";
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import CollectionWrapper from "./CollectionWrapper";

/** A typed wrapper class around Firestore `DocumentReference` objects. */
class DocumentWrapper {
  /** The raw Firebase `DocumentReference` instance. */

  constructor(ref) {
    _defineProperty(this, "ref", void 0);
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
    return new CollectionWrapper(this.ref.parent);
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
    return new CollectionWrapper(this.ref.collection(collectionName));
  }

  /**
   * Fetches the subcollections that are direct children of this document.
   *
   * @returns A Promise that resolves with an array of `CollectionWrapper`s.
   */
  listCollections() {
    return this.ref.listCollections().then(collections => collections.map(collection => new CollectionWrapper(collection)));
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

  update(dataOrField, preconditionOrValue) {
    for (var _len = arguments.length, moreFieldsOrPrecondition = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      moreFieldsOrPrecondition[_key - 2] = arguments[_key];
    }
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
export default DocumentWrapper;