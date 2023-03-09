import type {
  DOCUMENT_SCHEMA,
  GenericFirestoreDocument,
  GettableDocumentSchema,
  SettableDocumentSchema,
  StrKeyof,
} from "./types";
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  PartialWithFieldValue,
  Precondition,
  SetOptions,
  UpdateData,
  WithFieldValue,
  WriteResult,
} from "firebase-admin/firestore";
import CollectionWrapper from "./CollectionWrapper";

class DocumentWrapper<Document extends GenericFirestoreDocument> {
  /**
   * The raw Firebase `DocumentReference` instance.
   */
  public ref: DocumentReference<Document[DOCUMENT_SCHEMA]>;

  constructor(ref: DocumentReference) {
    this.ref = ref;
  }

  /**
   * Gets a `CollectionWrapper` instance that refers to the subcollection with
   * the specified name.
   *
   * @param collectionName The name of a subcollection in the document.
   * @return The `CollectionWrapper` instance.
   */
  collection<CollectionName extends StrKeyof<Document>>(
    collectionName: CollectionName
  ): CollectionWrapper<Document[CollectionName]> {
    return new CollectionWrapper(this.ref.collection(collectionName));
  }

  /**
   * Creates a document referred to by this `DocumentWrapper` with the provided
   * object values. The write fails if the document already exists
   *
   * @param data The object data to serialize as the document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @return A Promise resolved with the write time of this create.
   */
  create(
    data: WithFieldValue<SettableDocumentSchema<Document>>
  ): Promise<WriteResult> {
    return this.ref.create(data);
  }

  /**
   * Writes to the document referred to by this `DocumentWrapper`. If the
   * document does not yet exist, it will be created.
   *
   * @param data A map of the fields and values for the document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @return A Promise resolved with the write time of this set.
   */
  set(
    data: WithFieldValue<SettableDocumentSchema<Document>>
  ): Promise<WriteResult>;
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
  set(
    data: PartialWithFieldValue<SettableDocumentSchema<Document>>,
    options: SetOptions
  ): Promise<WriteResult>;
  set(data: Partial<DocumentData>, options?: SetOptions) {
    if (options === undefined) {
      return this.ref.set(data);
    } else {
      return this.ref.set(data, options);
    }
  }

  /**
   * Updates fields in the document referred to by this `DocumentWrapper`. The
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
  update(
    data: UpdateData<SettableDocumentSchema<Document>>,
    precondition?: Precondition
  ): Promise<WriteResult>;
  /**
   * Updates fields in the document referred to by this `DocumentReference`.
   * The update will fail if applied to a document that does not exist.
   *
   * Nested fields can be updated by providing dot-separated field path
   * strings or by providing FieldPath objects.
   *
   * A `Precondition` restricting this update can be specified as the last
   * argument.
   *
   * @param field The first field to update.
   * @param value The first value.
   * @param moreFieldsOrPrecondition An alternating list of field paths and
   * values to update, optionally followed by a `Precondition` to enforce on
   * this update.
   * @throws Error If the provided input is not valid Firestore data.
   * @return A Promise resolved with the write time of this update.
   */
  update(
    field: string | FieldPath,
    value: unknown,
    ...moreFieldsOrPrecondition: unknown[]
  ): Promise<WriteResult>;
  update(
    dataOrField:
      | UpdateData<SettableDocumentSchema<Document>>
      | string
      | FieldPath,
    preconditionOrValue?: Precondition | unknown,
    ...moreFieldsOrPrecondition: unknown[]
  ) {
    // Firestore has two function overloads for `update()` that aren't
    // compatible with each other. Instead of trying to play with TypeScript to
    // get it to work somehow, just choose the second function overload since
    // the implementation of `update()` should be able to handle either one.
    return this.ref.update(
      dataOrField as string | FieldPath,
      preconditionOrValue as unknown,
      ...moreFieldsOrPrecondition
    );
  }

  /**
   * Deletes the document referred to by this `DocumentWrapper`.
   *
   * @param precondition A Precondition to enforce for this delete.
   * @return A Promise resolved with the write time of this delete.
   */
  delete(precondition?: Precondition): Promise<WriteResult> {
    return this.ref.delete(precondition);
  }

  /**
   * Reads the document referred to by this `DocumentWrapper`.
   *
   * @return A Promise resolved with a `DocumentSnapshot` containing the
   *        current document contents.
   */
  get(): Promise<DocumentSnapshot<GettableDocumentSchema<Document>>> {
    return (
      this.ref as DocumentReference<GettableDocumentSchema<Document>>
    ).get();
  }

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
  onSnapshot(
    onNext: (
      snapshot: DocumentSnapshot<GettableDocumentSchema<Document>>
    ) => void,
    onError?: (error: Error) => void
  ): () => void {
    return (
      this.ref as DocumentReference<GettableDocumentSchema<Document>>
    ).onSnapshot(onNext, onError);
  }
}

export default DocumentWrapper;
