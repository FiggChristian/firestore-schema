"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _types = require("./types");
class QueryWrapper {
  /**
   * The raw Firebase `Query` instance.
   */
  ref;
  constructor(ref) {
    this.ref = ref;
  }

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

  where(fieldPath, opStr, value) {
    return new QueryWrapper(this.ref.where(fieldPath, opStr, value));
  }

  /**
   * Creates and returns a new `QueryWrapper` that's additionally sorted by the
   * specified field, optionally in descending order instead of ascending.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the order.
   *
   * @param fieldPath The field to sort by.
   * @param directionStr Optional direction to sort by ('asc' or 'desc'). If not
   * specified, order will be ascending.
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

  select(...field) {
    return new QueryWrapper(this.ref.select(...field));
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
  startAt(snapshot) {
    return new QueryWrapper(this.ref.startAt(snapshot));
  }
}
var _default = QueryWrapper;
exports.default = _default;