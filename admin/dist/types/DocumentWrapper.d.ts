import type { DefaultIfNever, GenericFirestoreCollection, GenericFirestoreDocument, GettableDocumentSchema, SchemaKeysOf, SchemaOfDocument, SettableDocumentSchema, StrKeyof, SubcollectionsIn } from "./types";
import type { DocumentData, DocumentReference, DocumentSnapshot, FieldPath, Firestore, FirestoreDataConverter, PartialWithFieldValue, Precondition, SetOptions, UpdateData, WithFieldValue, WriteResult } from "firebase-admin/firestore";
import CollectionWrapper from "./CollectionWrapper";
/** A typed wrapper class around Firestore `DocumentReference` objects. */
declare class DocumentWrapper<Document extends GenericFirestoreDocument, ConvertedType> implements DocumentReference<any> {
    /** The raw Firebase `DocumentReference` instance. */
    ref: DocumentReference<DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>>;
    constructor(ref: DocumentReference<ConvertedType | DocumentData>);
    /** The identifier of the document within its collection. */
    get id(): string;
    /**
     * The `Firestore` for the Firestore database (useful for performing
     * transactions, etc.).
     */
    get firestore(): Firestore;
    /**
     * A reference to the `CollectionWrapper` to which this `DocumentWrapper`
     * belongs.
     *
     * The returned `CollectionWrapper` will be **untyped** since this
     * `DocumentWrapper` only knows about its own children's schemas.
     */
    get parent(): CollectionWrapper<GenericFirestoreCollection, DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>>;
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
     * @return The `CollectionWrapper` instance.
     */
    collection<CollectionName extends StrKeyof<Document>>(collectionName: CollectionName): CollectionWrapper<Document[CollectionName], never>;
    /**
     * Fetches the subcollections that are direct children of this document.
     *
     * @returns A Promise that resolves with an array of `CollectionWrapper`s.
     */
    listCollections(): Promise<CollectionWrapper<SubcollectionsIn<Document>, never>[]>;
    /**
     * Creates a document referred to by this `DocumentWrapper` with the provided
     * object values. The write fails if the document already exists
     *
     * @param data The object data to serialize as the document.
     * @throws Error If the provided input is not a valid Firestore document.
     * @return A Promise resolved with the write time of this create.
     */
    create(data: WithFieldValue<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>): Promise<WriteResult>;
    /**
     * Writes to the document referred to by this `DocumentWrapper`. If the
     * document does not yet exist, it will be created.
     *
     * @param data A map of the fields and values for the document.
     * @throws Error If the provided input is not a valid Firestore document.
     * @return A Promise resolved with the write time of this set.
     */
    set(data: WithFieldValue<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>): Promise<WriteResult>;
    /**
     * Writes to the document referred to by this `DocumentWrapper`. If the
     * document does not yet exist, it will be created. If you pass `options`, the
     * provided data can be merged into an existing document.
     *
     * @param data A map of the fields and values for the document.
     * @param options An object to configure the set behavior.
     * @param options.merge - If true, set() merges the values specified in its
     *        data argument. Fields omitted from this set() call remain untouched.
     *        If your input sets any field to an empty map, all nested fields are
     *        overwritten.
     * @param options.mergeFields - If provided, set() only replaces the specified
     *        field paths. Any field path that is not specified is ignored and
     *        remains untouched. If your input sets any field to an empty map, all
     *        nested fields are overwritten.
     * @throws Error If the provided input is not a valid Firestore document.
     * @return A Promise resolved with the write time of this set.
     */
    set(data: PartialWithFieldValue<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>, options: SetOptions): Promise<WriteResult>;
    /**
     * Updates fields in the DOcument referred to by this `DocumentWrapper`. The
     * update will fail if applied to a document that does not exist.
     *
     * Nested fields can be updated by providing dot-separated field path strings.
     *
     * @param data An object containing the fields and values with which to update
     *        the document.
     * @param precondition A Precondition to enforce on this update.
     * @throws Error If the provided input is not valid Firestore data.
     * @return A Promise resolved with the write time of this update.
     */
    update(data: UpdateData<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>, precondition?: Precondition): Promise<WriteResult>;
    /**
     * Updates fields in the doCument referred to by this `DocumentWrapper`. The
     * update will fail if applied to a document that does not exist.
     *
     * Nested fields can be updated by providing dot-separated field path strings
     * or by providing FieldPath objects.
     *
     * A `Precondition` restricting this update can be specified as the last
     * argument.
     *
     * @param field The first field to update.
     * @param value The first value.
     * @param moreFieldsOrPrecondition An alternating list of field paths and
     *        values to update, optionally followed by a `Precondition` to enforce
     *        on this update.
     * @throws Error If the provided input is not valid Firestore data.
     * @return A Promise resolved with the write time of this update.
     */
    update(field: SchemaKeysOf<Document> | FieldPath, value: unknown, ...moreFieldsOrPrecondition: unknown[]): Promise<WriteResult>;
    update(dataOrField: UpdateData<DefaultIfNever<ConvertedType, DocumentData>> | string | FieldPath, preconditionOrValue?: Precondition | unknown, ...moreFieldsOrPrecondition: unknown[]): Promise<WriteResult>;
    /**
     * Deletes the document referred to by this `DocumentWrapper`.
     *
     * @param precondition A Precondition to enforce for this delete.
     * @return A Promise resolved with the write time of this delete.
     */
    delete(precondition?: Precondition): Promise<WriteResult>;
    /**
     * Reads the document referred to by this `DocumentWrapper`.
     *
     * @return A Promise resolved with a `DocumentSnapshot` containing the
     *        current document contents.
     */
    get(): Promise<DocumentSnapshot<DefaultIfNever<ConvertedType, GettableDocumentSchema<Document>>>>;
    /**
     * Attaches a listener for DocumentSnapshot events.
     *
     * @param onNext A callback to be called every time a new `DocumentSnapshot`
     *        is available.
     * @param onError A callback to be called if the listen fails or is
     *        cancelled. No further callbacks will occur.
     * @return An unsubscribe function that can be called to cancel
     *        the snapshot listener.
     */
    onSnapshot(onNext: (snapshot: DocumentSnapshot<DefaultIfNever<ConvertedType, GettableDocumentSchema<Document>>>) => void, onError?: (error: Error) => void): () => void;
    /**
     * Returns true if this `DocumentWrapper` is equal to the provided one.
     *
     * @param other The `DocumentWrapper` to compare against.
     * @return true if this `DocumentWrapper` is equal to the provided one.
     */
    isEqual(other: DocumentWrapper<GenericFirestoreDocument, ConvertedType>): boolean;
    /**
     * Returns true if this `DocumentWrapper`'s `ref` is equal to the provided
     * `DocumentReference`.
     *
     * @param other The `DocumentReference` to compare against.
     * @return true if this `DocumentWrapper`'s `ref` is equal to the provided
     *        `DocumentReference`.
     */
    isEqual(other: DocumentReference<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>): boolean;
    isEqual(other: DocumentWrapper<GenericFirestoreDocument, ConvertedType> | DocumentReference<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>): boolean;
    /**
     * Applies a custom data converter to this `DocumentWrapper`, allowing you to
     * use your own custom model objects with Firestore. When you call `get()` on
     * the returned `DocumentWrapper`, the provided converter will convert between
     * Firestore data and your custom type `U`.
     *
     * @param converter Converts objects to and from Firestore. Passing in `null`
     *        removes the current converter.
     * @return A `DocumentWrapper<U>` that uses the provided converter.
     */
    withConverter<U>(converter: FirestoreDataConverter<U>): DocumentWrapper<Document, U>;
    /**
     * Applies a custom data converter to this `DocumentWrapper`, allowing you to
     * use your own custom model objects with Firestore. When you call `get()` on
     * the returned `DocumentWrapper`, the provided converter will convert between
     * Firestore data and your custom type `U`.
     *
     * @param converter Converts objects to and from Firestore. Passing in `null`
     *        removes the current converter.
     * @return A `DocumentWrapper<U>` that uses the provided converter.
     */
    withConverter(converter: null): DocumentWrapper<Document, never>;
    withConverter<U>(converter: FirestoreDataConverter<U> | null): DocumentWrapper<Document, never> | DocumentWrapper<Document, U>;
}
export default DocumentWrapper;
