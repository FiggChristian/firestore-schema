import type { DefaultIfNever, DocumentsIn, Expand, GenericDocumentSchema, GenericFirestoreCollection, GenericFirestoreDocument, SchemaOfCollection, StrKeyof, UnionOfTuplesToIntersection } from "@firestore-schema/core";
import type { SettableDocumentSchema, TypedFirestoreDataConverter } from "./types";
import type FirebaseFirestore from "@google-cloud/firestore";
import DocumentWrapper from "./DocumentWrapper";
import QueryWrapper from "./QueryWrapper";
/** A typed wrapper class around Firestore `CollectionReference` objects. */
declare class CollectionWrapper<Collection extends GenericFirestoreCollection, ConvertedType> extends QueryWrapper<Collection, ConvertedType> implements FirebaseFirestore.CollectionReference<any> {
    /** The raw Firebase `CollectionReference` instance. */
    ref: FirebaseFirestore.CollectionReference<DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>>;
    /**
     * Creates a typed `CollectionWrapper` object around the specified
     * `CollectionReference` object.
     *
     * @param ref The `CollectionReference` object to wrap.
     */
    constructor(ref: FirebaseFirestore.CollectionReference<ConvertedType | GenericDocumentSchema>);
    /** The identifier of the collection. */
    get id(): string;
    /**
     * A reference to the containing `DocumentWrapper` if this is a subcollection,
     * else null.
     *
     * The returned `DocumentWrapper` will be **untyped** since this
     * `CollectionWrapper` only knows about its own children's schemas.
     */
    get parent(): DocumentWrapper<GenericFirestoreDocument, never> | null;
    /**
     * A string representing the path of the referenced collection (relative to
     * the root of the database).
     */
    get path(): string;
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
    listDocuments(): Promise<DocumentWrapper<DocumentsIn<Collection>, ConvertedType>[]>;
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
    doc(): (Collection extends GenericFirestoreCollection ? string extends StrKeyof<Collection> ? DocumentWrapper<Collection[string], ConvertedType> : false : never) extends infer R ? false extends R ? never : R : never;
    /**
     * Gets a `DocumentWrapper` instance that refers to the document with the
     * specified name.
     *
     * @param documentName The name of a document in the collection.
     * @return The `DocumentWrapper` instance.
     */
    doc<DocumentName extends StrKeyof<Collection>>(documentName: DocumentName): Collection extends GenericFirestoreCollection ? DocumentWrapper<Collection[DocumentName], ConvertedType> : never;
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
    add(data: (Collection extends GenericFirestoreCollection ? string extends StrKeyof<Collection> ? [
        DefaultIfNever<ConvertedType, SettableDocumentSchema<Collection[string]>>
    ] : false : never) extends infer R ? false extends R ? never : FirebaseFirestore.WithFieldValue<Expand<UnionOfTuplesToIntersection<R>>> : never): (Collection extends GenericFirestoreCollection ? string extends StrKeyof<Collection> ? DocumentWrapper<Collection[string], ConvertedType> : false : never) extends infer R ? false extends R ? never : Promise<R> : never;
    /**
     * Returns true if this `CollectionWrapper` is equal to the provided one.
     *
     * @param other The `CollectionWrapper` to compare against.
     * @return true if this `CollectionWrapper` is equal to the provided one.
     */
    isEqual(other: CollectionWrapper<GenericFirestoreCollection, ConvertedType>): boolean;
    /**
     * Returns true if this `CollectionWrapper`'s `ref` is equal to the provided
     * `CollectionReference`.
     *
     * @param other The `CollectionReference` to compare against.
     * @return true if this `CollectionWrapper`'s `ref` is equal to the provided
     *        `CollectionReference`.
     */
    isEqual(other: FirebaseFirestore.CollectionReference<DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>>): boolean;
    isEqual(other: CollectionWrapper<GenericFirestoreCollection, ConvertedType> | FirebaseFirestore.CollectionReference<DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>>): boolean;
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
    withConverter<U>(converter: TypedFirestoreDataConverter<SchemaOfCollection<Collection>, U>): CollectionWrapper<Collection, U>;
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
    withConverter(converter: null): CollectionWrapper<Collection, never>;
    withConverter<U>(converter: TypedFirestoreDataConverter<SchemaOfCollection<Collection>, U> | null): CollectionWrapper<Collection, never> | CollectionWrapper<Collection, U>;
}
export default CollectionWrapper;
