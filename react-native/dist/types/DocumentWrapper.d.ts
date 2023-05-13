import type { GenericDocumentSchema, GenericFirestoreCollection, GenericFirestoreDocument, SchemaOfDocument, StrKeyof } from "@firestore-schema/core";
import type { DotNestedSchemaKeysOf, DottedFieldNameIndex, GettableDocumentSchema, SetData, SettableDocumentSchema, UpdateData } from "./types";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import CollectionWrapper from "./CollectionWrapper";
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
declare class DocumentWrapper<Document extends GenericFirestoreDocument> implements FirebaseFirestoreTypes.DocumentReference<any> {
    /** The raw Firebase `DocumentReference` instance. */
    ref: FirebaseFirestoreTypes.DocumentReference<SchemaOfDocument<Document>>;
    /**
     * Creates a typed `DocumentWrapper` object around the specified
     * `DocumentReference` object.
     *
     * @param ref The `DocumentReference` object to wrap.
     */
    constructor(ref: FirebaseFirestoreTypes.DocumentReference<GenericDocumentSchema>);
    /**
     * The `Firestore` for the Firestore database (useful for performing
     * transactions, etc.).
     */
    get firestore(): FirebaseFirestoreTypes.Module;
    /** The identifier of the document within its collection. */
    get id(): string;
    /**
     * A reference to the `CollectionWrapper` to which this `DocumentWrapper`
     * belongs.
     *
     * The returned `CollectionWrapper` will be **untyped** since this
     * `DocumentWrapper` only knows about its own children's schemas.
     */
    get parent(): CollectionWrapper<GenericFirestoreCollection>;
    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */
    get path(): string;
    /**
     * Gets a `CollectionWrapper` instance that refers to the subcollection with
     * the specified name.
     *
     * @param collectionName The name of a subcollection in the document.
     * @returns The `CollectionWrapper` instance.
     */
    collection<CollectionName extends StrKeyof<Document>>(collectionName: CollectionName): CollectionWrapper<Document[CollectionName]>;
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
    delete(): Promise<void>;
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
    get(options?: FirebaseFirestoreTypes.GetOptions): Promise<FirebaseFirestoreTypes.DocumentSnapshot<GettableDocumentSchema<Document>>>;
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
    isEqual(other: DocumentWrapper<GenericFirestoreDocument>): boolean;
    /**
     * Returns true if this `DocumentWrapper`'s `ref` is equal to the provided
     * `DocumentReference`.
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
     * @returns true if this `DocumentWrapper`'s `ref` is equal to the provided
     * `DocumentReference`.
     */
    isEqual(other: FirebaseFirestoreTypes.DocumentReference<GenericDocumentSchema>): boolean;
    isEqual(other: DocumentWrapper<GenericFirestoreDocument> | FirebaseFirestoreTypes.DocumentReference<GenericDocumentSchema>): boolean;
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
    onSnapshot(observer: {
        complete?: () => void;
        error?: (error: Error) => void;
        next?: (snapshot: FirebaseFirestoreTypes.DocumentSnapshot<GettableDocumentSchema<Document>>) => void;
    }): () => void;
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
     * @param options Options controlling the listen behavior.
     * @param observer A single object containing `next` and `error` callbacks.
     * @returns An unsubscribe function that can be called to cancel the snapshot
     * listener.
     */
    onSnapshot(options: FirebaseFirestoreTypes.SnapshotListenOptions, observer: {
        complete?: () => void;
        error?: (error: Error) => void;
        next?: (snapshot: FirebaseFirestoreTypes.DocumentSnapshot<GettableDocumentSchema<Document>>) => void;
    }): () => void;
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
     * @param onNext A callback to be called every time a new `DocumentSnapshot`
     * is available.
     * @param onError A callback to be called if the listen fails or is cancelled.
     * No further callbacks will occur.
     * @param onCompletion An optional function which will never be called.
     */
    onSnapshot(onNext: (snapshot: FirebaseFirestoreTypes.DocumentSnapshot<GettableDocumentSchema<Document>>) => void, onError?: (error: Error) => void, onCompletion?: () => void): () => void;
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
     * @param options Options controlling the listen behavior.
     * @param onNext A callback to be called every time a new `DocumentSnapshot`
     * is available.
     * @param onError A callback to be called if the listen fails or is cancelled.
     * No further callbacks will occur.
     * @param onCompletion An optional function which will never be called.
     */
    onSnapshot(options: FirebaseFirestoreTypes.SnapshotListenOptions, onNext: (snapshot: FirebaseFirestoreTypes.DocumentSnapshot<GettableDocumentSchema<Document>>) => void, onError?: (error: Error) => void, onCompletion?: () => void): () => void;
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
    set(data: SetData<SettableDocumentSchema<Document>>, options?: FirebaseFirestoreTypes.SetOptions): Promise<void>;
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
    update(data: UpdateData<SettableDocumentSchema<Document>>): Promise<void>;
    /**
     * Updates fields in the document referred to by this `DocumentReference` /
     * `DocumentWrapper`. The update will fail if applied to a document that does
     * not exist.
     *
     * @example
     * ```
     * const user = firestore.doc('users/alovelace');
     *
     * // Update age & city but leave other fields untouched
     * await user.update('age', 31, 'city', 'SF');
     * ```
     *
     * @param field The first field to update.
     * @param value The first value.
     * @param moreFieldsAndValues Additional key value pairs.
     * @returns A Promise resolved once the data has been successfully written
     * to the backend.
     */
    update<K extends DotNestedSchemaKeysOf<Document>>(field: K, value: DottedFieldNameIndex<K, SettableDocumentSchema<Document>> | FirebaseFirestoreTypes.FieldValue, ...moreFieldsAndValues: unknown[]): Promise<void>;
    /**
     * Updates fields in the document referred to by this `DocumentReference` /
     * `DocumentWrapper`. The update will fail if applied to a document that does
     * not exist.
     *
     * @example
     * ```
     * const user = firestore.doc('users/alovelace');
     *
     * // Update age & city but leave other fields untouched
     * await user.update('age', 31, 'city', 'SF');
     * ```
     *
     * @param field The first field to update.
     * @param value The first value.
     * @param moreFieldsAndValues Additional key value pairs.
     * @returns A Promise resolved once the data has been successfully written
     * to the backend.
     */
    update(field: DotNestedSchemaKeysOf<Document> | FirebaseFirestoreTypes.FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): Promise<void>;
}
export default DocumentWrapper;
