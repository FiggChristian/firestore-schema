import type FirebaseFirestore from "@google-cloud/firestore";
import type {
  DocumentsIn,
  Expand,
  GenericDocumentSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  SchemaKeysOf,
  SchemaOfCollection,
  DefaultIfNever,
} from "@firestore-schema/core";
import type {
  EnsureDocumentHasKey,
  EnsureDocumentKeyDoesNotExtendValue,
  EnsureValueExtendsDocumentKey,
  GettableFirestoreDataType,
  GettableFirestoreDataTypeNoArray,
  TypedFirestoreDataConverter,
} from "./types";
import type FirestoreWrapper from "./FirestoreWrapper";

/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.Query `Query`} objects.
 *
 * Instances of this class are usually created automatically by calling
 * different methods on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * const queryWrapper = firestore.collectionGroup("collectionName").where( ... );
 * ```
 *
 * It includes the same methods as the underlying `Query` object with the same
 * behavior so that it can be used interchangeably. It also includes the
 * following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
class QueryWrapper<Collection extends GenericFirestoreCollection, ConvertedType>
  implements
    FirebaseFirestore.Query<
      DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
    >
{
  /** The raw Firebase `Query` instance. */
  public ref: FirebaseFirestore.Query<
    DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
  >;

  /**
   * Creates a typed `QueryWrapper` object around the specified `Query` object.
   *
   * @param ref The `Query` object to wrap.
   */
  constructor(
    ref: FirebaseFirestore.Query<ConvertedType | GenericDocumentSchema>
  ) {
    this.ref = ref as FirebaseFirestore.Query<
      DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
    >;
  }

  /**
   * The `Firestore` for the Firestore database (useful for performing
   * transactions, etc.).
   */
  get firestore(): FirebaseFirestore.Firestore {
    // This is wrapped in a getter instead of being assigned directly because
    // the implementation of `Query.firestore` is also a getter, and thus not
    // guaranteed to return the same value every time (even though I'm pretty
    // sure it does, but to ensure consistency in future version...).
    return this.ref.firestore;
  }

  // #region where overloads
  // This section includes a bunch of overloads for the `where` method. Each
  // operator type (e.g., `==`, `in`, etc.) contains different return types so
  // that the document types are filtered as best as possible by TypeScript. For
  // example, using the `array-contains` operator filters out to include only
  // documents whose corresponding key points to an array that could contain the
  // filtered type. This makes it more type-safe when using `collectionGroup`
  // because it forces you to filter documents you may not have considered were
  // matched, but that were caught by TypeScript.
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<
    FieldPathType extends SchemaKeysOf<DocumentsIn<Collection>>,
    InType extends GettableFirestoreDataType
  >(
    fieldPath: FieldPathType,
    opStr: "in",
    value: InType[]
  ): EnsureValueExtendsDocumentKey<
    Collection,
    FieldPathType,
    InType
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<InType extends GettableFirestoreDataType>(
    fieldPath: string | FirebaseFirestore.FieldPath,
    opStr: "in",
    value: InType[]
  ): EnsureValueExtendsDocumentKey<Collection, string, InType> extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<
    FieldPathType extends SchemaKeysOf<DocumentsIn<Collection>>,
    ContainsType extends GettableFirestoreDataTypeNoArray
  >(
    fieldPath: FieldPathType,
    opStr: "array-contains",
    value: ContainsType
  ): EnsureValueExtendsDocumentKey<
    Collection,
    FieldPathType,
    ContainsType[]
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<ContainsType extends GettableFirestoreDataTypeNoArray>(
    fieldPath: string | FirebaseFirestore.FieldPath,
    opStr: "array-contains",
    value: ContainsType
  ): EnsureValueExtendsDocumentKey<
    Collection,
    string,
    ContainsType[]
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<
    FieldPathType extends SchemaKeysOf<DocumentsIn<Collection>>,
    ContainsAnyType extends GettableFirestoreDataTypeNoArray
  >(
    fieldPath: FieldPathType,
    opStr: "array-contains-any",
    value: ContainsAnyType[]
  ): EnsureValueExtendsDocumentKey<
    Collection,
    FieldPathType,
    ContainsAnyType[]
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<ContainsAnyType extends GettableFirestoreDataTypeNoArray>(
    fieldPath: string | FirebaseFirestore.FieldPath,
    opStr: "array-contains-any",
    value: ContainsAnyType[]
  ): EnsureValueExtendsDocumentKey<
    Collection,
    string,
    ContainsAnyType[]
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<
    FieldPathType extends SchemaKeysOf<DocumentsIn<Collection>>,
    CompareType extends GettableFirestoreDataType
  >(
    fieldPath: FieldPathType,
    opStr: "==" | "<=" | ">=" | "<" | ">",
    value: CompareType
  ): EnsureValueExtendsDocumentKey<
    Collection,
    FieldPathType,
    CompareType
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<CompareType extends GettableFirestoreDataType>(
    fieldPath: string | FirebaseFirestore.FieldPath,
    opStr: "==" | "<=" | ">=" | "<" | ">",
    value: CompareType
  ): EnsureValueExtendsDocumentKey<
    Collection,
    string,
    CompareType
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<
    FieldPathType extends SchemaKeysOf<DocumentsIn<Collection>>,
    CompareType extends GettableFirestoreDataType
  >(
    fieldPath: FieldPathType,
    opStr: "!=",
    value: CompareType
  ): EnsureDocumentKeyDoesNotExtendValue<
    Collection,
    FieldPathType,
    CompareType
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<CompareType extends GettableFirestoreDataType>(
    fieldPath: string | FirebaseFirestore.FieldPath,
    opStr: "!=",
    value: CompareType
  ): EnsureDocumentKeyDoesNotExtendValue<
    Collection,
    string,
    CompareType
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where<FieldPathType extends SchemaKeysOf<DocumentsIn<Collection>>>(
    fieldPath: FieldPathType,
    opStr: FirebaseFirestore.WhereFilterOp,
    value: unknown
  ): EnsureDocumentHasKey<Collection, FieldPathType> extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R, ConvertedType>
      : never
    : never;
  /**
   * Creates and returns a new `QueryWrapper` with the additional filter that
   * documents must contain the specified field and that its value should
   * satisfy the relation constraint provided.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the filter.
   *
   * @param fieldPath The path to compare
   * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
   * @param value The value for comparison
   * @return The created `QueryWrapper`.
   */
  where(
    fieldPath: string | FirebaseFirestore.FieldPath,
    opStr: FirebaseFirestore.WhereFilterOp,
    value: unknown
  ): QueryWrapper<Collection, ConvertedType>;
  where(
    fieldPathOrFilter: string | FirebaseFirestore.FieldPath,
    opStr: FirebaseFirestore.WhereFilterOp,
    value: unknown
  ):
    | QueryWrapper<Collection, ConvertedType>
    | QueryWrapper<GenericFirestoreCollection, ConvertedType> {
    return new QueryWrapper<GenericFirestoreCollection, ConvertedType>(
      this.ref.where(
        fieldPathOrFilter as string | FirebaseFirestore.FieldPath,
        opStr,
        value
      )
    );
  }
  // #endregion

  /**
   * Creates and returns a new `QueryWrapper` that's additionally sorted by the
   * specified field, optionally in descending order instead of ascending.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the order.
   *
   * @param fieldPath The field to sort by.
   * @param directionStr Optional direction to sort by ('asc' or 'desc'). If not
   *        specified, order will be ascending.
   * @return The created `QueryWrapper`.
   */
  orderBy(
    fieldPath: string | FirebaseFirestore.FieldPath,
    directionStr?: FirebaseFirestore.OrderByDirection
  ): QueryWrapper<Collection, ConvertedType> {
    return new QueryWrapper<Collection, ConvertedType>(
      this.ref.orderBy(fieldPath, directionStr)
    );
  }

  /**
   * Creates and returns a new `QueryWrapper` that only returns the first
   * matching documents.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the limit.
   *
   * @param limit The maximum number of items to return.
   * @return The created `QueryWrapper`.
   */
  limit(limit: number): QueryWrapper<Collection, ConvertedType> {
    return new QueryWrapper<Collection, ConvertedType>(this.ref.limit(limit));
  }

  /**
   * Creates and returns a new `QueryWrapper` that only returns the last
   * matching documents.
   *
   * You must specify at least one `orderBy` clause for `limitToLast` queries,
   * otherwise an exception will be thrown during execution.
   *
   * Results for `limitToLast` queries cannot be streamed via the `stream()`
   * API.
   *
   * @param limit The maximum number of items to return.
   * @return The created `QueryWrapper`.
   */
  limitToLast(limit: number): QueryWrapper<Collection, ConvertedType> {
    return new QueryWrapper<Collection, ConvertedType>(
      this.ref.limitToLast(limit)
    );
  }

  /**
   * Specifies the offset of the returned results.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the offset.
   *
   * @param offset The offset to apply to the `QueryWrapper` results.
   * @return The created `QueryWrapper`.
   */
  offset(offset: number): QueryWrapper<Collection, ConvertedType> {
    return new QueryWrapper<Collection, ConvertedType>(this.ref.offset(offset));
  }

  /**
   * Creates and returns a new `QueryWrapper` instance that applies a field mask
   * to the result and returns only the specified subset of fields. You can
   * specify a list of field paths to return, or use an empty list to only
   * return the references of matching documents.
   *
   * Queries that contain field masks cannot be listened to via `onSnapshot()`
   * listeners.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the field mask.
   *
   * @param field The field paths to return.
   * @return The created `QueryWrapper`.
   */
  // This overload is a special case where the user passes *no* fields at all,
  // which means *no* fields will appear in the resulting documents. All
  // documents' schemas have all their data stripped, leaving only an empty
  // object.
  select(): Collection extends GenericFirestoreCollection
    ? // The type here looks kind of complicated, but it's basically just going
      // through each collection and each document in that collection, and
      // replacing the schema with an empty object. All the other data in the
      // collections and nested documents are left untouched.
      QueryWrapper<
        {
          [CollectionKey in keyof Collection]: CollectionKey extends string
            ? Collection[CollectionKey] extends infer Document
              ? Document extends GenericFirestoreDocument
                ? {
                    [DocumentKey in keyof Document]: DocumentKey extends symbol
                      ? // Instead of `{}`, which means "any non-nullish value",
                        // not an empty object, we `Pick` 0 keys (i.e., `never`)
                        // from the schema, which leaves us with an empty
                        // object.
                        Expand<Pick<Document[DocumentKey], never>>
                      : Document[DocumentKey];
                  }
                : never
              : never
            : Collection[CollectionKey];
        },
        never
      >
    : never;
  /**
   * Creates and returns a new `QueryWrapper` instance that applies a field mask
   * to the result and returns only the specified subset of fields. You can
   * specify a list of field paths to return, or use an empty list to only
   * return the references of matching documents.
   *
   * Queries that contain field masks cannot be listened to via `onSnapshot()`
   * listeners.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the field mask.
   *
   * @param field The field paths to return.
   * @return The created `QueryWrapper`.
   */
  // This overload is for when the user passes in one or more specific fields
  // that TypeScript can recognize and strip from the document schemas. If the
  // user passes in any unrecognized fields or a FirebaseFirestore.FieldPath, we have no choice
  // but to fall back to the least specific overload, which uses a generic
  // collection with no type information.
  select<Fields extends SchemaKeysOf<DocumentsIn<Collection>>>(
    ...field: Fields[]
  ): Collection extends GenericFirestoreCollection
    ? // This is doing almost the same as the first overload, except instead of
      // stripping all the keys from the document schema, we're `Pick`ing any
      // fields matched by `Fields`, discarding all the other fields.
      QueryWrapper<
        {
          [CollectionKey in keyof Collection]: CollectionKey extends string
            ? Collection[CollectionKey] extends infer Document
              ? Document extends GenericFirestoreDocument
                ? {
                    [DocumentKey in keyof Document]: DocumentKey extends symbol
                      ? Document[DocumentKey] extends infer Schema
                        ? Schema extends GenericDocumentSchema
                          ? Expand<Pick<Schema, Extract<keyof Schema, Fields>>>
                          : never
                        : never
                      : Document[DocumentKey];
                  }
                : never
              : never
            : Collection[CollectionKey];
        },
        never
      >
    : never;
  /**
   * Creates and returns a new `QueryWrapper` instance that applies a field mask
   * to the result and returns only the specified subset of fields. You can
   * specify a list of field paths to return, or use an empty list to only
   * return the references of matching documents.
   *
   * Queries that contain field masks cannot be listened to via `onSnapshot()`
   * listeners.
   *
   * This function returns a new (immutable) instance of the `QueryWrapper`
   * (rather than modify the existing instance) to impose the field mask.
   *
   * @param field The field paths to return.
   * @return The created `QueryWrapper`.
   */
  // This is the least specific overload, which is only used when TypeScript
  // isn't able to determine which fields the user is `select`ing because
  // they're passed as unrecognized strings or FieldPaths. The returned
  // `QueryWrapper` loses its type information and uses a
  // `GenericFirestoreCollection` because we're not able to say for sure what
  // the resulting documents will look like.
  select(
    ...field: (string | FirebaseFirestore.FieldPath)[]
  ): QueryWrapper<GenericFirestoreCollection, never>;
  select(
    ...field: (string | FirebaseFirestore.FieldPath)[]
  ): QueryWrapper<GenericFirestoreCollection, never> {
    return new QueryWrapper(this.ref.select(...field));
  }

  /**
   * Creates and returns a new `QueryWrapper` that starts at the provided
   * document (inclusive). The starting position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @param snapshot The snapshot of the document to start after.
   * @return The created `QueryWrapper`.
   */
  startAt(
    snapshot: FirebaseFirestore.DocumentSnapshot
  ): QueryWrapper<Collection, ConvertedType>;
  /**
   * Creates and returns a new `QueryWrapper` that starts at the provided fields
   * relative to the order of the query. The order of the field values must
   * match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to start this query at, in order of the
   *        query's order by.
   * @return The created `QueryWrapper`.
   */
  startAt(...fieldValues: unknown[]): QueryWrapper<Collection, ConvertedType>;
  startAt(
    snapshotOrFieldValue: FirebaseFirestore.DocumentSnapshot | unknown,
    ...additionalFieldValues: unknown[]
  ): QueryWrapper<Collection, ConvertedType> {
    return new QueryWrapper<Collection, ConvertedType>(
      this.ref.startAt(snapshotOrFieldValue, ...additionalFieldValues)
    );
  }

  /**
   * Creates and returns a new `QueryWrapper` that starts after the provided
   * document (exclusive). The starting position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @param snapshot The snapshot of the document to start after.
   * @return The created `QueryWrapper`.
   */
  startAfter(
    snapshot: FirebaseFirestore.DocumentSnapshot
  ): QueryWrapper<Collection, ConvertedType>;
  /**
   * Creates and returns a new `QueryWrapper` that starts after the provided
   * fields relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to start this query after, in order of
   *        the query's order by.
   * @return The created `QueryWrapper`.
   */
  startAfter(
    ...fieldValues: unknown[]
  ): QueryWrapper<Collection, ConvertedType>;
  startAfter(
    snapshotOrFieldValue: FirebaseFirestore.DocumentSnapshot | unknown,
    ...additionalFieldValues: unknown[]
  ): QueryWrapper<Collection, ConvertedType> {
    return new QueryWrapper<Collection, ConvertedType>(
      this.ref.startAfter(snapshotOrFieldValue, ...additionalFieldValues)
    );
  }

  /**
   * Creates and returns a new `QueryWrapper` that ends before the provided
   * document (exclusive). The end position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @param snapshot The snapshot of the document to end before.
   * @return The created `QueryWrapper`.
   */
  endBefore(
    snapshot: FirebaseFirestore.DocumentSnapshot
  ): QueryWrapper<Collection, ConvertedType>;
  /**
   * Creates and returns a new `QueryWrapper` that ends before the provided
   * fields relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to end this query before, in order of
   *        the query's order by.
   * @return The created `QueryWrapper`.
   */
  endBefore(...fieldValues: unknown[]): QueryWrapper<Collection, ConvertedType>;
  endBefore(
    snapshotOrFieldValue: FirebaseFirestore.DocumentSnapshot | unknown,
    ...additionalFieldValues: unknown[]
  ): QueryWrapper<Collection, ConvertedType> {
    return new QueryWrapper<Collection, ConvertedType>(
      this.ref.endBefore(snapshotOrFieldValue, ...additionalFieldValues)
    );
  }

  /**
   * Creates and returns a new `QueryWrapper` that ends at the provided document
   * (inclusive). The end position is relative to the order of the query. The
   * document must contain all of the fields provided in the orderBy of this
   * query.
   *
   * @param snapshot The snapshot of the document to end at.
   * @return The created `QueryWrapper`.
   */
  endAt(
    snapshot: FirebaseFirestore.DocumentSnapshot
  ): QueryWrapper<Collection, ConvertedType>;

  /**
   * Creates and returns a new `QueryWrapper` that ends at the provided fields
   * relative to the order of the query. The order of the field values must
   * match the order of the order by clauses of the query.
   *
   * @param fieldValues The field values to end this query at, in order of the
   *        query's order by.
   * @return The created `QueryWrapper`.
   */
  endAt(...fieldValues: unknown[]): QueryWrapper<Collection, ConvertedType>;
  endAt(
    snapshotOrFieldValue: FirebaseFirestore.DocumentSnapshot | unknown,
    ...additionalFieldValues: unknown[]
  ): QueryWrapper<Collection, ConvertedType> {
    return new QueryWrapper<Collection, ConvertedType>(
      this.ref.endAt(snapshotOrFieldValue, ...additionalFieldValues)
    );
  }

  /**
   * Executes the query and returns the results as a `QuerySnapshot`.
   *
   * @return A Promise that will be resolved with the results of the
   *        `QueryWrapper`.
   */
  get(): Promise<
    FirebaseFirestore.QuerySnapshot<
      DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
    >
  > {
    return this.ref.get();
  }

  /**
   * Executes the query and returns the results as Node Stream.
   *
   * @returns A stream of `QueryDocumentSnapshot`.
   */
  stream(): NodeJS.ReadableStream {
    return this.ref.stream();
  }

  /**
   * Attaches a listener for `QuerySnapshot `events.
   *
   * @param onNext A callback to be called every time a new `QuerySnapshot`
   *        is available.
   * @param onError A callback to be called if the listen fails or is
   *        cancelled. No further callbacks will occur.
   * @return An unsubscribe function that can be called to cancel
   *        the snapshot listener.
   */
  onSnapshot(
    onNext: (
      snapshot: FirebaseFirestore.QuerySnapshot<
        DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
      >
    ) => void,
    onError?: (error: Error) => void
  ): () => void {
    return this.ref.onSnapshot(onNext, onError);
  }

  /**
   * Returns a query that counts the documents in the result set of this query.
   *
   * The returned query, when executed, counts the documents in the result set
   * of this query without actually downloading the documents.
   *
   * Using the returned query to count the documents is efficient because only
   * the final count, not the documents' data, is downloaded. The returned query
   * can even count the documents if the result set would be prohibitively large
   * to download entirely (e.g. thousands of documents).
   *
   * @return A query that counts the documents in the result set of this query.
   *        The count can be retrieved from `snapshot.data().count`, where
   *        `snapshot` is the `AggregateQuerySnapshot` resulting from running
   *        the returned query.
   */
  count(): FirebaseFirestore.AggregateQuery<{
    count: FirebaseFirestore.AggregateField<number>;
  }> {
    return this.ref.count();
  }

  /**
   * Returns true if this `QueryWrapper` is equal to the provided one.
   *
   * @param other The `QueryWrapper` to compare against.
   * @return true if this `QueryWrapper` is equal to the provided one.
   */
  isEqual(
    other: QueryWrapper<GenericFirestoreCollection, ConvertedType>
  ): boolean;
  /**
   * Returns true if this `QueryWrapper`'s `ref` is equal to the provided
   * `Query`.
   *
   * @param other The `Query` to compare against.
   * @return true if this `QueryWrapper`'s `ref` is equal to the provided
   *        `Query`.
   */
  isEqual(
    other: FirebaseFirestore.Query<
      DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
    >
  ): boolean;
  isEqual(
    other:
      | QueryWrapper<GenericFirestoreCollection, ConvertedType>
      | FirebaseFirestore.Query<
          DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
        >
  ): boolean;
  isEqual(
    other:
      | QueryWrapper<GenericFirestoreCollection, ConvertedType>
      | FirebaseFirestore.Query<
          DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
        >
  ): boolean {
    return this.ref.isEqual(other instanceof QueryWrapper ? other.ref : other);
  }

  /**
   * Applies a custom data converter to this `QueryWrapper`, allowing you to use
   * your own custom model objects with Firestore. When you call `get()` on the
   * returned `QueryWrapper`, the provided converter will convert between
   * Firestore data and your custom type `U`.
   *
   * @param converter Converts objects to and from Firestore. Passing in `null`
   *        removes the current converter.
   * @return A `QueryWrapper<U>` that uses the provided converter.
   */
  withConverter<U>(
    converter: TypedFirestoreDataConverter<SchemaOfCollection<Collection>, U>
  ): QueryWrapper<Collection, U>;
  /**
   * Applies a custom data converter to this `QueryWrapper`, allowing you to use
   * your own custom model objects with Firestore. When you call `get()` on the
   * returned `QueryWrapper`, the provided converter will convert between
   * Firestore data and your custom type `U`.
   *
   * @param converter Converts objects to and from Firestore. Passing in `null`
   *        removes the current converter.
   * @return A `QueryWrapper<U>` that uses the provided converter.
   */
  withConverter(converter: null): QueryWrapper<Collection, never>;
  withConverter<U>(
    converter: TypedFirestoreDataConverter<
      SchemaOfCollection<Collection>,
      U
    > | null
  ): QueryWrapper<Collection, never> | QueryWrapper<Collection, U>;
  withConverter<U>(
    converter: TypedFirestoreDataConverter<
      SchemaOfCollection<Collection>,
      U
    > | null
  ): QueryWrapper<Collection, never> | QueryWrapper<Collection, U> {
    return new QueryWrapper(
      // Pretty stupid, but TypeScript forces us to choose one of the two
      // overloads, so we have to determine the type of `converter` before
      // passing it into `withConverter`, even though it's literally the same
      // function call.
      converter == null
        ? this.ref.withConverter(converter)
        : this.ref.withConverter(converter)
    );
  }
}

export default QueryWrapper;
