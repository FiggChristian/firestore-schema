"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/esnext.async-iterator.map.js");
require("core-js/modules/esnext.iterator.map.js");
var _DocumentWrapper = _interopRequireDefault(require("./DocumentWrapper"));
var _QueryWrapper = _interopRequireDefault(require("./QueryWrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CollectionWrapper extends _QueryWrapper.default
// eslint-disable-next-line @typescript-eslint/no-explicit-any
{
  /** The raw Firebase `CollectionReference` instance. */

  constructor(ref) {
    super(ref);
    this.ref = ref;
  }

  /** The identifier of the collection. */
  get id() {
    return this.ref.id;
  }

  /**
   * A reference to the containing `DocumentWrapper` if this is a subcollection,
   * else null.
   *
   * The returned `DocumentWrapper` will be **untyped** since this
   * `CollectionWrapper` only knows about its own children's schemas.
   */
  get parent() {
    return this.ref.parent != null ? new _DocumentWrapper.default(this.ref.parent) : null;
  }

  /**
   * A string representing the path of the referenced collection (relative to
   * the root of the database).
   */
  get path() {
    return this.ref.path;
  }

  /**
   * Retrieves the list of documents in this collection.
   *
   * The document references returned may include references to "missing
   * documents", i.e. document locations that have no document present but
   * which contain subcollections with documents. Attempting to read such a
   * document reference (e.g. via `.get()` or `.onSnapshot()`) will return a
   * `DocumentSnapshot` whose `.exists` property is false.
   *
   * @return The list of documents in this collection.
   */
  listDocuments() {
    return this.ref.listDocuments().then(docs => docs.map(doc => new _DocumentWrapper.default(doc)));
  }

  /**
   * Get a `DocumentWrapper` for a randomly-named document within this
   * collection. An automatically-generated unique ID will be used as the
   * document ID.
   *
   * The collection(s) referred to by this `CollectionWrapper` must have a
   * document schema for all `string` keys since a random string ID will be
   * generated. Otherwise, this function will return `never`.
   *
   * @example
   * ```ts
   * const documentWithNoSchema = new CollectionWrapper<{
   *   documentName: {
   *     [DOCUMENT_SCHEMA]: { ... }
   *   },
   *   anotherDocumentName: { ... }
   * }>( ... ).doc();
   * // Since the collection only has two documents (i.e., `"documentName"` and
   * // `"anotherDocumentName"`), `doc()` can't create a new document with a random
   * // ID, so it returns `never`.
   *
   * const documentWithValidSchema = new CollectionWrapper<{
   *   [documentName: string]: {
   *     [DOCUMENT_SCHEMA]: { ... }
   *   }
   * }>( ... ).doc();
   * // This collection supports documents of any name (because of the
   * // `[documentName: string]`), so `doc()` knows which schema to use, and it
   * // succeeds.
   * ```
   *
   * @return The `DocumentWrapper` instance.
   */
  // We have to tell prettier to ignore this section because it doesn't like
  // comments in between lines of more complex types like this :(
  // prettier-ignore

  doc(documentName) {
    return typeof documentName === "string" ? new _DocumentWrapper.default(this.ref.doc(documentName)) : new _DocumentWrapper.default(this.ref.doc());
  }

  /**
   * Add a new document to this collection with the specified data, assigning it
   * a document ID automatically.
   *
   * The collection(s) referred to by this `CollectionWrapper` must have a
   * document schema for all `string` keys since a random string ID will be
   * generated. Otherwise, this function will return `never`.
   *
   * @example
   * ```ts
   * new CollectionWrapper<{
   *   documentName: {
   *     [DOCUMENT_SCHEMA]: { ... }
   *   },
   *   anotherDocumentName: { ... }
   * }>( ... ).add( ... );
   * // Since the collection only has two documents (i.e., `"documentName"` and
   * // `"anotherDocumentName"`), `add()` can't create a new document with a random
   * // ID, so `add()`'s parameter is `never`.
   *
   * const documentWithValidSchema = new CollectionWrapper<{
   *   [documentName: string]: {
   *     [DOCUMENT_SCHEMA]: {
   *       someDocumentSchemaKey: unknown;
   *       ...
   *     }
   *   }
   * }>( ... ).add({
   *   someDocumentSchemaKey: "some value"
   *   ...
   * });
   * // This collection supports documents of any name (because of the
   * // `[documentName: string]`), so `doc()` knows which schema to use, and it
   * // succeeds.
   * ```
   *
   * @param data An object containing the data for the new document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @return A Promise resolved with a `DocumentWrapper` pointing to the newly
   *        created document after it has been written to the backend.
   */

  add(data) {
    // Wrap the returned `DocumentReference` in a `DocumentWrapper` after the
    // Promise returns.
    return this.ref.add(data).then(ref => new _DocumentWrapper.default(ref));
  }

  /**
   * Returns true if this `CollectionWrapper` is equal to the provided one.
   *
   * @param other The `CollectionWrapper` to compare against.
   * @return true if this `CollectionWrapper` is equal to the provided one.
   */

  isEqual(other) {
    return other instanceof CollectionWrapper ? this.ref.isEqual(other.ref) : this.ref.isEqual(other);
  }

  /**
   * Applies a custom data converter to this `CollectionWrapper`, allowing you
   * to use your own custom model objects with Firestore. When you call `get()`
   * on the returned `CollectionWrapper`, the provided converter will convert
   * between Firestore data and your custom type `U`.
   *
   * @param converter Converts objects to and from Firestore. Passing in `null`
   *        removes the current converter.
   * @return A `CollectionWrapper<U>` that uses the provided converter.
   */

  withConverter(converter) {
    return new CollectionWrapper(
    // Pretty stupid, but TypeScript forces us to choose one of the two
    // overloads, so we have to determine the type of `converter` before
    // passing it into `withConverter`, even though it's literally the same
    // function call.
    converter == null ? this.ref.withConverter(converter) : this.ref.withConverter(converter));
  }
}
var _default = CollectionWrapper;
exports.default = _default;