import type {
  DefaultIfNever,
  DocumentsIn,
  GenericDocumentSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  SchemaKeysOf,
  SchemaOfCollection,
  SchemaOfDocument,
} from "@firestore-schema/core";
import type { GettableDocumentSchema, SettableDocumentSchema } from "./types";
import type FirebaseFirestore from "@google-cloud/firestore";
import type FirestoreWrapper from "./FirestoreWrapper";
import DocumentWrapper from "./DocumentWrapper";
import QueryWrapper from "./QueryWrapper";

/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.Transaction `Transaction`} objects. This is a
 * read-only variation of a normal Firebase `Transaction`. The full read-write
 * version of a Transaction (which is the same as a normal Firebase
 * `Transaction`) is available as a
 * {@link ReadWriteTransactionWrapper `ReadWriteTransactionWrapper`}.
 *
 * Instances of this class are usually created automatically by calling
 * `.runTransaction()` on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * firestore.runTransaction((wrappedTransaction) => { ... }, { readOnly: true });
 * ```
 *
 * It includes most of the same methods as the underlying `Transaction` object
 * with the same behavior so that it can be used interchangeably. Methods that
 * would only be available in a read-write transaction are omitted since they
 * throw errors at runtime. It also includes the following additional
 * properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
export class ReadOnlyTransactionWrapper
  implements
    Omit<FirebaseFirestore.Transaction, "create" | "set" | "update" | "delete">
{
  /** The raw Firebase `Transaction` instance. */
  public ref: FirebaseFirestore.Transaction;

  /**
   * Creates a `ReadOnlyTransactionWrapper` object around the specified
   * `Transaction` object.
   *
   * @param ref The `Transaction` object to wrap.
   */
  constructor(ref: FirebaseFirestore.Transaction) {
    this.ref = ref;
  }

  /**
   * Retrieves a query result. Holds a pessimistic lock on all returned
   * documents.
   *
   * @param query A query to execute.
   * @returns A `QuerySnapshot` for the retrieved data.
   */
  get<Collection extends GenericFirestoreCollection, ConvertedType>(
    query:
      | QueryWrapper<Collection, ConvertedType>
      | FirebaseFirestore.Query<
          DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
        >
  ): Promise<
    FirebaseFirestore.QuerySnapshot<
      DefaultIfNever<
        ConvertedType,
        GettableDocumentSchema<DocumentsIn<Collection>>
      >
    >
  >;
  /**
   * Reads the document referenced by the provided `DocumentReference` /
   * `DocumentWrapper`. Holds a pessimistic lock on the returned document.
   *
   * @param documentRef A reference to the document to be read.
   * @returns A `DocumentSnapshot` for the read data.
   */
  get<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >
  ): Promise<
    FirebaseFirestore.DocumentSnapshot<
      DefaultIfNever<ConvertedType, GettableDocumentSchema<Document>>
    >
  >;
  /**
   * Retrieves an aggregate query result. Holds a pessimistic lock on all
   * documents that were matched by the underlying query.
   *
   * @param aggregateQuery An aggregate query to execute.
   * @returns An `AggregateQuerySnapshot` for the retrieved data.
   */
  get<T extends FirebaseFirestore.AggregateSpec>(
    aggregateQuery: FirebaseFirestore.AggregateQuery<T>
  ): Promise<FirebaseFirestore.AggregateQuerySnapshot<T>>;
  get(
    queryOrDocumentRefOrAggregateQuery:
      | QueryWrapper<GenericFirestoreCollection, unknown>
      | FirebaseFirestore.Query<unknown>
      | DocumentWrapper<GenericFirestoreDocument, unknown>
      | FirebaseFirestore.DocumentReference<unknown>
      | FirebaseFirestore.AggregateQuery<FirebaseFirestore.AggregateSpec>
  ):
    | Promise<FirebaseFirestore.QuerySnapshot<unknown>>
    | Promise<FirebaseFirestore.DocumentSnapshot<unknown>>
    | Promise<
        FirebaseFirestore.AggregateQuerySnapshot<FirebaseFirestore.AggregateSpec>
      > {
    if (queryOrDocumentRefOrAggregateQuery instanceof QueryWrapper) {
      return this.ref.get(queryOrDocumentRefOrAggregateQuery.ref);
    } else if (queryOrDocumentRefOrAggregateQuery instanceof DocumentWrapper) {
      return this.ref.get(queryOrDocumentRefOrAggregateQuery.ref);
    } else {
      return this.ref.get(
        queryOrDocumentRefOrAggregateQuery as FirebaseFirestore.Query<unknown>
      );
    }
  }

  /**
   * Retrieves multiple documents from Firestore. Holds a pessimistic lock on
   * all returned documents.
   *
   * The first argument is required and must be of type `DocumentReference` /
   * `DocumentWrapper` followed by any additional `DocumentReference` /
   * `DocumentWrapper` documents. If used, the optional `ReadOptions` must be
   * the last argument.
   *
   * @param documentRefsOrReadOptions The `DocumentReferences` to receive,
   *        followed by an optional field mask.
   * @returns A Promise that resolves with an array of resulting document
   *        snapshots.
   */
  getAll<
    T extends never[],
    M extends (
      | DocumentWrapper<GenericFirestoreDocument, unknown>
      | FirebaseFirestore.DocumentReference<unknown>
    )[] = {
      [K in keyof T]:
        | DocumentWrapper<GenericFirestoreDocument, T[K]>
        | FirebaseFirestore.DocumentReference<T[K]>;
    }
  >(
    ...documentRefsOrReadOptions: M
  ): Promise<{
    [K in keyof M]: Awaited<ReturnType<M[K]["get"]>>;
  }>;
  /**
   * Retrieves multiple documents from Firestore. Holds a pessimistic lock on
   * all returned documents.
   *
   * The first argument is required and must be of type `DocumentReference` /
   * `DocumentWrapper` followed by any additional `DocumentReference` /
   * `DocumentWrapper` documents. If used, the optional `ReadOptions` must be
   * the last argument.
   *
   * @param documentRefsOrReadOptions The `DocumentReferences` to receive,
   *        followed by an optional field mask.
   * @returns A Promise that resolves with an array of resulting document
   *        snapshots.
   */
  // This overload is exactly as the same as the one above, except it includes a
  // ReadOptions parameter as the last argument.
  getAll<
    T extends never[],
    M extends (
      | DocumentWrapper<GenericFirestoreDocument, unknown>
      | FirebaseFirestore.DocumentReference<unknown>
    )[] = {
      [K in keyof T]:
        | DocumentWrapper<GenericFirestoreDocument, T[K]>
        | FirebaseFirestore.DocumentReference<T[K]>;
    }
  >(
    ...documentRefsOrReadOptions: [...M, FirebaseFirestore.ReadOptions]
  ): Promise<{
    [K in keyof M]: Awaited<ReturnType<M[K]["get"]>>;
  }>;
  /**
   * Retrieves multiple documents from Firestore. Holds a pessimistic lock on
   * all returned documents.
   *
   * The first argument is required and must be of type `DocumentReference` /
   * `DocumentWrapper` followed by any additional `DocumentReference` /
   * `DocumentWrapper` documents. If used, the optional `ReadOptions` must be
   * the last argument.
   *
   * @param documentRefsOrReadOptions The `DocumentReferences` to receive,
   *        followed by an optional field mask.
   * @returns A Promise that resolves with an array of resulting document
   *        snapshots.
   */
  // This overload happens when the input cannot be converted to a tuple. This
  // can happen if the user stores the input array in a separate variable before
  // passing it to the function, which will cause TypeScript to recognize it as
  // an array instead of a more specific tuple. The returned type will be a
  // union of all the possible document schemas in a union. Without having a
  // specific typed tuple, this is the most specific the return type can be.
  getAll<
    T extends (
      | DocumentWrapper<GenericFirestoreDocument, unknown>
      | FirebaseFirestore.DocumentReference<unknown>
      | FirebaseFirestore.ReadOptions
    )[]
  >(
    ...documentRefsOrReadOptions: T
  ): Promise<
    Exclude<T[number], FirebaseFirestore.ReadOptions> extends infer R
      ? R extends
          | DocumentWrapper<GenericFirestoreDocument, unknown>
          | FirebaseFirestore.DocumentReference<unknown>
        ? Awaited<ReturnType<R["get"]>>
        : never
      : never
  >;
  getAll(
    ...documentRefsOrReadOptions: (
      | DocumentWrapper<GenericFirestoreDocument, unknown>
      | FirebaseFirestore.DocumentReference
      | FirebaseFirestore.ReadOptions
    )[]
  ): Promise<FirebaseFirestore.DocumentSnapshot[]> {
    const unwrappedArgs = documentRefsOrReadOptions.map((refOrReadOpts) => {
      if (refOrReadOpts instanceof DocumentWrapper) {
        return refOrReadOpts.ref as FirebaseFirestore.DocumentReference;
      }
      return refOrReadOpts;
    });
    return this.ref.getAll(...unwrappedArgs);
  }
}

/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.Transaction `Transaction`} objects. This is a
 * read-write variation of a normal Firebase `Transaction`. The read-only
 * version of a Transaction (which has a subset of methods that are usable in a
 * read-only transaction) is available as a
 * {@link ReadOnlyTransactionWrapper `ReadOnlyTransactionWrapper`}.
 *
 * Instances of this class are usually created automatically by calling
 * `.runTransaction()` on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * firestore.runTransaction((wrappedTransaction) => { ... });
 * ```
 *
 * It includes the same methods as the underlying `Transaction` object with the
 * same behavior so that it can be used interchangeably. It also includes the
 * following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
export class ReadWriteTransactionWrapper
  extends ReadOnlyTransactionWrapper
  implements FirebaseFirestore.Transaction
{
  /**
   * Creates a `ReadWriteTransactionWrapper` object around the specified
   * `Transaction` object.
   *
   * @param ref The `Transaction` object to wrap.
   */
  constructor(ref: FirebaseFirestore.Transaction) {
    super(ref);
  }

  /**
   * Create the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`. The operation will fail the transaction if a document
   * exists at the specified location.
   *
   * @param documentRef A reference to the document to be create.
   * @param data The object data to serialize as the document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */
  create<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >,
    data: FirebaseFirestore.WithFieldValue<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >
  ): this;
  /**
   * Create the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`. The operation will fail the transaction if a document
   * exists at the specified location.
   *
   * @param documentRef A reference to the document to be create.
   * @param data The object data to serialize as the document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */
  // This overload is the **exact** same as the one above. Without it,
  // TypeScript complains about `create` not being assignable to the base
  // `create` method in `FirebaseFirestore.Transaction`, but copying and pasting
  // the overload seems to fix it, even though it's literally the exact same
  // thing, so that's why it's included here. It doesn't actually add anything.
  create<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >,
    data: FirebaseFirestore.WithFieldValue<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >
  ): this;
  create<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >,
    data: FirebaseFirestore.WithFieldValue<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >
  ): this {
    this.ref.create(
      documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef,
      data
    );
    return this;
  }

  /**
   * Writes to the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`. If the document does not exist yet, it will be created.
   * If you pass `SetOptions`, the provided data can be merged into the existing
   * document.
   *
   * @param documentRef A reference to the document to be set.
   * @param data An object of the fields and values for the document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */
  set<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >,
    data: FirebaseFirestore.WithFieldValue<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >
  ): this;
  /**
   * Writes to the document referred to by the provided `DocumentReference` /
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
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */
  set<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >,
    data: FirebaseFirestore.PartialWithFieldValue<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >,
    options: FirebaseFirestore.SetOptions
  ): this;
  set<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >,
    data:
      | FirebaseFirestore.PartialWithFieldValue<
          DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
        >
      | FirebaseFirestore.WithFieldValue<
          DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
        >,
    options?: FirebaseFirestore.SetOptions
  ): this {
    if (options === undefined) {
      this.ref.set(
        documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef,
        data as FirebaseFirestore.WithFieldValue<
          DefaultIfNever<ConvertedType, GenericDocumentSchema>
        >
      );
    } else {
      this.ref.set(
        documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef,
        data,
        options
      );
    }
    return this;
  }

  /**
   * Updates fields in the document referred to by the provided
   * `DocumentReference` / `DocumentWrapper`. The update will fail if applied to
   * a document that does not exist.
   *
   * Nested fields can be updated by providing dot-separated field path strings.
   *
   * @param documentRef A reference to the document to be updated.
   * @param data An object containing the fields and values with which to update
   *        the document.
   * @param precondition A Precondition to enforce on this update.
   * @throws Error If the provided input is not valid Firestore data.
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */
  update<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >,
    data: FirebaseFirestore.UpdateData<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >,
    precondition?: FirebaseFirestore.Precondition
  ): this;
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
   *        to update, optionally followed by a `Precondition` to enforce on
   *        this update.
   * @throws Error If the provided input is not valid Firestore data.
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */
  update<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >,
    field: SchemaKeysOf<Document> | FirebaseFirestore.FieldPath,
    value: unknown,
    ...moreFieldsOrPrecondition: unknown[]
  ): this;
  update<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >,
    dataOrField:
      | FirebaseFirestore.UpdateData<
          DefaultIfNever<ConvertedType, GenericDocumentSchema>
        >
      | string
      | FirebaseFirestore.FieldPath,
    preconditionOrValue?: FirebaseFirestore.Precondition | unknown,
    ...moreFieldsOrPrecondition: unknown[]
  ): this;
  update<Document extends GenericFirestoreDocument, ConvertedType>(
    documentRef:
      | DocumentWrapper<Document, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
        >,
    dataOrField:
      | FirebaseFirestore.UpdateData<
          DefaultIfNever<ConvertedType, GenericDocumentSchema>
        >
      | string
      | FirebaseFirestore.FieldPath,
    preconditionOrValue?: FirebaseFirestore.Precondition | unknown,
    ...moreFieldsOrPrecondition: unknown[]
  ): this {
    this.ref.update(
      documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef,
      dataOrField as string | FirebaseFirestore.FieldPath,
      preconditionOrValue,
      ...moreFieldsOrPrecondition
    );
    return this;
  }

  /**
   * Deletes the document referred to by the provided `DocumentReference` /
   * `DocumentWrapper`.
   *
   * @param documentRef A reference to the document to be deleted.
   * @param precondition A Precondition to enforce for this delete.
   * @returns This `ReadWriteTransactionWrapper` / `ReadOnlyTransactionWrapper`
   *        instance. Used for chaining method calls.
   */
  delete(
    documentRef:
      | DocumentWrapper<GenericFirestoreDocument, unknown>
      | FirebaseFirestore.DocumentReference<unknown>,
    precondition?: FirebaseFirestore.Precondition
  ): this {
    this.ref.delete(
      documentRef instanceof DocumentWrapper ? documentRef.ref : documentRef,
      precondition
    );
    return this;
  }
}
