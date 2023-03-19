import type {
  DefaultIfNever,
  GenericDocumentSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  SchemaKeysOf,
  SchemaOfDocument,
  StrKeyof,
  SubCollectionsIn,
} from "@firestore-schema/core";
import type {
  GettableDocumentSchema,
  SettableDocumentSchema,
  TypedFirestoreDataConverter,
} from "./types";
import type FirebaseFirestore from "@google-cloud/firestore";
import CollectionWrapper from "./CollectionWrapper";

/** A typed wrapper class around Firestore `DocumentReference` objects. */
class DocumentWrapper<Document extends GenericFirestoreDocument, ConvertedType>
  // The `DocumentReference` class exported by Firebase has a private
  // constructor, which makes it hard to subclass it since we can't create our
  // own instances of it. Instead, we just `implement` the class so TypeScript
  // makes sure we implement all the proper methods without actually extending
  // it. Some of the methods are not directly assignable to
  // `DocumentReference<ConvertedType>` though because the types are not
  // directly assignable to each other, so I had to use `any`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  implements FirebaseFirestore.DocumentReference<any>
{
  /** The raw Firebase `DocumentReference` instance. */
  public ref: FirebaseFirestore.DocumentReference<
    DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
  >;

  /**
   * Creates a typed `DocumentWrapper` object around the specified
   * `DocumentReference` object.
   *
   * @param ref The `DocumentReference` object to wrap.
   */
  constructor(
    ref: FirebaseFirestore.DocumentReference<
      ConvertedType | GenericDocumentSchema
    >
  ) {
    this.ref = ref as FirebaseFirestore.DocumentReference<
      DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
    >;
  }

  /** The identifier of the document within its collection. */
  get id(): string {
    return this.ref.id;
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

  /**
   * A reference to the `CollectionWrapper` to which this `DocumentWrapper`
   * belongs.
   *
   * The returned `CollectionWrapper` will be **untyped** since this
   * `DocumentWrapper` only knows about its own children's schemas.
   */
  get parent(): CollectionWrapper<
    GenericFirestoreCollection,
    DefaultIfNever<ConvertedType, SchemaOfDocument<Document>>
  > {
    return new CollectionWrapper(this.ref.parent);
  }

  /**
   * A string representing the path of the referenced document (relative
   * to the root of the database).
   */
  get path(): string {
    return this.ref.path;
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
  ): CollectionWrapper<Document[CollectionName], never> {
    return new CollectionWrapper<Document[CollectionName], never>(
      this.ref.collection(collectionName)
    );
  }

  /**
   * Fetches the subcollections that are direct children of this document.
   *
   * @returns A Promise that resolves with an array of `CollectionWrapper`s.
   */
  listCollections(): Promise<
    CollectionWrapper<SubCollectionsIn<Document>, never>[]
  > {
    return this.ref
      .listCollections()
      .then((collections) =>
        collections.map(
          (collection) =>
            new CollectionWrapper<SubCollectionsIn<Document>, never>(collection)
        )
      );
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
    data: FirebaseFirestore.WithFieldValue<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >
  ): Promise<FirebaseFirestore.WriteResult> {
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
    data: FirebaseFirestore.WithFieldValue<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >
  ): Promise<FirebaseFirestore.WriteResult>;
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
    data: FirebaseFirestore.PartialWithFieldValue<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >,
    options: FirebaseFirestore.SetOptions
  ): Promise<FirebaseFirestore.WriteResult>;
  set(
    data:
      | FirebaseFirestore.PartialWithFieldValue<
          DefaultIfNever<ConvertedType, GenericDocumentSchema>
        >
      | FirebaseFirestore.WithFieldValue<
          DefaultIfNever<ConvertedType, GenericDocumentSchema>
        >,
    options?: FirebaseFirestore.SetOptions
  ) {
    if (options === undefined) {
      return this.ref.set(
        data as FirebaseFirestore.WithFieldValue<
          DefaultIfNever<ConvertedType, GenericDocumentSchema>
        >
      );
    } else {
      return this.ref.set(data, options);
    }
  }

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
  update(
    data: FirebaseFirestore.UpdateData<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >,
    precondition?: FirebaseFirestore.Precondition
  ): Promise<FirebaseFirestore.WriteResult>;
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
  update(
    field: SchemaKeysOf<Document> | FirebaseFirestore.FieldPath,
    value: unknown,
    ...moreFieldsOrPrecondition: unknown[]
  ): Promise<FirebaseFirestore.WriteResult>;
  update(
    dataOrField:
      | FirebaseFirestore.UpdateData<
          DefaultIfNever<ConvertedType, GenericDocumentSchema>
        >
      | string
      | FirebaseFirestore.FieldPath,
    preconditionOrValue?: FirebaseFirestore.Precondition | unknown,
    ...moreFieldsOrPrecondition: unknown[]
  ): Promise<FirebaseFirestore.WriteResult>;
  update(
    dataOrField:
      | FirebaseFirestore.UpdateData<ConvertedType | GenericDocumentSchema>
      | string
      | FirebaseFirestore.FieldPath,
    preconditionOrValue?: FirebaseFirestore.Precondition | unknown,
    ...moreFieldsOrPrecondition: unknown[]
  ): Promise<FirebaseFirestore.WriteResult> {
    // Firestore has two function overloads for `update()` that aren't
    // compatible with each other. Instead of trying to play with TypeScript to
    // get it to work somehow, we just choose the second function overload since
    // the actual JavaScript implementation of `update()` should be able to
    // handle either one anyway.
    return this.ref.update(
      dataOrField as string | FirebaseFirestore.FieldPath,
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
  delete(
    precondition?: FirebaseFirestore.Precondition
  ): Promise<FirebaseFirestore.WriteResult> {
    return this.ref.delete(precondition);
  }

  /**
   * Reads the document referred to by this `DocumentWrapper`.
   *
   * @return A Promise resolved with a `DocumentSnapshot` containing the
   *        current document contents.
   */
  get(): Promise<
    FirebaseFirestore.DocumentSnapshot<
      DefaultIfNever<ConvertedType, GettableDocumentSchema<Document>>
    >
  >;
  get(): Promise<
    FirebaseFirestore.DocumentSnapshot<ConvertedType | GenericDocumentSchema>
  > {
    return (
      this.ref as FirebaseFirestore.DocumentReference<
        DefaultIfNever<ConvertedType, GenericDocumentSchema>
      >
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
      snapshot: FirebaseFirestore.DocumentSnapshot<
        DefaultIfNever<ConvertedType, GettableDocumentSchema<Document>>
      >
    ) => void,
    onError?: (error: Error) => void
  ): () => void {
    return (
      this.ref as FirebaseFirestore.DocumentReference<
        DefaultIfNever<ConvertedType, GettableDocumentSchema<Document>>
      >
    ).onSnapshot(onNext, onError);
  }

  /**
   * Returns true if this `DocumentWrapper` is equal to the provided one.
   *
   * @param other The `DocumentWrapper` to compare against.
   * @return true if this `DocumentWrapper` is equal to the provided one.
   */
  isEqual(
    other: DocumentWrapper<GenericFirestoreDocument, ConvertedType>
  ): boolean;
  /**
   * Returns true if this `DocumentWrapper`'s `ref` is equal to the provided
   * `DocumentReference`.
   *
   * @param other The `DocumentReference` to compare against.
   * @return true if this `DocumentWrapper`'s `ref` is equal to the provided
   *        `DocumentReference`.
   */
  isEqual(
    other: FirebaseFirestore.DocumentReference<
      DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
    >
  ): boolean;
  isEqual(
    other:
      | DocumentWrapper<GenericFirestoreDocument, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
        >
  ): boolean;
  isEqual(
    other:
      | DocumentWrapper<GenericFirestoreDocument, ConvertedType>
      | FirebaseFirestore.DocumentReference<
          DefaultIfNever<ConvertedType, SettableDocumentSchema<Document>>
        >
  ): boolean {
    return other instanceof DocumentWrapper
      ? this.ref.isEqual(other.ref)
      : this.ref.isEqual(other as this["ref"]);
  }

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
  withConverter<U>(
    converter: TypedFirestoreDataConverter<SchemaOfDocument<Document>, U>
  ): DocumentWrapper<Document, U>;
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
  withConverter<U>(
    converter: TypedFirestoreDataConverter<SchemaOfDocument<Document>, U> | null
  ): DocumentWrapper<Document, never> | DocumentWrapper<Document, U>;
  withConverter<U>(
    converter: TypedFirestoreDataConverter<SchemaOfDocument<Document>, U> | null
  ): DocumentWrapper<Document, never> | DocumentWrapper<Document, U> {
    return new DocumentWrapper(
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

export default DocumentWrapper;
