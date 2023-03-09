import { DOCUMENT_SCHEMA, GenericFirestoreCollection, GenericFirestoreDocument, SettableDocumentSchema, StrKeyof } from "./types";
import type { CollectionReference, WithFieldValue } from "firebase-admin/firestore";
import DocumentWrapper from "./DocumentWrapper";
import QueryWrapper from "./QueryWrapper";
declare class CollectionWrapper<Collection extends GenericFirestoreCollection> extends QueryWrapper<Collection> {
    ref: CollectionReference<{
        [Key in StrKeyof<Collection>]: Collection[Key][DOCUMENT_SCHEMA];
    }[StrKeyof<Collection>]>;
    constructor(ref: CollectionReference);
    /**
     * Get a `DocumentWrapper` for a randomly-named document within this
     * collection. An automatically-generated unique ID will be used as the
     * document ID.
     *
     * @return The `DocumentWrapper` instance.
     */
    doc(): string extends StrKeyof<Collection> ? DocumentWrapper<Collection[string]> : DocumentWrapper<GenericFirestoreDocument>;
    /**
     * Gets a `DocumentWrapper` instance that refers to the document with the
     * specified name.
     *
     * @param documentName The name of a document in the collection.
     * @return The `DocumentWrapper` instance.
     */
    doc<DocumentName extends StrKeyof<Collection>>(documentName: DocumentName): DocumentWrapper<Collection[DocumentName]>;
    /**
     * Add a new document to this collection with the specified data, assigning it
     * a document ID automatically.
     *
     * @param data An object containing the data for the new document.
     * @throws Error If the provided input is not a valid Firestore document.
     * @return A Promise resolved with a `DocumentWrapper` pointing to the newly
     *        created document after it has been written to the backend.
     */
    add(data: string extends StrKeyof<Collection> ? WithFieldValue<SettableDocumentSchema<Collection[string]>> : never): string extends StrKeyof<Collection> ? Promise<DocumentWrapper<Collection[string]>> : never;
}
export default CollectionWrapper;
