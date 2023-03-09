import {
  DOCUMENT_SCHEMA,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  SettableDocumentSchema,
  StrKeyof,
} from "./types";
import type {
  CollectionReference,
  DocumentData,
  WithFieldValue,
} from "firebase-admin/firestore";
import DocumentWrapper from "./DocumentWrapper";
import QueryWrapper from "./QueryWrapper";

class CollectionWrapper<
  Collection extends GenericFirestoreCollection
> extends QueryWrapper<Collection> {
  public declare ref: CollectionReference<
    {
      [Key in StrKeyof<Collection>]: Collection[Key][DOCUMENT_SCHEMA];
    }[StrKeyof<Collection>]
  >;

  constructor(ref: CollectionReference) {
    super(ref);
    this.ref = ref;
  }

  /**
   * Get a `DocumentWrapper` for a randomly-named document within this
   * collection. An automatically-generated unique ID will be used as the
   * document ID.
   *
   * @return The `DocumentWrapper` instance.
   */
  doc(): string extends StrKeyof<Collection>
    ? DocumentWrapper<Collection[string]>
    : DocumentWrapper<GenericFirestoreDocument>;
  /**
   * Gets a `DocumentWrapper` instance that refers to the document with the
   * specified name.
   *
   * @param documentName The name of a document in the collection.
   * @return The `DocumentWrapper` instance.
   */
  doc<DocumentName extends StrKeyof<Collection>>(
    documentName: DocumentName
  ): DocumentWrapper<Collection[DocumentName]>;
  doc(
    documentName?: string
  ):
    | DocumentWrapper<Collection[string]>
    | DocumentWrapper<GenericFirestoreDocument> {
    return typeof documentName === "string"
      ? new DocumentWrapper(this.ref.doc(documentName))
      : new DocumentWrapper(this.ref.doc());
  }

  /**
   * Add a new document to this collection with the specified data, assigning it
   * a document ID automatically.
   *
   * @param data An object containing the data for the new document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @return A Promise resolved with a `DocumentWrapper` pointing to the newly
   *        created document after it has been written to the backend.
   */
  add(
    // Since `add` is generating a random document ID, `data` can only be
    // assigned a document schema if the current collection is indexable by
    // `string` (i.e., all documents in the collection have the same schema).
    // Otherwise, there's no associated schema for this collection and `data`
    // has a `never` type to prevent it from being used improperly.
    data: string extends StrKeyof<Collection>
      ? WithFieldValue<SettableDocumentSchema<Collection[string]>>
      : never
  ): string extends StrKeyof<Collection>
    ? Promise<DocumentWrapper<Collection[string]>>
    : never;
  add(data: DocumentData): Promise<DocumentWrapper<Collection[string]>> {
    // Wrap the returned `DocumentReference` in a `DocumentWrapper` after the
    // Promise returns.
    return this.ref.add(data).then((ref) => new DocumentWrapper(ref));
  }
}

export default CollectionWrapper;
