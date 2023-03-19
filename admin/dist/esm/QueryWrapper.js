import "core-js/modules/es.array.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.symbol.description.js";
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * A type that filters out documents from `Collection`, which can be a single
 * `Collection` or a union of `Collection`s, that do not have have the specified
 * key in their schema. This will maintain the original structure of the
 * `Collection`(s) instead of combining their results into a single `Collection`
 * object or union of many different `Collection`s.
 */

/**
 * A type that filters out documents from `Collection`, which can be a single
 * `Collection` or a union of `Collection`s, that do not have have the specified
 * key in their schema, or where the associated value does not extend `Extends`.
 * This will maintain the original structure of the `Collection`(s) instead of
 * combining their results into a single `Collection` object or union of many
 * different `Collection`s.
 *
 * This type does the same as `EnsureDocumentHasKey`, with the additional check
 * that the value at the specified key extends `Extends`.
 */

/**
 * A type that filters out documents from `Collection`, which can be a single
 * `Collection` or a union of `Collection`s, that do not have have the specified
 * key in their schema, or where `Extends` does not extend the associated value.
 * This will maintain the original structure of the `Collection`(s) instead of
 * combining their results into a single `Collection` object or union of many
 * different `Collection`s.
 *
 * This type does the same as `EnsureDocumentHasKey`, with the additional check
 * that `Extends` extends the value at the specified key.
 */

/** A typed wrapper class around Firestore `Query` objects. */
class QueryWrapper {
  /** The raw Firebase `Query` instance. */

  /**
   * Creates a typed `QueryWrapper` object around the specified `Query` object.
   *
   * @param ref The `Query` object to wrap.
   */
  constructor(ref) {
    _defineProperty(this, "ref", void 0);
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

  // #region where overloads
  // This section includes a bunch of overloads for the `where` method. Each
  // operator type (e.g., `==`, `in`, etc.) contains different return types so
  // that the document types are filtered as best as possible by TypeScript. For
  // example, using the `array-contains` operator filters out to include only
  // documents whose corresponding key points to an array that could contain the
  // filtered type. This makes it more type-safe when using `collectionGroup`
  // because it forces you to filter documents you may not have considered were
  // matched, but that were caught by TypeScript.
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */

  where(fieldPathOrFilter, opStr, value) {
    return new QueryWrapper(this.ref.where(fieldPathOrFilter, opStr, value));
  }
  // #endregion

  /**
   * Creates and returns a new `QueryWrapper` that's additionally sorted by the
   * specified field, optionally in descending order instead of ascending.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the order.
   *
   * @param fieldPath The field to sort by.
   * @param directionStr Optional direction to sort by ('asc' or 'desc'). If not
   *        specified, order will be ascending.
   * @return The created `QueryWrapper`.
   */
  orderBy(fieldPath, directionStr) {
    return new QueryWrapper(this.ref.orderBy(fieldPath, directionStr));
  }

  /**
   * Creates and returns a new `QueryWrapper` that only returns the first
   * matching documents.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the limit.
   *
   * @param limit The maximum number of items to return.
   * @return The created `QueryWrapper`.
   */
  limit(limit) {
    return new QueryWrapper(this.ref.limit(limit));
  }

  /**
   * Creates and returns a new `QueryWrapper` that only returns the last
   * matching documents.
   *
   * You must specify at least one `orderBy` clause for `limitToLast` queries,
   * otherwise an exception will be thrown during execution.
   *
   * Results for `limitToLast` queries cannot be streamed via the `stream()`
   * API.
   *
   * @param limit The maximum number of items to return.
   * @return The created `QueryWrapper`.
   */
  limitToLast(limit) {
    return new QueryWrapper(this.ref.limitToLast(limit));
  }

  /**
   * Specifies the offset of the returned results.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the offset.
   *
   * @param offset The offset to apply to the `QueryWrapper` results.
   * @return The created `QueryWrapper`.
   */
  offset(offset) {
    return new QueryWrapper(this.ref.offset(offset));
  }

  /**
   * Creates and returns a new `QueryWrapper` instance that applies a field mask
   * to the result and returns only the specified subset of fields. You can
   * specify a list of field paths to return, or use an empty list to only
   * return the references of matching documents.
   *
   * Queries that contain field masks cannot be listened to via `onSnapshot()`
   * listeners.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the field mask.
   *
   * @param field The field paths to return.
   * @return The created `QueryWrapper`.
   */
  // This overload is a special case where the user passes *no* fields at all,
  // which means *no* fields will appear in the resulting documents. All
  // documents' schemas have all their data stripped, leaving only an empty
  // object.

  select() {
    return new QueryWrapper(this.ref.select(...arguments));
  }

  /**
   * Creates and returns a new `QueryWrapper` that starts at the provided
   * document (inclusive). The starting position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @param snapshot The snapshot of the document to start after.
   * @return The created `QueryWrapper`.
   */

  startAt(snapshotOrFieldValue) {
    for (var _len = arguments.length, additionalFieldValues = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      additionalFieldValues[_key - 1] = arguments[_key];
    }
    return new QueryWrapper(this.ref.startAt(snapshotOrFieldValue, ...additionalFieldValues));
  }

  /**
   * Creates and returns a new `QueryWrapper` that starts after the provided
   * document (exclusive). The starting position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @param snapshot The snapshot of the document to start after.
   * @return The created `QueryWrapper`.
   */

  startAfter(snapshotOrFieldValue) {
    for (var _len2 = arguments.length, additionalFieldValues = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      additionalFieldValues[_key2 - 1] = arguments[_key2];
    }
    return new QueryWrapper(this.ref.startAfter(snapshotOrFieldValue, ...additionalFieldValues));
  }

  /**
   * Creates and returns a new `QueryWrapper` that ends before the provided
   * document (exclusive). The end position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @param snapshot The snapshot of the document to end before.
   * @return The created `QueryWrapper`.
   */

  endBefore(snapshotOrFieldValue) {
    for (var _len3 = arguments.length, additionalFieldValues = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      additionalFieldValues[_key3 - 1] = arguments[_key3];
    }
    return new QueryWrapper(this.ref.endBefore(snapshotOrFieldValue, ...additionalFieldValues));
  }

  /**
   * Creates and returns a new `QueryWrapper` that ends at the provided document
   * (inclusive). The end position is relative to the order of the query. The
   * document must contain all of the fields provided in the orderBy of this
   * query.
   *
   * @param snapshot The snapshot of the document to end at.
   * @return The created `QueryWrapper`.
   */

  endAt(snapshotOrFieldValue) {
    for (var _len4 = arguments.length, additionalFieldValues = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      additionalFieldValues[_key4 - 1] = arguments[_key4];
    }
    return new QueryWrapper(this.ref.endAt(snapshotOrFieldValue, ...additionalFieldValues));
  }

  /**
   * Executes the query and returns the results as a `QuerySnapshot`.
   *
   * @return A Promise that will be resolved with the results of the
   *        `QueryWrapper`.
   */
  get() {
    return this.ref.get();
  }

  /**
   * Executes the query and returns the results as Node Stream.
   *
   * @returns A stream of `QueryDocumentSnapshot`.
   */
  stream() {
    return this.ref.stream();
  }

  /**
   * Attaches a listener for `QuerySnapshot `events.
   *
   * @param onNext A callback to be called every time a new `QuerySnapshot`
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
   * Returns a query that counts the documents in the result set of this query.
   *
   * The returned query, when executed, counts the documents in the result set
   * of this query without actually downloading the documents.
   *
   * Using the returned query to count the documents is efficient because only
   * the final count, not the documents' data, is downloaded. The returned query
   * can even count the documents if the result set would be prohibitively large
   * to download entirely (e.g. thousands of documents).
   *
   * @return A query that counts the documents in the result set of this query.
   *        The count can be retrieved from `snapshot.data().count`, where
   *        `snapshot` is the `AggregateQuerySnapshot` resulting from running
   *        the returned query.
   */
  count() {
    return this.ref.count();
  }

  /**
   * Returns true if this `QueryWrapper` is equal to the provided one.
   *
   * @param other The `QueryWrapper` to compare against.
   * @return true if this `QueryWrapper` is equal to the provided one.
   */

  isEqual(other) {
    return this.ref.isEqual(other instanceof QueryWrapper ? other.ref : other);
  }

  /**
   * Applies a custom data converter to this `QueryWrapper`, allowing you to use
   * your own custom model objects with Firestore. When you call `get()` on the
   * returned `QueryWrapper`, the provided converter will convert between
   * Firestore data and your custom type `U`.
   *
   * @param converter Converts objects to and from Firestore. Passing in `null`
   *        removes the current converter.
   * @return A `QueryWrapper<U>` that uses the provided converter.
   */

  withConverter(converter) {
    return new QueryWrapper(
    // Pretty stupid, but TypeScript forces us to choose one of the two
    // overloads, so we have to determine the type of `converter` before
    // passing it into `withConverter`, even though it's literally the same
    // function call.
    converter == null ? this.ref.withConverter(converter) : this.ref.withConverter(converter));
  }
}
export default QueryWrapper;