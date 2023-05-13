"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CollectionWrapper = _interopRequireDefault(require("./CollectionWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestoreTypes.DocumentReference `DocumentReference`} objects.
 *
 * Instances of this class are usually created automatically by calling `.doc()`
 * on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
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

  /** The identifier of the document within its collection. */
  get id() {
    return this.ref.id;
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
   * @returns The `CollectionWrapper` instance.
   */
  collection(collectionName) {
    return new _CollectionWrapper.default(this.ref.collection(collectionName));
  }

  /**
   * Deletes the document referred to by this `DocumentWrapper`.
   *
   * @example
   * ```ts
   * await firestore.doc('users/alovelace').delete();
   * ```
   *
   * @returns A Promise that is resolved once the document has been successfully
   * deleted from the backend (note that it won't resolve while you're offline).
   */
  delete() {
    return this.ref.delete();
  }

  /**
   * Reads the document referred to by this DocumentReference.
   *
   * Note: By default, `get()` attempts to provide up-to-date data when possible
   * by waiting for data from the server, but it may return cached data or fail
   * if you are offline and the server cannot be reached. This behavior can be
   * altered via the `GetOptions` parameter.
   *
   * @example
   * ```ts
   * await firestore.doc('users/alovelace').get({
   *   source: 'server',
   * });
   * ```
   *
   * @param options An object to configure the get behavior.
   */

  get(options) {
    if (options === undefined) {
      // Call overload with 0 arguments.
      return this.ref.get();
    } else {
      // Call overload with 1 argument.
      return this.ref.get(options);
    }
  }

  /**
   * Returns true if this `DocumentWrapper` is equal to the provided one.
   *
   * @example
   * ```ts
   * const alovelace = firestore.doc('users/alovelace');
   * const dsmith = firestore.doc('users/dsmith');
   *
   * // false
   * alovelace.isEqual(dsmith);
   * ```
   *
   * @param other The `DocumentReference` to compare against.
   * @returns `true` if this `DocumentWrapper` is equal to the provided one.
   */

  isEqual(other) {
    return other instanceof DocumentWrapper ? this.ref.isEqual(other.ref) : this.ref.isEqual(other);
  }

  /**
   * Attaches a listener for DocumentSnapshot events.
   *
   * NOTE: Although an complete callback can be provided, it will never be
   * called because the snapshot stream is never-ending.
   *
   * Returns an unsubscribe function to stop listening to events.
   *
   * @example
   * ```ts
   * const unsubscribe = firestore.doc('users/alovelace')
   *   .onSnapshot({
   *     error: (e) => console.error(e),
   *     next: (documentSnapshot) => {},
   *   });
   *
   * unsubscribe();
   * ```
   *
   * @param observer A single object containing `next` and `error` callbacks.
   * @returns An unsubscribe function that can be called to cancel the snapshot
   * listener.
   */

  onSnapshot(observerOrOptionsOrOnComplete, observerOrOnErrorOrOnNext, onCompletionOrOnError, onCompletion) {
    if (onCompletion !== undefined) {
      // Call overload with all 4 arguments. The actual types don't matter
      // because the JavaScript implementation will take care of the type
      // checking.
      return this.ref.onSnapshot(observerOrOptionsOrOnComplete, observerOrOnErrorOrOnNext, onCompletionOrOnError, onCompletion);
    } else if (onCompletionOrOnError !== undefined) {
      // Call overload with 3/4 arguments. The actual types don't matter because
      // the JavaScript implementation will take care of the type checking.
      return this.ref.onSnapshot(observerOrOptionsOrOnComplete, observerOrOnErrorOrOnNext, onCompletionOrOnError);
    } else if (observerOrOnErrorOrOnNext !== undefined) {
      // Call overload 2/4 arguments. The actual types don't matter because the
      // JavaScript implementation will take care of the type checking.
      return this.ref.onSnapshot(observerOrOptionsOrOnComplete, observerOrOnErrorOrOnNext);
    } else {
      // Call overload with 1/4 arguments. The actual types don't matter because
      // the JavaScript implementation will take care of the type checking.
      return this.ref.onSnapshot(observerOrOptionsOrOnComplete);
    }
  }

  /**
   * Writes to the document referred to by this `DocumentReference` /
   * `DocumentWrapper`. If the document does not yet exist, it will be created.
   * If you pass SetOptions, the provided data can be merged into an existing
   * document.
   *
   * @example
   * ```ts
   * const user = firestore.doc('users/alovelace');
   *
   * // Set new data
   * await user.set({
   *   name: 'Ada Lovelace',
   *   age: 30,
   *   city: 'LON',
   * });
   * ```
   *
   * @param data A map of the fields and values for the document.
   * @param options An object to configure the set behavior.
   * @returns A Promise resolved once the data has been successfully written
   * to the backend.
   */
  set(data, options) {
    if (options === undefined) {
      // Call overload with 1 argument.
      return this.ref.set(data);
    } else {
      // Call overload with 2 arguments.
      return this.ref.set(data, options);
    }
  }

  /**
   * Updates fields in the document referred to by this `DocumentReference` /
   * `DocumentWrapper`. The update will fail if applied to a document that does
   * not exist.
   *
   * @example
   * ```ts
   * const user = firestore.doc('users/alovelace');
   *
   * // Update age but leave other fields untouched
   * await user.update({
   *   age: 31,
   * });
   * ```
   *
   * @param data An object containing the fields and values with which to update
   * the document. Fields can contain dots to reference nested fields within the
   * document.
   * @returns A Promise resolved once the data has been successfully written
   * to the backend.
   */

  update(dataOrField, value, ...moreFieldsAndValues) {
    if (typeof dataOrField === "object") {
      // Call overload with 1 argument.
      return this.ref.update(dataOrField);
    } else {
      // Call overload with 2+ arguments.
      return this.ref.update(dataOrField, value, ...moreFieldsAndValues);
    }
  }
}
var _default = DocumentWrapper;
exports.default = _default;