import type {
  Expand,
  GenericDocumentSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  SchemaOfCollection,
  StrKeyof,
  UnionOfTuplesToIntersection,
} from "@firestore-schema/core";
import type { SetData, SettableDocumentSchema } from "./types";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
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
class CollectionWrapper<Collection extends GenericFirestoreCollection>
  extends QueryWrapper<Collection>
  // The `CollectionReference` class exported by Firebase has a private
  // constructor, which makes it hard to subclass it since we can't create our
  // own instances of it. Instead, we just `implement` the class so TypeScript
  // makes sure we implement all the proper methods without actually extending
  // it. Some of the methods are not directly assignable to
  // `CollectionReference<ConvertedType>` though because the types are not
  // directly assignable to each other, so I had to use `any`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  implements FirebaseFirestoreTypes.CollectionReference<any>
{
  /** The raw Firebase `CollectionReference` instance. */
  public declare ref: FirebaseFirestoreTypes.CollectionReference<
    SchemaOfCollection<Collection>
  >;

  /**
   * Creates a typed `CollectionWrapper` object around the specified
   * `CollectionReference` object.
   *
   * @param ref The `CollectionReference` object to wrap.
   */
  constructor(
    ref: FirebaseFirestoreTypes.CollectionReference<GenericDocumentSchema>
  ) {
    super(ref);
    this.ref = ref;
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
  get parent(): DocumentWrapper<GenericFirestoreDocument> | null {
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
   * @param data An Object containing the data for the new document.
   * @returns A Promise resolved with a `DocumentWrapper` pointing to the newly
   * created document after it has been written to the backend.
   */
  add(
    data: (
      Collection extends GenericFirestoreCollection
        ? string extends StrKeyof<Collection>
          ? [SetData<SettableDocumentSchema<Collection[string]>>]
          : false
        : never
    ) extends infer R
      ? false extends R
        ? never
        : Expand<UnionOfTuplesToIntersection<R>>
      : never
  ): (
    Collection extends GenericFirestoreCollection
      ? string extends StrKeyof<Collection>
        ? DocumentWrapper<Collection[string]>
        : false
      : never
  ) extends infer R
    ? false extends R
      ? never
      : Promise<R>
    : never;
  add(
    data: GenericDocumentSchema
  ): Promise<DocumentWrapper<Collection[string]>> {
    // Wrap the returned `DocumentReference` in a `DocumentWrapper` after the
    // Promise returns.
    return this.ref
      .add(data)
      .then((ref) => new DocumentWrapper<Collection[string]>(ref));
  }

  /**
   * Gets a `DocumentWrapper` instance that refers to the document with the
   * specified name.
   *
   * @param documentName The name of a document in the collection.
   * @returns The `DocumentWrapper` instance.
   */
  doc<DocumentName extends StrKeyof<Collection>>(
    documentName: DocumentName
  ): Collection extends GenericFirestoreCollection
    ? // For each collection in `Collection`, make a `DocumentWrapper` around the
      // document indexed by this key.
      DocumentWrapper<Collection[DocumentName]>
    : never;
  /**
   * Get a `DocumentWrapper` for the document within the collection at the specified path. If no
   * path is specified, an automatically-generated unique ID will be used for the returned
   * `DocumentWrapper`.
   *
   * The collection(s) referred to by this `CollectionWrapper` must have a
   * document schema for all `string` keys since a random string ID will be
   * generated. Otherwise, this function will return `never`.
   *
   * @example
   *
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
   * @param documentPath The name of a document in the collection, or
   * `undefined` to automatically generate a unique ID.
   * @returns The `DocumentWrapper` instance.
   */
  doc(
    documentPath?: string
  ): // The types here are mostly copied over from `.add()`since it does almost
  // the same thing: it creates a document with a random string ID.
  (
    Collection extends GenericFirestoreCollection
      ? string extends StrKeyof<Collection>
        ? DocumentWrapper<Collection[string]>
        : false
      : never
  ) extends infer R
    ? false extends R
      ? never
      : R
    : never;
  doc(documentPath?: string): DocumentWrapper<GenericFirestoreDocument> {
    if (documentPath === undefined) {
      // Call overload with 0 arguments.
      return new DocumentWrapper(this.ref.doc());
    } else {
      // Call overload with 1 argument.
      return new DocumentWrapper(this.ref.doc(documentPath));
    }
  }
}

export default CollectionWrapper;
