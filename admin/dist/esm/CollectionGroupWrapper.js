import QueryWrapper from "./QueryWrapper";
/** A typed wrapper class around Firestore `CollectionGroup` objects. */
class CollectionGroupWrapper extends QueryWrapper {
  /** The raw Firebase `CollectionGroup` instance. */

  constructor(ref) {
    super(ref);
    this.ref = ref;
  }

  /**
   * Partitions a query by returning partition cursors that can be used to run
   * the query in parallel. The returned cursors are split points that can be
   * used as starting and end points for individual query invocations.
   *
   * @param desiredPartitionCount The desired maximum number of partition
   *        points. The number must be strictly positive. The actual number of
   *        partitions returned may be fewer.
   * @return An AsyncIterable of `QueryPartition`s.
   */
  getPartitions(desiredPartitionCount) {
    return this.ref.getPartitions(desiredPartitionCount);
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
    return new CollectionGroupWrapper(
    // Pretty stupid, but TypeScript forces us to choose one of the two
    // overloads, so we have to determine the type of `converter` before
    // passing it into `withConverter`, even though it's literally the same
    // function call.
    converter == null ? this.ref.withConverter(converter) : this.ref.withConverter(converter));
  }
}
export default CollectionGroupWrapper;