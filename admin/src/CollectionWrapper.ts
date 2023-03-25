import type {
  DefaultIfNever,
  DocumentsIn,
  Expand,
  GenericDocumentSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  SchemaOfCollection,
  StrKeyof,
  UnionOfTuplesToIntersection,
} from "@firestore-schema/core";
import type {
  SettableDocumentSchema,
  TypedFirestoreDataConverter,
} from "./types";
import type FirebaseFirestore from "@google-cloud/firestore";
import type FirestoreWrapper from "./FirestoreWrapper";
import DocumentWrapper from "./DocumentWrapper";
import QueryWrapper from "./QueryWrapper";

/**
 * A typed wrapper class around Firestore
 * {@link FirebaseFirestore.CollectionReference `CollectionReference`} objects.
 *
 * Instances of this class are usually created automatically by calling
 * `.collection()` on a {@link FirestoreWrapper `FirestoreWrapper`} object.
 *
 * ```ts
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * const collectionWrapper = firestore.collection("path/to/collection");
 * ```
 *
 * It includes the same methods as the underlying `CollectionReference` object
 * with the same behavior so that it can be used interchangeably. It also
 * includes the following additional properties:
 *
 * Properties:
 * - {@link ref `ref`}
 */
class CollectionWrapper<
    Collection extends GenericFirestoreCollection,
    ConvertedType
  >
  extends QueryWrapper<Collection, ConvertedType>
  // The `CollectionReference` class exported by Firebase has a private
  // constructor, which makes it hard to subclass it since we can't create our
  // own instances of it. Instead, we just `implement` the class so TypeScript
  // makes sure we implement all the proper methods without actually extending
  // it. Some of the methods are not directly assignable to
  // `CollectionReference<ConvertedType>` though because the types are not
  // directly assignable to each other, so I had to use `any`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  implements FirebaseFirestore.CollectionReference<any>
{
  /** The raw Firebase `CollectionReference` instance. */
  public declare ref: FirebaseFirestore.CollectionReference<
    DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
  >;

  /**
   * Creates a typed `CollectionWrapper` object around the specified
   * `CollectionReference` object.
   *
   * @param ref The `CollectionReference` object to wrap.
   */
  constructor(
    ref: FirebaseFirestore.CollectionReference<
      ConvertedType | GenericDocumentSchema
    >
  ) {
    super(ref);
    this.ref = ref as FirebaseFirestore.CollectionReference<
      DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
    >;
  }

  /** The identifier of the collection. */
  get id(): string {
    return this.ref.id;
  }

  /**
   * A reference to the containing `DocumentWrapper` if this is a subcollection,
   * else null.
   *
   * The returned `DocumentWrapper` will be **untyped** since this
   * `CollectionWrapper` only knows about its own children's schemas.
   */
  get parent(): DocumentWrapper<GenericFirestoreDocument, never> | null {
    return this.ref.parent != null
      ? new DocumentWrapper(this.ref.parent)
      : null;
  }

  /**
   * A string representing the path of the referenced collection (relative to
   * the root of the database).
   */
  get path(): string {
    return this.ref.path;
  }

  /**
   * Retrieves the list of documents in this collection.
   *
   * The document references returned may include references to "missing
   * documents", i.e. document locations that have no document present but
   * which contain subcollections with documents. Attempting to read such a
   * document reference (e.g. via `.get()` or `.onSnapshot()`) will return a
   * `DocumentSnapshot` whose `.exists` property is false.
   *
   * @return The list of documents in this collection.
   */
  listDocuments(): Promise<
    DocumentWrapper<DocumentsIn<Collection>, ConvertedType>[]
  > {
    return this.ref
      .listDocuments()
      .then((docs) =>
        docs.map(
          (doc) =>
            new DocumentWrapper<DocumentsIn<Collection>, ConvertedType>(doc)
        )
      );
  }

  /**
   * Get a `DocumentWrapper` for a randomly-named document within this
   * collection. An automatically-generated unique ID will be used as the
   * document ID.
   *
   * The collection(s) referred to by this `CollectionWrapper` must have a
   * document schema for all `string` keys since a random string ID will be
   * generated. Otherwise, this function will return `never`.
   *
   * @example
   * ```ts
   * const documentWithNoSchema = new CollectionWrapper<{
   *   documentName: {
   *     [DOCUMENT_SCHEMA]: { ... }
   *   },
   *   anotherDocumentName: { ... }
   * }>( ... ).doc();
   * // Since the collection only has two documents (i.e., `"documentName"` and
   * // `"anotherDocumentName"`), `doc()` can't create a new document with a random
   * // ID, so it returns `never`.
   *
   * const documentWithValidSchema = new CollectionWrapper<{
   *   [documentName: string]: {
   *     [DOCUMENT_SCHEMA]: { ... }
   *   }
   * }>( ... ).doc();
   * // This collection supports documents of any name (because of the
   * // `[documentName: string]`), so `doc()` knows which schema to use, and it
   * // succeeds.
   * ```
   *
   * @return The `DocumentWrapper` instance.
   */
  // We have to tell prettier to ignore this section because it doesn't like
  // comments in between lines of more complex types like this :(
  // prettier-ignore
  doc(): (
    // For each collection in the `Collection` union...
    Collection extends GenericFirestoreCollection
      // ... make sure the Collection is indexable by `string` since this will
      // create a document with a random string. There needs to be a
      // corresponding document schema to assign the document to.
      ? string extends StrKeyof<Collection>
        // If it *is* indexable by `string`, return the DocumentWrapper for the
        // schema of the documents in this collection.
        ? DocumentWrapper<Collection[string], ConvertedType>
        // If it is *not* indexable by string, return `false` as a sentinel
        // value to indicate that not *all* collections are indexable by string.
        : false
      : never
  // Store that union of `DocumentWrapper<Document> | false` as `R`
  ) extends infer R
    // If any of the collections were not indexable by `string` (which we test
    // by checking if `false` is part of the union) ...
    ? false extends R
      // ... return `never` to prevent the developer from creating a document in
      // a collection that does not have as associated document schema.
      ? never
      // Otherwise, return the union of `DocumentWrapper<Document>` objects.
      : R
    : never;
  /**
   * Gets a `DocumentWrapper` instance that refers to the document with the
   * specified name.
   *
   * @param documentName The name of a document in the collection.
   * @return The `DocumentWrapper` instance.
   */
  doc<DocumentName extends StrKeyof<Collection>>(
    documentName: DocumentName
  ): Collection extends GenericFirestoreCollection
    ? // For each collection in `Collection`, make a `DocumentWrapper` around the
      // document indexed by this key.
      DocumentWrapper<Collection[DocumentName], ConvertedType>
    : never;
  doc(
    documentName?: string
  ):
    | DocumentWrapper<Collection[string], ConvertedType>
    | DocumentWrapper<GenericFirestoreDocument, ConvertedType> {
    return typeof documentName === "string"
      ? new DocumentWrapper<Collection[string], ConvertedType>(
          this.ref.doc(documentName)
        )
      : new DocumentWrapper<GenericFirestoreDocument, ConvertedType>(
          this.ref.doc()
        );
  }

  /**
   * Add a new document to this collection with the specified data, assigning it
   * a document ID automatically.
   *
   * The collection(s) referred to by this `CollectionWrapper` must have a
   * document schema for all `string` keys since a random string ID will be
   * generated. Otherwise, this function will return `never`.
   *
   * @example
   * ```ts
   * new CollectionWrapper<{
   *   documentName: {
   *     [DOCUMENT_SCHEMA]: { ... }
   *   },
   *   anotherDocumentName: { ... }
   * }>( ... ).add( ... );
   * // Since the collection only has two documents (i.e., `"documentName"` and
   * // `"anotherDocumentName"`), `add()` can't create a new document with a random
   * // ID, so `add()`'s parameter is `never`.
   *
   * const documentWithValidSchema = new CollectionWrapper<{
   *   [documentName: string]: {
   *     [DOCUMENT_SCHEMA]: {
   *       someDocumentSchemaKey: unknown;
   *       ...
   *     }
   *   }
   * }>( ... ).add({
   *   someDocumentSchemaKey: "some value"
   *   ...
   * });
   * // This collection supports documents of any name (because of the
   * // `[documentName: string]`), so `doc()` knows which schema to use, and it
   * // succeeds.
   * ```
   *
   * @param data An object containing the data for the new document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @return A Promise resolved with a `DocumentWrapper` pointing to the newly
   *        created document after it has been written to the backend.
   */
  add(
    // The types here are mostly copied over from `.doc()` (the overload with
    // no arguments) since it does almost the same thing: it creates a document
    // with a random string ID.
    data: (
      Collection extends GenericFirestoreCollection
        ? string extends StrKeyof<Collection>
          ? [
              DefaultIfNever<
                ConvertedType,
                SettableDocumentSchema<Collection[string]>
              >
            ]
          : false
        : never
    ) extends infer R
      ? false extends R
        ? never
        : FirebaseFirestore.WithFieldValue<
            Expand<UnionOfTuplesToIntersection<R>>
          >
      : never
  ): (
    Collection extends GenericFirestoreCollection
      ? string extends StrKeyof<Collection>
        ? DocumentWrapper<Collection[string], ConvertedType>
        : false
      : never
  ) extends infer R
    ? false extends R
      ? never
      : Promise<R>
    : never;
  add(
    data: DefaultIfNever<ConvertedType, GenericDocumentSchema>
  ): Promise<DocumentWrapper<Collection[string], ConvertedType>> {
    // Wrap the returned `DocumentReference` in a `DocumentWrapper` after the
    // Promise returns.
    return this.ref
      .add(data)
      .then(
        (ref) => new DocumentWrapper<Collection[string], ConvertedType>(ref)
      );
  }

  /**
   * Returns true if this `CollectionWrapper` is equal to the provided one.
   *
   * @param other The `CollectionWrapper` to compare against.
   * @return true if this `CollectionWrapper` is equal to the provided one.
   */
  isEqual(
    other: CollectionWrapper<GenericFirestoreCollection, ConvertedType>
  ): boolean;
  /**
   * Returns true if this `CollectionWrapper`'s `ref` is equal to the provided
   * `CollectionReference`.
   *
   * @param other The `CollectionReference` to compare against.
   * @return true if this `CollectionWrapper`'s `ref` is equal to the provided
   *        `CollectionReference`.
   */
  isEqual(
    other: FirebaseFirestore.CollectionReference<
      DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
    >
  ): boolean;
  isEqual(
    other:
      | CollectionWrapper<GenericFirestoreCollection, ConvertedType>
      | FirebaseFirestore.CollectionReference<
          DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
        >
  ): boolean;
  isEqual(
    other:
      | CollectionWrapper<GenericFirestoreCollection, ConvertedType>
      | FirebaseFirestore.CollectionReference<
          DefaultIfNever<ConvertedType, SchemaOfCollection<Collection>>
        >
  ): boolean {
    return other instanceof CollectionWrapper
      ? this.ref.isEqual(other.ref)
      : this.ref.isEqual(other);
  }

  /**
   * Applies a custom data converter to this `CollectionWrapper`, allowing you
   * to use your own custom model objects with Firestore. When you call `get()`
   * on the returned `CollectionWrapper`, the provided converter will convert
   * between Firestore data and your custom type `U`.
   *
   * @param converter Converts objects to and from Firestore. Passing in `null`
   *        removes the current converter.
   * @return A `CollectionWrapper<U>` that uses the provided converter.
   */
  withConverter<U>(
    converter: TypedFirestoreDataConverter<SchemaOfCollection<Collection>, U>
  ): CollectionWrapper<Collection, U>;
  /**
   * Applies a custom data converter to this `CollectionWrapper`, allowing you
   * to use your own custom model objects with Firestore. When you call `get()`
   * on the returned `CollectionWrapper`, the provided converter will convert
   * between Firestore data and your custom type `U`.
   *
   * @param converter Converts objects to and from Firestore. Passing in `null`
   *        removes the current converter.
   * @return A `CollectionWrapper<U>` that uses the provided converter.
   */
  withConverter(converter: null): CollectionWrapper<Collection, never>;
  withConverter<U>(
    converter: TypedFirestoreDataConverter<
      SchemaOfCollection<Collection>,
      U
    > | null
  ): CollectionWrapper<Collection, never> | CollectionWrapper<Collection, U>;
  withConverter<U>(
    converter: TypedFirestoreDataConverter<
      SchemaOfCollection<Collection>,
      U
    > | null
  ): CollectionWrapper<Collection, never> | CollectionWrapper<Collection, U> {
    return new CollectionWrapper(
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

export default CollectionWrapper;
