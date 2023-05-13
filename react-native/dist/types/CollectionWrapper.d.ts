import type { Expand, GenericDocumentSchema, GenericFirestoreCollection, GenericFirestoreDocument, SchemaOfCollection, StrKeyof, UnionOfTuplesToIntersection } from "@firestore-schema/core";
import type { SetData, SettableDocumentSchema } from "./types";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import DocumentWrapper from "./DocumentWrapper";
import QueryWrapper from "./QueryWrapper";
/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.CollectionReference `CollectionReference`} objects.
 *
 * Instances of this class are usually created automatically by calling
 * `.collection()` on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * const collectionWrapper = firestore.collection("path/to/collection");
 * ```
 *
 * It includes the same methods as the underlying `CollectionReference` object
 * with the same behavior so that it can be used interchangeably. It also
 * includes the following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
declare class CollectionWrapper<Collection extends GenericFirestoreCollection> extends QueryWrapper<Collection> implements FirebaseFirestoreTypes.CollectionReference<any> {
    /** The raw Firebase `CollectionReference` instance. */
    ref: FirebaseFirestoreTypes.CollectionReference<SchemaOfCollection<Collection>>;
    /**
     * Creates a typed `CollectionWrapper` object around the specified
     * `CollectionReference` object.
     *
     * @param ref The `CollectionReference` object to wrap.
     */
    constructor(ref: FirebaseFirestoreTypes.CollectionReference<GenericDocumentSchema>);
    /** The identifier of the collection. */
    get id(): string;
    /**
     * A reference to the containing `DocumentWrapper` if this is a subcollection,
     * else null.
     *
     * The returned `DocumentWrapper` will be **untyped** since this
     * `CollectionWrapper` only knows about its own children's schemas.
     */
    get parent(): DocumentWrapper<GenericFirestoreDocument> | null;
    /**
     * A string representing the path of the referenced collection (relative to
     * the root of the database).
     */
    get path(): string;
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
     * @param data An Object containing the data for the new document.
     * @returns A Promise resolved with a `DocumentWrapper` pointing to the newly
     * created document after it has been written to the backend.
     */
    add(data: (Collection extends GenericFirestoreCollection ? string extends StrKeyof<Collection> ? [SetData<SettableDocumentSchema<Collection[string]>>] : false : never) extends infer R ? false extends R ? never : Expand<UnionOfTuplesToIntersection<R>> : never): (Collection extends GenericFirestoreCollection ? string extends StrKeyof<Collection> ? DocumentWrapper<Collection[string]> : false : never) extends infer R ? false extends R ? never : Promise<R> : never;
    /**
     * Gets a `DocumentWrapper` instance that refers to the document with the
     * specified name.
     *
     * @param documentName The name of a document in the collection.
     * @returns The `DocumentWrapper` instance.
     */
    doc<DocumentName extends StrKeyof<Collection>>(documentName: DocumentName): Collection extends GenericFirestoreCollection ? DocumentWrapper<Collection[DocumentName]> : never;
    /**
     * Get a `DocumentWrapper` for the document within the collection at the specified path. If no
     * path is specified, an automatically-generated unique ID will be used for the returned
     * `DocumentWrapper`.
     *
     * The collection(s) referred to by this `CollectionWrapper` must have a
     * document schema for all `string` keys since a random string ID will be
     * generated. Otherwise, this function will return `never`.
     *
     * @example
     *
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
     * @param documentPath The name of a document in the collection, or
     * `undefined` to automatically generate a unique ID.
     * @returns The `DocumentWrapper` instance.
     */
    doc(documentPath?: string): (Collection extends GenericFirestoreCollection ? string extends StrKeyof<Collection> ? DocumentWrapper<Collection[string]> : false : never) extends infer R ? false extends R ? never : R : never;
}
export default CollectionWrapper;
