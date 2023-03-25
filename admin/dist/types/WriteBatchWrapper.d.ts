import type { DefaultIfNever, GenericDocumentSchema, GenericFirestoreDocument, SchemaKeysOf, SchemaOfDocument } from "@firestore-schema/core";
import type { SettableDocumentSchema } from "./types";
import type FirebaseFirestore from "@google-cloud/firestore";
import DocumentWrapper from "./DocumentWrapper";
/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.WriteBatch `WriteBatch`} objects.
 *
 * Instances of this class are usually created automatically by calling
 * `.batch()` on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * const wrappedWriteBatch = firestore.batch();
 * ```
 *
 * It includes the same methods as the underlying `WriteBatch` object with the
 * same behavior so that it can be used interchangeably. It also includes the
 * following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
declare class WriteBatchWrapper implements FirebaseFirestore.WriteBatch {
    /** The raw Firebase `WriteBatch` instance. */
    ref: FirebaseFirestore.WriteBatch;
    /**
     * Creates a `WriteBatchWrapper` object around the specified `WriteBatch`
     * object.
     *
     * @param ref The `WriteBatch` object to wrap.
     */
    constructor(ref: FirebaseFirestore.WriteBatch);
    /**
     * Create the document referred to by the provided `DocumentReference` /
     * `DocumentWrapper`. The operation will fail the batch if a document exists
     * at the specified location.
     *
     * @param documentRef A reference to the document to be created.
     * @param data The object data to serialize as the document.
     * @throws Error If the provided input is not a valid Firestore document.
     * @return This `WriteBatchWrapper` instance. Used for chaining method calls.
     */
    create<Document extends GenericFirestoreDocument, ConvertedType>(documentRef: DocumentWrapper<Document, ConvertedType> | FirebaseFirestore.DocumentReference<DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>>, data: FirebaseFirestore.WithFieldValue<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>): this;
    /**
     * Create the document referred to by the provided `DocumentReference` /
     * `DocumentWrapper`. The operation will fail the batch if a document exists
     * at the specified location.
     *
     * @param documentRef A reference to the document to be created.
     * @param data The object data to serialize as the document.
     * @throws Error If the provided input is not a valid Firestore document.
     * @return This `WriteBatchWrapper` instance. Used for chaining method calls.
     */
    create<Document extends GenericFirestoreDocument, ConvertedType>(documentRef: DocumentWrapper<Document, ConvertedType> | FirebaseFirestore.DocumentReference<DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>>, data: FirebaseFirestore.WithFieldValue<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>): this;
    /**
     * Write to the document referred to by the provided `DocumentReference` /
     * `DocumentWrapper`. If the document does not exist yet, it will be created.
     * If you pass `SetOptions`, the provided data can be merged into the existing
     * document.
     *
     * @param documentRef A reference to the document to be set.
     * @param data An object of the fields and values for the document.
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
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    set<Document extends GenericFirestoreDocument, ConvertedType>(documentRef: DocumentWrapper<Document, ConvertedType> | FirebaseFirestore.DocumentReference<DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>>, data: FirebaseFirestore.WithFieldValue<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>): this;
    /**
     * Write to the document referred to by the provided `DocumentReference` /
     * `DocumentWrapper`. If the document does not exist yet, it will be created.
     * If you pass `SetOptions`, the provided data can be merged into the existing
     * document.
     *
     * @param documentRef A reference to the document to be set.
     * @param data An object of the fields and values for the document.
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
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    set<Document extends GenericFirestoreDocument, ConvertedType>(documentRef: DocumentWrapper<Document, ConvertedType> | FirebaseFirestore.DocumentReference<DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>>, data: FirebaseFirestore.PartialWithFieldValue<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>, options: FirebaseFirestore.SetOptions): this;
    /**
     * Update fields of the document referred to by the provided
     * `DocumentReference` / `DocumentWrapper`. If the document doesn't yet exist,
     * the update fails and the entire batch will be rejected.
     *
     * Nested fields can be updated by providing dot-separated field path strings.
     *
     * @param documentRef A reference to the document to be updated.
     * @param data An object containing the fields and values with which to update
     *        the document.
     * @param precondition A Precondition to enforce on this update.
     * @throws Error If the provided input is not valid Firestore data.
     * @returns This `WriteBatchWrapper` instance. Used for chaining method calls.
     */
    update<Document extends GenericFirestoreDocument, ConvertedType>(documentRef: DocumentWrapper<Document, ConvertedType> | FirebaseFirestore.DocumentReference<DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>>, data: FirebaseFirestore.UpdateData<DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>>, precondition?: FirebaseFirestore.Precondition): this;
    /**
     * Updates fields in the document referred to by the provided
     * `DocumentReference` / `DocumentWrapper`. The update will fail if applied to
     * a document that does not exist.
     *
     * Nested fields can be updated by providing dot-separated field path strings
     * or by providing FieldPath objects.
     *
     * A `Precondition` restricting this update can be specified as the last
     * argument.
     *
     * @param documentRef A reference to the document to be updated.
     * @param field The first field to update.
     * @param value The first value
     * @param fieldsOrPrecondition An alternating list of field paths and values
     *        to update, optionally followed a `Precondition` to enforce on this
     *        update.
     * @throws Error If the provided input is not valid Firestore data.
     * @return This `WriteBatchWrapper` instance. Used for chaining method calls.
     */
    update<Document extends GenericFirestoreDocument, ConvertedType>(documentRef: DocumentWrapper<Document, ConvertedType> | FirebaseFirestore.DocumentReference<DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>>, field: SchemaKeysOf<Document> | FirebaseFirestore.FieldPath, value: unknown, ...moreFieldsOrPrecondition: unknown[]): this;
    update<Document extends GenericFirestoreDocument, ConvertedType>(documentRef: DocumentWrapper<Document, ConvertedType> | FirebaseFirestore.DocumentReference<DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>>, dataOrField: FirebaseFirestore.UpdateData<DefaultIfNever<ConvertedType, GenericDocumentSchema>> | string | FirebaseFirestore.FieldPath, preconditionOrValue?: FirebaseFirestore.Precondition | unknown, ...moreFieldsOrPrecondition: unknown[]): this;
    /**
     * Deletes the document referred to by the provided `DocumentReference` /
     * `DocumentWrapper`.
     *
     * @param documentRef A reference to the document to be deleted.
     * @param precondition A Precondition to enforce for this delete.
     * @return This `WriteBatchWrapper` instance. Used for chaining method calls.
     */
    delete(documentRef: DocumentWrapper<GenericFirestoreDocument, unknown> | FirebaseFirestore.DocumentReference<unknown>, precondition?: FirebaseFirestore.Precondition): this;
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * @return A Promise resolved once all of the writes in the batch have been
     *        successfully written to the backend as an atomic unit.
     */
    commit(): Promise<FirebaseFirestore.WriteResult[]>;
}
export default WriteBatchWrapper;
