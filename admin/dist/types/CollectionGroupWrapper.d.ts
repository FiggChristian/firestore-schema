import QueryWrapper from "./QueryWrapper";
import type { DefaultIfNever, GenericDocumentSchema, GenericFirestoreCollection, SchemaOfCollection } from "@firestore-schema/core";
import type FirebaseFirestore from "@google-cloud/firestore";
import type { TypedFirestoreDataConverter } from "./types";
/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.CollectionGroup `CollectionGroup`} objects.
 *
 * Instances of this class are usually created automatically by calling
 * `.collectionGroup()` on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * const collectionGroupWrapper = firestore.collectionGroup("collectionName");
 * ```
 *
 * It includes the same methods as the underlying `CollectionGroup` object with
 * the same behavior so that it can be used interchangeably. It also includes
 * the following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
declare class CollectionGroupWrapper<Collection extends GenericFirestoreCollection, ConvertedType = never> extends QueryWrapper<Collection, ConvertedType> implements FirebaseFirestore.CollectionGroup<DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>> {
    /** The raw Firebase `CollectionGroup` instance. */
    ref: FirebaseFirestore.CollectionGroup<DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>>;
    /**
     * Creates a typed `CollectionGroupWrapper` object around the specified
     * `CollectionGroup` object.
     *
     * @param ref The `CollectionGroup` object to wrap.
     */
    constructor(ref: FirebaseFirestore.CollectionGroup<ConvertedType | GenericDocumentSchema>);
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
    getPartitions(desiredPartitionCount: number): AsyncIterable<FirebaseFirestore.QueryPartition<DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>>>;
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
    withConverter<U>(converter: TypedFirestoreDataConverter<SchemaOfCollection<Collection>, U>): CollectionGroupWrapper<Collection, U>;
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
    withConverter<U>(converter: TypedFirestoreDataConverter<SchemaOfCollection<Collection>, U> | null): CollectionGroupWrapper<Collection, never> | CollectionGroupWrapper<Collection, U>;
}
export default CollectionGroupWrapper;
