"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestoreTypes.Query `Query`} objects.
 *
 * Instances of this class are usually created automatically by calling
 * different methods on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const queryWrapper = firestore.collectionGroup("collectionName");
 * ```
 *
 * It includes the same methods as the underlying `Query` object with the same
 * behavior so that it can be used interchangeably. It also includes the
 * following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
class QueryWrapper {
  /** The raw Firebase `Query` instance. */
  ref;

  /**
   * Creates a typed `QueryWrapper` object around the specified `Query` object.
   *
   * @param ref The `Query` object to wrap.
   */
  constructor(ref) {
    this.ref = ref;
  }

  /**
   * Calculates the number of documents in the result set of the given query,
   * without actually downloading the documents.
   *
   * Using this function to count the documents is efficient because only the
   * final count, not the documents' data, is downloaded. This function can even
   * count the documents if the result set would be prohibitively large to
   * download entirely (e.g. thousands of documents).
   *
   * The result received from the server is presented, unaltered, without
   * considering any local state. That is, documents in the local cache are not
   * taken into consideration, neither are local modifications not yet
   * synchronized with the server. Previously-downloaded results, if any, are
   * not used: every request using this source necessarily involves a round trip
   * to the server.
   */
  count() {
    return this.ref.count();
  }

  /** Same as `count()`. */
  countFromServer() {
    return this.ref.countFromServer();
  }

  /**
   * Creates and returns a new `QueryWrapper` that ends at the provided document
   * (inclusive). The end position is relative to the order of the query. The
   * document must contain all of the fields provided in the orderBy of this
   * query.
   *
   * @example
   * ```ts
   * const user = await firestore.doc('users/alovelace').get();
   *
   * // Get all users up to a specific user in order of age
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .endAt(user);
   * ```
   *
   * @param snapshot The snapshot of the document to end at.
   * @returns The created `QueryWrapper`.
   */

  endAt(snapshotOrFieldValue, ...additionalFieldValues) {
    return new QueryWrapper(this.ref.endAt(snapshotOrFieldValue, ...additionalFieldValues));
  }

  /**
   * Creates and returns a new `QueryWrapper` that ends before the provided
   * document (exclusive). The end position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @example
   * ```ts
   * const user = await firestore.doc('users/alovelace').get();
   *
   * // Get all users up to, but not including, a specific user in order of age
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .endBefore(user);
   * ```
   *
   * @param snapshot The snapshot of the document to end before.
   * @returns The created `QueryWrapper`.
   */

  endBefore(snapshotOrFieldValue, ...additionalFieldValues) {
    return new QueryWrapper(this.ref.endBefore(snapshotOrFieldValue, ...additionalFieldValues));
  }

  /**
   * Executes the query and returns the results as a QuerySnapshot.
   *
   * Note: By default, get() attempts to provide up-to-date data when possible
   * by waiting for data from the server, but it may return cached data or fail
   * if you are offline and the server cannot be reached. This behavior can be
   * altered via the `GetOptions` parameter.
   *
   * @example
   * ```ts
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .get({
   *     source: 'server',
   *   });
   * ```
   *
   * @param options An object to configure the get behavior.
   * @returns A Promise that will be resolved with the results of the Query.
   */
  get(options) {
    if (options === undefined) {
      // Call overload with 0 arguments.
      return this.get();
    } else {
      // Call overload with 1 argument.
      return this.ref.get(options);
    }
  }

  /**
   * Returns true if this `QueryWrapper` is equal to the provided one.
   *
   * @param other The `QueryWrapper` to compare against.
   * @returns true if this `QueryWrapper` is equal to the provided one.
   */

  isEqual(other) {
    return this.ref.isEqual(other instanceof QueryWrapper ? other.ref : other);
  }

  /**
   * Creates and returns a new `QueryWrapper` where the results are limited to the
   * specified number of documents.
   *
   * @example
   * ```ts
   * // Get 10 users in order of age
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .limit(10)
   *   .get();
   * ```
   *
   * @param limit The maximum number of items to return.
   * @returns The created `QueryWrapper`.
   */
  limit(limit) {
    return new QueryWrapper(this.ref.limit(limit));
  }

  /**
   * Creates and returns a new `QueryWrapper` where the results are limited to
   * the specified number of documents starting from the last document. The
   * order is dependent on the second parameter for the `orderBy` method. If
   * `desc` is used, the order is reversed. `orderBy` method call is required
   * when calling `limitToLast`.
   *
   * @example
   * ```ts
   * // Get the last 10 users in reverse order of age
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age', 'desc')
   *   .limitToLast(10)
   *   .get();
   * ```
   *
   * @param limitToLast The maximum number of items to return.
   * @returns The created `QueryWrapper`.
   */
  limitToLast(limit) {
    return new QueryWrapper(this.ref.limitToLast(limit));
  }

  /**
   * Attaches a listener for `QuerySnapshot` events.
   *
   * > Although an `onCompletion` callback can be provided, it will never be
   * > called because the snapshot stream is never-ending.
   *
   * Returns an unsubscribe function to stop listening to events.
   *
   * @example
   * ```ts
   * const unsubscribe = firestore.collection('users')
   *   .onSnapshot({
   *     error: (e) => console.error(e),
   *     next: (querySnapshot) => {},
   *   });
   *
   * unsubscribe();
   * ```
   *
   * @param observer A single object containing `next` and `error` callbacks.
   * @returns An unsubscribe function that can be called to cancel the snapshot
   * listener.
   */

  onSnapshot(observerOrOptionsOrOnNext, observerOrOnErrorOrOnNext, onCompletionOrOnError, onCompletion) {
    if (onCompletion !== undefined) {
      // Call overload with all 4 arguments. The actual types don't matter
      // because the JavaScript implementation will take care of the type
      // checking.
      return this.ref.onSnapshot(observerOrOptionsOrOnNext, observerOrOnErrorOrOnNext, onCompletionOrOnError, onCompletion);
    } else if (onCompletionOrOnError !== undefined) {
      // Call overload with 3/4 arguments. The actual types don't matter because
      // the JavaScript implementation will take care of the type checking.
      return this.ref.onSnapshot(observerOrOptionsOrOnNext, observerOrOnErrorOrOnNext, onCompletionOrOnError);
    } else if (observerOrOnErrorOrOnNext !== undefined) {
      // Call overload 2/4 arguments. The actual types don't matter because the
      // JavaScript implementation will take care of the type checking.
      return this.ref.onSnapshot(observerOrOptionsOrOnNext, observerOrOnErrorOrOnNext);
    } else {
      // Call overload with 1/4 arguments. The actual types don't matter because
      // the JavaScript implementation will take care of the type checking.
      return this.ref.onSnapshot(observerOrOptionsOrOnNext);
    }
  }

  /**
   * Creates and returns a new `QueryWrapper` that's additionally sorted by the
   * specified field, optionally in descending order instead of ascending.
   *
   * @example
   * ```ts
   * // Get users in order of age, descending
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age', 'desc')
   *   .get();
   * ```
   *
   * @param fieldPath The field to sort by. Either a string or FieldPath
   * instance.
   * @param directionStr Optional direction to sort by (`asc` or `desc`). If not
   * specified, order will be ascending.
   * @returns The created `QueryWrapper`.
   */
  orderBy(fieldPath, directionStr) {
    if (directionStr === undefined) {
      // Call overload with 1 argument.
      return new QueryWrapper(this.ref.orderBy(fieldPath));
    } else {
      // Call overload with 2 arguments.
      return new QueryWrapper(this.ref.orderBy(fieldPath, directionStr));
    }
  }

  /**
   * Creates and returns a new `QueryWrapper` that starts after the provided
   * document (exclusive). The start position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @example
   * ```ts
   * const user = await firestore.doc('users/alovelace').get();
   *
   * // Get all users up to, but not including, a specific user in order of age
   * const querySnapshot = firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .startAfter(user)
   *   .get();
   * ```
   *
   * @param snapshot The snapshot of the document to start after.
   * @returns The created `QueryWrapper`.
   */

  startAfter(snapshotOrFieldValue, ...additionalFieldValues) {
    return new QueryWrapper(this.ref.startAfter(snapshotOrFieldValue, ...additionalFieldValues));
  }

  /**
   * Creates and returns a new `QueryWrapper` that starts at the provided
   * document (inclusive). The start position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @example
   * ```ts
   * const user = await firestore.doc('users/alovelace').get();
   *
   * // Get all users up to a specific user in order of age
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .startAt(user)
   *   .get();
   * ```
   *
   * @param snapshot The snapshot of the document to start at.
   * @returns The created `QueryWrapper`.
   */

  startAt(snapshotOrFieldValue, ...additionalFieldValues) {
    return new QueryWrapper(this.ref.startAt(snapshotOrFieldValue, ...additionalFieldValues));
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
   * @returns The created `QueryWrapper`.
   */

  where(fieldPathOrFilter, opStr, value) {
    return new QueryWrapper(this.ref.where(fieldPathOrFilter, opStr, value));
  }
  // #endregion
}
var _default = QueryWrapper;
exports.default = _default;