import type { GenericFirestoreDocument, SchemaOfDocument } from "@firestore-schema/core";
import type { DotNestedSchemaKeysOf, DottedFieldNameIndex, SetData, SettableDocumentSchema, UpdateData } from "./types";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
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
declare class WriteBatchWrapper implements FirebaseFirestoreTypes.WriteBatch {
    /** The raw Firebase `WriteBatch` instance. */
    ref: FirebaseFirestoreTypes.WriteBatch;
    /**
     * Creates a `WriteBatchWrapper` object around the specified `WriteBatch`
     * object.
     *
     * @param ref The `WriteBatch` object to wrap.
     */
    constructor(ref: FirebaseFirestoreTypes.WriteBatch);
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * Returns a Promise resolved once all of the writes in the batch have been successfully written
     * to the backend as an atomic unit. Note that it won't resolve while you're offline.
     *
     * @example
     * ```ts
     * const batch = firestore.batch();
     *
     * // Perform batch operations...
     *
     * await batch.commit();
     * ```
     */
    commit(): Promise<void>;
    /**
     * Deletes the document referred to by the provided `DocumentReference` /
     * `DocumentWrapper`.
     *
     * @example
     * ```ts
     * const batch = firestore.batch();
     * const docRef = firestore.doc('users/alovelace');
     *
     * batch.delete(docRef);
     * ```
     *
     * @param documentRef A reference to the document to be deleted.
     */
    delete(documentRef: DocumentWrapper<GenericFirestoreDocument> | FirebaseFirestoreTypes.DocumentReference): this;
    /**
     * Writes to the document referred to by the provided `DocumentReference` /
     * `DocumentWrapper`. If the document does not exist yet, it will be created.
     * If you pass `SetOptions`, the provided data can be merged into the existing
     * document.
     *
     * @example
     * ```ts
     * const batch = firestore.batch();
     * const docRef = firestore.doc('users/dsmith');
     *
     * batch.set(docRef, {
     *   name: 'David Smith',
     *   age: 25,
     * });
     * ```
     *
     * @param documentRef A reference to the document to be set.
     * @param data An object of the fields and values for the document.
     * @param options An object to configure the set behavior.
     */
    set<Document extends GenericFirestoreDocument>(documentRef: DocumentWrapper<Document> | FirebaseFirestoreTypes.DocumentReference<SchemaOfDocument<Document>>, data: SetData<SettableDocumentSchema<Document>>, options?: FirebaseFirestoreTypes.SetOptions): this;
    /**
     * Updates fields in the document referred to by the provided
     * `DocumentReference` / `DocumentWrapper`. The update will fail if applied to
     * a document that does not exist.
     *
     * @example
     * ```ts
     * const batch = firestore.batch();
     * const docRef = firestore.doc('users/alovelace');
     *
     * batch.update(docRef, {
     *   city: 'SF',
     * });
     * ```
     *
     * @param documentRef A reference to the document to be updated.
     * @param data An object containing the fields and values with which to update
     * the document. Fields can contain dots to reference nested fields within the
     * document.
     */
    update<Document extends GenericFirestoreDocument>(documentRef: DocumentWrapper<Document> | FirebaseFirestoreTypes.DocumentReference<SchemaOfDocument<Document>>, data: UpdateData<SettableDocumentSchema<Document>>): this;
    /**
     * Updates fields in the document referred to by this `DocumentReference` /
     * `DocumentWrapper`. The update will fail if applied to a document that does
     * not exist.
     *
     * Nested fields can be update by providing dot-separated field path strings
     * or by providing FieldPath objects.
     *
     * @example
     * ```ts
     * const batch = firestore.batch();
     * const docRef = firestore.doc('users/alovelace');
     *
     * batch.update(docRef, 'city', 'SF', 'age', 31);
     * ```
     *
     * @param documentRef A reference to the document to be updated.
     * @param field The first field to update.
     * @param value The first value.
     * @param moreFieldAndValues Additional key value pairs.
     */
    update<Document extends GenericFirestoreDocument, K extends DotNestedSchemaKeysOf<Document>>(documentRef: DocumentWrapper<Document> | FirebaseFirestoreTypes.DocumentReference<SchemaOfDocument<Document>>, field: K | FirebaseFirestoreTypes.FieldPath, value: DottedFieldNameIndex<K, SettableDocumentSchema<Document>> | FirebaseFirestoreTypes.FieldValue, ...moreFieldAndValues: unknown[]): this;
}
export default WriteBatchWrapper;
