import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type {
  DocumentsIn,
  GenericDocumentSchema,
  GenericFirestoreCollection,
  SchemaKeysOf,
  SchemaOfCollection,
} from "@firestore-schema/core";
import type {
  EnsureDocumentHasKey,
  EnsureDocumentKeyDoesNotExtendValue,
  EnsureValueExtendsDocumentKey,
  GettableDocumentSchema,
  GettableFirestoreDataType,
  GettableFirestoreDataTypeNoArray,
} from "./types";
import type FirestoreWrapper from "./FirestoreWrapper";

/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestoreTypes.Query `Query`} objects.
 *
 * Instances of this class are usually created automatically by calling
 * different methods on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const queryWrapper = firestore.collectionGroup("collectionName");
 * ```
 *
 * It includes the same methods as the underlying `Query` object with the same
 * behavior so that it can be used interchangeably. It also includes the
 * following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
class QueryWrapper<Collection extends GenericFirestoreCollection>
  implements FirebaseFirestoreTypes.Query<SchemaOfCollection<Collection>>
{
  /** The raw Firebase `Query` instance. */
  public ref: FirebaseFirestoreTypes.Query<SchemaOfCollection<Collection>>;

  /**
   * Creates a typed `QueryWrapper` object around the specified `Query` object.
   *
   * @param ref The `Query` object to wrap.
   */
  constructor(ref: FirebaseFirestoreTypes.Query<GenericDocumentSchema>) {
    this.ref = ref;
  }

  /**
   * Calculates the number of documents in the result set of the given query,
   * without actually downloading the documents.
   *
   * Using this function to count the documents is efficient because only the
   * final count, not the documents' data, is downloaded. This function can even
   * count the documents if the result set would be prohibitively large to
   * download entirely (e.g. thousands of documents).
   *
   * The result received from the server is presented, unaltered, without
   * considering any local state. That is, documents in the local cache are not
   * taken into consideration, neither are local modifications not yet
   * synchronized with the server. Previously-downloaded results, if any, are
   * not used: every request using this source necessarily involves a round trip
   * to the server.
   */
  count(): FirebaseFirestoreTypes.AggregateQuery<{
    count: FirebaseFirestoreTypes.AggregateField<number>;
  }> {
    return this.ref.count();
  }

  /** Same as `count()`. */
  countFromServer(): FirebaseFirestoreTypes.AggregateQuery<{
    count: FirebaseFirestoreTypes.AggregateField<number>;
  }> {
    return this.ref.countFromServer();
  }

  /**
   * Creates and returns a new `QueryWrapper` that ends at the provided document
   * (inclusive). The end position is relative to the order of the query. The
   * document must contain all of the fields provided in the orderBy of this
   * query.
   *
   * @example
   * ```ts
   * const user = await firestore.doc('users/alovelace').get();
   *
   * // Get all users up to a specific user in order of age
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .endAt(user);
   * ```
   *
   * @param snapshot The snapshot of the document to end at.
   * @returns The created `QueryWrapper`.
   */
  endAt(
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot
  ): QueryWrapper<Collection>;
  /**
   * Creates and returns a new `QueryWrapper` that ends at the provided fields
   * relative to the order of the query. The order of the field values must
   * match the order of the order by clauses of the query.
   *
   * @example
   * ```ts
   * // Get all users who's age is 30 or less
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .endAt(30);
   * ```
   *
   * @param fieldValues The field values to end this query at, in order of the
   * query's order by.
   * @returns The created `QueryWrapper`.
   */
  endAt(...fieldValues: unknown[]): QueryWrapper<Collection>;
  endAt(
    snapshotOrFieldValue: FirebaseFirestoreTypes.DocumentSnapshot | unknown,
    ...additionalFieldValues: unknown[]
  ): QueryWrapper<Collection> {
    return new QueryWrapper<Collection>(
      this.ref.endAt(snapshotOrFieldValue, ...additionalFieldValues)
    );
  }

  /**
   * Creates and returns a new `QueryWrapper` that ends before the provided
   * document (exclusive). The end position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @example
   * ```ts
   * const user = await firestore.doc('users/alovelace').get();
   *
   * // Get all users up to, but not including, a specific user in order of age
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .endBefore(user);
   * ```
   *
   * @param snapshot The snapshot of the document to end before.
   * @returns The created `QueryWrapper`.
   */
  endBefore(
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot
  ): QueryWrapper<Collection>;
  /**
   * Creates and returns a new `QueryWrapper` that ends before the provided
   * fields relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @example
   * ```ts
   * // Get all users who's age is 29 or less
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .endBefore(30);
   * ```
   *
   * @param fieldValues The field values to end this query before, in order of
   * the query's order by.
   * @returns The created `QueryWrapper`.
   */
  endBefore(...fieldValues: unknown[]): QueryWrapper<Collection>;
  endBefore(
    snapshotOrFieldValue: FirebaseFirestoreTypes.DocumentSnapshot | unknown,
    ...additionalFieldValues: unknown[]
  ): QueryWrapper<Collection> {
    return new QueryWrapper<Collection>(
      this.ref.endBefore(snapshotOrFieldValue, ...additionalFieldValues)
    );
  }

  /**
   * Executes the query and returns the results as a QuerySnapshot.
   *
   * Note: By default, get() attempts to provide up-to-date data when possible
   * by waiting for data from the server, but it may return cached data or fail
   * if you are offline and the server cannot be reached. This behavior can be
   * altered via the `GetOptions` parameter.
   *
   * @example
   * ```ts
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .get({
   *     source: 'server',
   *   });
   * ```
   *
   * @param options An object to configure the get behavior.
   * @returns A Promise that will be resolved with the results of the Query.
   */
  get(
    options?: FirebaseFirestoreTypes.GetOptions
  ): Promise<
    FirebaseFirestoreTypes.QuerySnapshot<SchemaOfCollection<Collection>>
  > {
    if (options === undefined) {
      // Call overload with 0 arguments.
      return this.get();
    } else {
      // Call overload with 1 argument.
      return this.ref.get(options);
    }
  }

  /**
   * Returns true if this `QueryWrapper` is equal to the provided one.
   *
   * @param other The `QueryWrapper` to compare against.
   * @returns true if this `QueryWrapper` is equal to the provided one.
   */
  isEqual(other: QueryWrapper<GenericFirestoreCollection>): boolean;
  /**
   * Returns true if this `QueryWrapper`'s `ref` is equal to the provided
   * `Query`.
   *
   * @param other The `Query` to compare against.
   * @returns true if this `QueryWrapper`'s `ref` is equal to the provided
   * `Query`.
   */
  isEqual(
    other: FirebaseFirestoreTypes.Query<SchemaOfCollection<Collection>>
  ): boolean;
  isEqual(
    other:
      | QueryWrapper<GenericFirestoreCollection>
      | FirebaseFirestoreTypes.Query<SchemaOfCollection<Collection>>
  ): boolean;
  isEqual(
    other:
      | QueryWrapper<GenericFirestoreCollection>
      | FirebaseFirestoreTypes.Query<SchemaOfCollection<Collection>>
  ): boolean {
    return this.ref.isEqual(other instanceof QueryWrapper ? other.ref : other);
  }

  /**
   * Creates and returns a new `QueryWrapper` where the results are limited to the
   * specified number of documents.
   *
   * @example
   * ```ts
   * // Get 10 users in order of age
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .limit(10)
   *   .get();
   * ```
   *
   * @param limit The maximum number of items to return.
   * @returns The created `QueryWrapper`.
   */
  limit(limit: number): QueryWrapper<Collection> {
    return new QueryWrapper<Collection>(this.ref.limit(limit));
  }

  /**
   * Creates and returns a new `QueryWrapper` where the results are limited to
   * the specified number of documents starting from the last document. The
   * order is dependent on the second parameter for the `orderBy` method. If
   * `desc` is used, the order is reversed. `orderBy` method call is required
   * when calling `limitToLast`.
   *
   * @example
   * ```ts
   * // Get the last 10 users in reverse order of age
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age', 'desc')
   *   .limitToLast(10)
   *   .get();
   * ```
   *
   * @param limitToLast The maximum number of items to return.
   * @returns The created `QueryWrapper`.
   */
  limitToLast(limit: number): QueryWrapper<Collection> {
    return new QueryWrapper<Collection>(this.ref.limitToLast(limit));
  }

  /**
   * Attaches a listener for `QuerySnapshot` events.
   *
   * > Although an `onCompletion` callback can be provided, it will never be
   * > called because the snapshot stream is never-ending.
   *
   * Returns an unsubscribe function to stop listening to events.
   *
   * @example
   * ```ts
   * const unsubscribe = firestore.collection('users')
   *   .onSnapshot({
   *     error: (e) => console.error(e),
   *     next: (querySnapshot) => {},
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
    next?: (
      snapshot: FirebaseFirestoreTypes.QuerySnapshot<
        GettableDocumentSchema<DocumentsIn<Collection>>
      >
    ) => void;
  }): () => void;
  /**
   * Attaches a listener for `QuerySnapshot` events.
   *
   * > Although an `onCompletion` callback can be provided, it will never be
   * > called because the snapshot stream is never-ending.
   *
   * Returns an unsubscribe function to stop listening to events.
   *
   * @example
   * ```ts
   * const unsubscribe = firestore.collection('users')
   *   .onSnapshot({
   *     error: (e) => console.error(e),
   *     next: (querySnapshot) => {},
   *   });
   *
   * unsubscribe();
   * ```
   *
   * @param options Options controlling the listen behavior.
   * @param observer A single object containing `next` and `error` callbacks.
   */
  onSnapshot(
    options: FirebaseFirestoreTypes.SnapshotListenOptions,
    observer: {
      complete?: () => void;
      error?: (error: Error) => void;
      next?: (
        snapshot: FirebaseFirestoreTypes.QuerySnapshot<
          GettableDocumentSchema<DocumentsIn<Collection>>
        >
      ) => void;
    }
  ): () => void;
  /**
   * Attaches a listener for `QuerySnapshot` events.
   *
   * > Although an `onCompletion` callback can be provided, it will never be
   * > called because the snapshot stream is never-ending.
   *
   * Returns an unsubscribe function to stop listening to events.
   *
   * @example
   * ```ts
   * const unsubscribe = firestore.collection('users')
   *   .onSnapshot({
   *     error: (e) => console.error(e),
   *     next: (querySnapshot) => {},
   *   });
   *
   * unsubscribe();
   * ```
   *
   * @param onNext A callback to be called every time a new `QuerySnapshot` is available.
   * @param onError A callback to be called if the listen fails or is cancelled. No further callbacks will occur.
   * @param onCompletion An optional function which will never be called.
   */
  onSnapshot(
    onNext: (
      snapshot: FirebaseFirestoreTypes.QuerySnapshot<
        GettableDocumentSchema<DocumentsIn<Collection>>
      >
    ) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;
  /**
   * Attaches a listener for `QuerySnapshot` events.
   *
   * > Although an `onCompletion` callback can be provided, it will never be
   * > called because the snapshot stream is never-ending.
   *
   * Returns an unsubscribe function to stop listening to events.
   *
   * @example
   * ```ts
   * const unsubscribe = firestore.collection('users')
   *   .onSnapshot({
   *     error: (e) => console.error(e),
   *     next: (querySnapshot) => {},
   *   });
   *
   * unsubscribe();
   * ```
   *
   * @param options Options controlling the listen behavior.
   * @param onNext A callback to be called every time a new `QuerySnapshot` is
   * available.
   * @param onError A callback to be called if the listen fails or is cancelled.
   * No further callbacks will occur.
   * @param onCompletion An optional function which will never be called.
   */
  onSnapshot(
    options: FirebaseFirestoreTypes.SnapshotListenOptions,
    onNext: (
      snapshot: FirebaseFirestoreTypes.QuerySnapshot<
        GettableDocumentSchema<DocumentsIn<Collection>>
      >
    ) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;
  onSnapshot(
    observerOrOptionsOrOnNext:
      | {
          complete?: () => void;
          error?: (error: Error) => void;
          next?: (
            snapshot: FirebaseFirestoreTypes.QuerySnapshot<
              GettableDocumentSchema<DocumentsIn<Collection>>
            >
          ) => void;
        }
      | FirebaseFirestoreTypes.SnapshotListenOptions
      | ((
          snapshot: FirebaseFirestoreTypes.QuerySnapshot<
            GettableDocumentSchema<DocumentsIn<Collection>>
          >
        ) => void),
    observerOrOnErrorOrOnNext?:
      | {
          complete?: () => void;
          error?: (error: Error) => void;
          next?: (
            snapshot: FirebaseFirestoreTypes.QuerySnapshot<
              GettableDocumentSchema<DocumentsIn<Collection>>
            >
          ) => void;
        }
      | ((error: Error) => void)
      | ((
          snapshot: FirebaseFirestoreTypes.QuerySnapshot<
            GettableDocumentSchema<DocumentsIn<Collection>>
          >
        ) => void),
    onCompletionOrOnError?: (() => void) | ((error: Error) => void),
    onCompletion?: () => void
  ) {
    if (onCompletion !== undefined) {
      // Call overload with all 4 arguments. The actual types don't matter
      // because the JavaScript implementation will take care of the type
      // checking.
      return this.ref.onSnapshot(
        observerOrOptionsOrOnNext as FirebaseFirestoreTypes.SnapshotListenOptions,
        observerOrOnErrorOrOnNext as () => void,
        onCompletionOrOnError,
        onCompletion
      );
    } else if (onCompletionOrOnError !== undefined) {
      // Call overload with 3/4 arguments. The actual types don't matter because
      // the JavaScript implementation will take care of the type checking.
      return this.ref.onSnapshot(
        observerOrOptionsOrOnNext as FirebaseFirestoreTypes.SnapshotListenOptions,
        observerOrOnErrorOrOnNext as () => void,
        onCompletionOrOnError
      );
    } else if (observerOrOnErrorOrOnNext !== undefined) {
      // Call overload 2/4 arguments. The actual types don't matter because the
      // JavaScript implementation will take care of the type checking.
      return this.ref.onSnapshot(
        observerOrOptionsOrOnNext as FirebaseFirestoreTypes.SnapshotListenOptions,
        observerOrOnErrorOrOnNext as () => void
      );
    } else {
      // Call overload with 1/4 arguments. The actual types don't matter because
      // the JavaScript implementation will take care of the type checking.
      return this.ref.onSnapshot(observerOrOptionsOrOnNext as () => void);
    }
  }

  /**
   * Creates and returns a new `QueryWrapper` that's additionally sorted by the
   * specified field, optionally in descending order instead of ascending.
   *
   * @example
   * ```ts
   * // Get users in order of age, descending
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age', 'desc')
   *   .get();
   * ```
   *
   * @param fieldPath The field to sort by. Either a string or FieldPath
   * instance.
   * @param directionStr Optional direction to sort by (`asc` or `desc`). If not
   * specified, order will be ascending.
   * @returns The created `QueryWrapper`.
   */
  orderBy(
    fieldPath: string | FirebaseFirestoreTypes.FieldPath,
    directionStr?: "asc" | "desc"
  ): QueryWrapper<Collection> {
    if (directionStr === undefined) {
      // Call overload with 1 argument.
      return new QueryWrapper<Collection>(this.ref.orderBy(fieldPath));
    } else {
      // Call overload with 2 arguments.
      return new QueryWrapper<Collection>(
        this.ref.orderBy(fieldPath, directionStr)
      );
    }
  }

  /**
   * Creates and returns a new `QueryWrapper` that starts after the provided
   * document (exclusive). The start position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @example
   * ```ts
   * const user = await firestore.doc('users/alovelace').get();
   *
   * // Get all users up to, but not including, a specific user in order of age
   * const querySnapshot = firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .startAfter(user)
   *   .get();
   * ```
   *
   * @param snapshot The snapshot of the document to start after.
   * @returns The created `QueryWrapper`.
   */
  startAfter(
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot
  ): QueryWrapper<Collection>;
  /**
   * Creates and returns a new `QueryWrapper` that starts after the provided
   * fields relative to the order of the query. The order of the field values
   * must match the order of the order by clauses of the query.
   *
   * @example
   * ```ts
   * // Get all users who's age is above 30
   * const querySnapshot = firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .startAfter(30)
   *   .get();
   * ```
   *
   * @param fieldValues The field values to start this query after, in order of
   * the query's order by.
   * @returns The created `QueryWrapper`.
   */
  startAfter(...fieldValues: unknown[]): QueryWrapper<Collection>;
  startAfter(
    snapshotOrFieldValue: FirebaseFirestoreTypes.DocumentSnapshot | unknown,
    ...additionalFieldValues: unknown[]
  ): QueryWrapper<Collection> {
    return new QueryWrapper<Collection>(
      this.ref.startAfter(snapshotOrFieldValue, ...additionalFieldValues)
    );
  }

  /**
   * Creates and returns a new `QueryWrapper` that starts at the provided
   * document (inclusive). The start position is relative to the order of the
   * query. The document must contain all of the fields provided in the orderBy
   * of this query.
   *
   * @example
   * ```ts
   * const user = await firestore.doc('users/alovelace').get();
   *
   * // Get all users up to a specific user in order of age
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .startAt(user)
   *   .get();
   * ```
   *
   * @param snapshot The snapshot of the document to start at.
   * @returns The created `QueryWrapper`.
   */
  startAt(
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot
  ): QueryWrapper<Collection>;
  /**
   * Creates and returns a new `QueryWrapper` that starts at the provided fields
   * relative to the order of the query. The order of the field values must
   * match the order of the order by clauses of the query.
   *
   * @example
   * ```ts
   * // Get all users who's age is 30 or above
   * const querySnapshot = await firestore
   *   .collection('users')
   *   .orderBy('age')
   *   .startAt(30)
   *   .get();
   * ```
   *
   * @param fieldValues The field values to start this query at, in order of the
   * query's order by.
   * @returns The created `QueryWrapper`.
   */
  startAt(...fieldValues: unknown[]): QueryWrapper<Collection>;
  startAt(
    snapshotOrFieldValue: FirebaseFirestoreTypes.DocumentSnapshot | unknown,
    ...additionalFieldValues: unknown[]
  ): QueryWrapper<Collection> {
    return new QueryWrapper<Collection>(
      this.ref.startAt(snapshotOrFieldValue, ...additionalFieldValues)
    );
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
   * @returns The created `QueryWrapper`.
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
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
   */
  where<InType extends GettableFirestoreDataType>(
    fieldPath: string | FirebaseFirestoreTypes.FieldPath,
    opStr: "in",
    value: InType[]
  ): EnsureValueExtendsDocumentKey<Collection, string, InType> extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
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
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
   */
  where<ContainsType extends GettableFirestoreDataTypeNoArray>(
    fieldPath: string | FirebaseFirestoreTypes.FieldPath,
    opStr: "array-contains",
    value: ContainsType
  ): EnsureValueExtendsDocumentKey<
    Collection,
    string,
    ContainsType[]
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
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
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
   */
  where<ContainsAnyType extends GettableFirestoreDataTypeNoArray>(
    fieldPath: string | FirebaseFirestoreTypes.FieldPath,
    opStr: "array-contains-any",
    value: ContainsAnyType[]
  ): EnsureValueExtendsDocumentKey<
    Collection,
    string,
    ContainsAnyType[]
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
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
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
   */
  where<CompareType extends GettableFirestoreDataType>(
    fieldPath: string | FirebaseFirestoreTypes.FieldPath,
    opStr: "==" | "<=" | ">=" | "<" | ">",
    value: CompareType
  ): EnsureValueExtendsDocumentKey<
    Collection,
    string,
    CompareType
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
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
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
   */
  where<CompareType extends GettableFirestoreDataType>(
    fieldPath: string | FirebaseFirestoreTypes.FieldPath,
    opStr: "!=",
    value: CompareType
  ): EnsureDocumentKeyDoesNotExtendValue<
    Collection,
    string,
    CompareType
  > extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
   */
  where<FieldPathType extends SchemaKeysOf<DocumentsIn<Collection>>>(
    fieldPath: FieldPathType,
    opStr: FirebaseFirestoreTypes.WhereFilterOp,
    value: unknown
  ): EnsureDocumentHasKey<Collection, FieldPathType> extends infer R
    ? R extends GenericFirestoreCollection
      ? QueryWrapper<R>
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
   * @returns The created `QueryWrapper`.
   */
  where(
    fieldPath: string | FirebaseFirestoreTypes.FieldPath,
    opStr: FirebaseFirestoreTypes.WhereFilterOp,
    value: unknown
  ): QueryWrapper<Collection>;
  where(
    fieldPathOrFilter: string | FirebaseFirestoreTypes.FieldPath,
    opStr: FirebaseFirestoreTypes.WhereFilterOp,
    value: unknown
  ): QueryWrapper<Collection> | QueryWrapper<GenericFirestoreCollection> {
    return new QueryWrapper<GenericFirestoreCollection>(
      this.ref.where(
        fieldPathOrFilter as string | FirebaseFirestoreTypes.FieldPath,
        opStr,
        value
      )
    );
  }
  // #endregion
}

export default QueryWrapper;
