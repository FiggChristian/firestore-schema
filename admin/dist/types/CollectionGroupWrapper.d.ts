import QueryWrapper from "./QueryWrapper";
import type { DefaultIfNever, GenericFirestoreCollection, SchemaOfCollection } from "./types";
import type { CollectionGroup, DocumentData, FirestoreDataConverter, QueryPartition } from "firebase-admin/firestore";
/** A typed wrapper class around Firestore `CollectionGroup` objects. */
declare class CollectionGroupWrapper<Collection extends GenericFirestoreCollection, ConvertedType = never> extends QueryWrapper<Collection, ConvertedType> implements CollectionGroup<DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>> {
    /** The raw Firebase `CollectionGroup` instance. */
    ref: CollectionGroup<DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>>;
    constructor(ref: CollectionGroup<ConvertedType | DocumentData>);
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
    getPartitions(desiredPartitionCount: number): AsyncIterable<QueryPartition<DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>>>;
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
    withConverter<U>(converter: FirestoreDataConverter<U>): CollectionGroupWrapper<Collection, U>;
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
    withConverter(converter: null): CollectionGroupWrapper<Collection, never>;
    withConverter<U>(converter: FirestoreDataConverter<U> | null): CollectionGroupWrapper<Collection, never> | CollectionGroupWrapper<Collection, U>;
}
export default CollectionGroupWrapper;
