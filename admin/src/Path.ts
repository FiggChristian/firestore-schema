import type {
  CollectionGroup,
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
} from "firebase-admin/firestore";
import type {
  Expand,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  GenericFirestoreSchema,
  IndexByCollectionGroupID,
  IndexByPath,
  IsMalformedPath,
  JoinPathSegments,
  SchemaAtPath,
  StrKeyof,
} from "./types";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import CollectionGroupWrapper from "./CollectionGroupWrapper";

class Path<FirestoreSchema extends GenericFirestoreSchema> {
  /**
   * The Firestore object that was used to create the `Path`.
   */
  public firestore: FirebaseFirestore.Firestore;

  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
  }

  castToSchema<Path extends string>(
    value: DocumentData,
    optionalPath?: Path | undefined
  ): SchemaAtPath<FirestoreSchema, Path, true>;
  castToSchema<Path extends string>(
    value: Query,
    optionalPath?: Path | undefined
  ): Query<SchemaAtPath<FirestoreSchema, Path, true>>;
  castToSchema<Path extends string>(
    value: CollectionGroup,
    optionalPath?: Path | undefined
  ): CollectionGroup<SchemaAtPath<FirestoreSchema, Path, true>>;
  castToSchema<Path extends string>(
    value: CollectionReference,
    optionalPath?: Path | undefined
  ): CollectionReference<SchemaAtPath<FirestoreSchema, Path, true>>;
  castToSchema<Path extends string>(
    value: DocumentSnapshot,
    optionalPath?: Path | undefined
  ): DocumentSnapshot<SchemaAtPath<FirestoreSchema, Path, true>>;
  castToSchema<Path extends string>(
    value: DocumentReference,
    optionalPath?: Path | undefined
  ): DocumentReference<SchemaAtPath<FirestoreSchema, Path, true>>;
  castToSchema(value: unknown) {
    // This function is purely to tell TypeScript the type of the passed-in
    // value, but the value itself is not used. We can just return it as-is.
    return value;
  }

  /**
   * Gets a `CollectionWrapper` instance that refers to the collection at the
   * specified path.
   *
   * @example
   * ```ts
   * path.collection("users");
   * path.collection("users/userID/posts");
   * path.collection("users", "userID", "posts");
   * ```
   *
   * @param collectionPath A slash-separated path to a collection.
   * @return The `CollectionWrapper` instance.
   */
  collection<CollectionName extends StrKeyof<FirestoreSchema>>(
    collectionName: CollectionName
  ): CollectionWrapper<FirestoreSchema[CollectionName], never>;
  /**
   * Gets a `CollectionWrapper` instance that refers to the collection at the
   * specified path.
   *
   * @example
   * ```ts
   * path.collection("users");
   * path.collection("users/userID/posts");
   * path.collection("users", "userID", "posts");
   * ```
   *
   * @param collectionPath A slash-separated path to a collection.
   * @return The `CollectionWrapper` instance.
   */
  collection<Path extends string>(
    collectionPath: Path
  ): IndexByPath<FirestoreSchema, Path, false> extends infer R
    ? R extends GenericFirestoreCollection
      ? CollectionWrapper<R, never>
      : never
    : never;
  /**
   * Gets a `CollectionWrapper` instance that refers to the collection at the
   * specified path.
   *
   * @example
   * ```ts
   * path.collection("users");
   * path.collection("users/userID/posts");
   * path.collection("users", "userID", "posts");
   * ```
   *
   * @param pathSegments A list of path segments that index a specific
   *        collection.
   * @return The `CollectionWrapper` instance.
   */
  collection<PathSegments extends string[]>(
    ...pathSegments: PathSegments
  ): string[] extends PathSegments
    ? CollectionWrapper<GenericFirestoreCollection, never>
    : IsMalformedPath<PathSegments> extends true
    ? never
    : JoinPathSegments<PathSegments> extends infer R
    ? R extends string
      ? IndexByPath<FirestoreSchema, R, false> extends infer Q
        ? Q extends GenericFirestoreDocument
          ? never
          : Q extends GenericFirestoreCollection
          ? CollectionWrapper<Q, never>
          : never
        : never
      : never
    : never;
  collection(
    collectionPath: string,
    ...additionalSegments: string[]
  ):
    | CollectionWrapper<FirestoreSchema[string], never>
    | CollectionWrapper<GenericFirestoreCollection, never> {
    if (additionalSegments.length > 0) {
      let lastCollectionRef = this.firestore.collection(collectionPath);
      let lastDocRef: DocumentReference;
      for (let i = 0; i < additionalSegments.length; i++) {
        if (i % 2 === 0) {
          lastDocRef = lastCollectionRef.doc(additionalSegments[i]);
        } else {
          lastCollectionRef = lastDocRef!.collection(additionalSegments[i]);
        }
      }
      return new CollectionWrapper(lastCollectionRef);
    } else {
      return new CollectionWrapper(this.firestore.collection(collectionPath));
    }
  }

  /**
   * Gets a `DocumentWrapper` instance that refers to the document at the
   * specified path.
   *
   * @example
   * ```ts
   * path.doc("users/userID");
   * path.collection("users", "userID");
   * ```
   *
   * @param documentPath A slash-separated path to a document.
   * @return The `DocumentWrapper` instance.
   */
  doc<Path extends string>(
    docPath: Path
  ): IndexByPath<FirestoreSchema, Path, false> extends infer R
    ? R extends GenericFirestoreDocument
      ? DocumentWrapper<R, never>
      : never
    : never;
  /**
   * Gets a `DocumentWrapper` instance that refers to the document at the
   * specified path.
   *
   * @example
   * ```ts
   * path.doc("users", "userID");
   * path.doc("users/userID");
   * ```
   *
   * @param pathSegments A list of path segments that index a specific
   *        collection.
   * @return The `DocumentWrapper` instance.
   */
  doc<PathSegments extends string[]>(
    ...pathSegments: PathSegments
  ): string[] extends PathSegments
    ? DocumentWrapper<GenericFirestoreDocument, never>
    : IsMalformedPath<PathSegments> extends true
    ? never
    : JoinPathSegments<PathSegments> extends infer R
    ? R extends string
      ? IndexByPath<FirestoreSchema, R, false> extends infer Q
        ? Q extends GenericFirestoreDocument
          ? DocumentWrapper<Q, never>
          : never
        : never
      : never
    : never;
  doc(
    docPath: string,
    ...additionalSegments: string[]
  ): DocumentWrapper<GenericFirestoreDocument, never> {
    if (additionalSegments.length > 0) {
      let lastCollectionRef = this.firestore.collection(docPath);
      let lastDocRef: DocumentReference;
      for (let i = 0; i < additionalSegments.length; i++) {
        if (i % 2 === 0) {
          lastDocRef = lastCollectionRef.doc(additionalSegments[i]);
        } else {
          lastCollectionRef = lastDocRef!.collection(additionalSegments[i]);
        }
      }
      return new DocumentWrapper(lastDocRef!);
    } else {
      return new DocumentWrapper(this.firestore.doc(docPath));
    }
  }

  /**
   * Creates and returns a new `QueryWrapper` that includes all documents in the
   * database that are contained in a collection or subcollection with the given
   * `collectionId`.
   *
   * @param collectionId Identifies the collections to query over. Every
   *        collection or subcollection with this ID as the last segment of its
   *        path will be included. Cannot contain a slash.
   * @return The created `CollectionGroup`.
   */
  collectionGroup<CollectionName extends string>(
    collectionId: CollectionName
  ): IsMalformedPath<[CollectionName]> extends true
    ? never
    : [IndexByCollectionGroupID<FirestoreSchema, CollectionName>] extends [
        infer R
      ]
    ? [R] extends [GenericFirestoreCollection]
      ? CollectionGroupWrapper<Expand<R>, never>
      : never
    : never;
  collectionGroup(
    collectionId: string
  ): CollectionGroupWrapper<GenericFirestoreCollection, never> {
    return new CollectionGroupWrapper(
      this.firestore.collectionGroup(collectionId)
    );
  }
}

export default Path;
