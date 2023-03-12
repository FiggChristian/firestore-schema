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

  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value (i.e., `castToSchema<"path/to/document">(value)`) or as a JavaScript
   * string value (i.e., `castToSchema(value, "path/to/collection")`).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * @example
   * ```ts
   * type Schema = {
   *   users: {
   *     [uid: string]: {
   *       [DOCUMENT_SCHEMA]: UserDataType;
   *     }
   *   },
   *   posts: {
   *     specificPostID: {
   *       [DOCUMENT_SCHEMA]: SomePostDataType;
   *     }
   *   }
   * }
   * const path = withSchema<Schema>(firestore);
   *
   * ( ... ).get(documentSnapshot => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = path.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and should be narrowed if necessary.
   *   const dataAsUserOrPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "{any collection}/specificPostID"
   *   );
   * });
   * ```
   *
   * @param value The object to cast to the specified schema.
   * @param optionalPath A path to the collection or document from the root of
   *        the database whose schema will be used for casting the value.
   * @returns The passed-in `value`, cast to the specified schema.
   */
  castToSchema<Path extends string>(
    value: DocumentData,
    optionalPath?: Path | undefined
  ): SchemaAtPath<FirestoreSchema, Path, true>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value (i.e., `castToSchema<"path/to/document">(value)`) or as a JavaScript
   * string value (i.e., `castToSchema(value, "path/to/collection")`).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * @example
   * ```ts
   * type Schema = {
   *   users: {
   *     [uid: string]: {
   *       [DOCUMENT_SCHEMA]: UserDataType;
   *     }
   *   },
   *   posts: {
   *     specificPostID: {
   *       [DOCUMENT_SCHEMA]: SomePostDataType;
   *     }
   *   }
   * }
   * const path = withSchema<Schema>(firestore);
   *
   * ( ... ).get(documentSnapshot => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = path.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and should be narrowed if necessary.
   *   const dataAsUserOrPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "{any collection}/specificPostID"
   *   );
   * });
   * ```
   *
   * @param value The object to cast to the specified schema.
   * @param optionalPath A path to the collection or document from the root of
   *        the database whose schema will be used for casting the value.
   * @returns The passed-in `value`, cast to the specified schema.
   */
  castToSchema<Path extends string>(
    value: DocumentData | undefined,
    optionalPath?: Path | undefined
  ): SchemaAtPath<FirestoreSchema, Path, true> | undefined;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value (i.e., `castToSchema<"path/to/document">(value)`) or as a JavaScript
   * string value (i.e., `castToSchema(value, "path/to/collection")`).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * @example
   * ```ts
   * type Schema = {
   *   users: {
   *     [uid: string]: {
   *       [DOCUMENT_SCHEMA]: UserDataType;
   *     }
   *   },
   *   posts: {
   *     specificPostID: {
   *       [DOCUMENT_SCHEMA]: SomePostDataType;
   *     }
   *   }
   * }
   * const path = withSchema<Schema>(firestore);
   *
   * ( ... ).get(documentSnapshot => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = path.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and should be narrowed if necessary.
   *   const dataAsUserOrPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "{any collection}/specificPostID"
   *   );
   * });
   * ```
   *
   * @param value The object to cast to the specified schema.
   * @param optionalPath A path to the collection or document from the root of
   *        the database whose schema will be used for casting the value.
   * @returns The passed-in `value`, cast to the specified schema.
   */
  castToSchema<Path extends string>(
    value: Query,
    optionalPath?: Path | undefined
  ): Query<SchemaAtPath<FirestoreSchema, Path, true>>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value (i.e., `castToSchema<"path/to/document">(value)`) or as a JavaScript
   * string value (i.e., `castToSchema(value, "path/to/collection")`).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * @example
   * ```ts
   * type Schema = {
   *   users: {
   *     [uid: string]: {
   *       [DOCUMENT_SCHEMA]: UserDataType;
   *     }
   *   },
   *   posts: {
   *     specificPostID: {
   *       [DOCUMENT_SCHEMA]: SomePostDataType;
   *     }
   *   }
   * }
   * const path = withSchema<Schema>(firestore);
   *
   * ( ... ).get(documentSnapshot => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = path.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and should be narrowed if necessary.
   *   const dataAsUserOrPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "{any collection}/specificPostID"
   *   );
   * });
   * ```
   *
   * @param value The object to cast to the specified schema.
   * @param optionalPath A path to the collection or document from the root of
   *        the database whose schema will be used for casting the value.
   * @returns The passed-in `value`, cast to the specified schema.
   */
  castToSchema<Path extends string>(
    value: CollectionGroup,
    optionalPath?: Path | undefined
  ): CollectionGroup<SchemaAtPath<FirestoreSchema, Path, true>>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value (i.e., `castToSchema<"path/to/document">(value)`) or as a JavaScript
   * string value (i.e., `castToSchema(value, "path/to/collection")`).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * @example
   * ```ts
   * type Schema = {
   *   users: {
   *     [uid: string]: {
   *       [DOCUMENT_SCHEMA]: UserDataType;
   *     }
   *   },
   *   posts: {
   *     specificPostID: {
   *       [DOCUMENT_SCHEMA]: SomePostDataType;
   *     }
   *   }
   * }
   * const path = withSchema<Schema>(firestore);
   *
   * ( ... ).get(documentSnapshot => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = path.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and should be narrowed if necessary.
   *   const dataAsUserOrPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "{any collection}/specificPostID"
   *   );
   * });
   * ```
   *
   * @param value The object to cast to the specified schema.
   * @param optionalPath A path to the collection or document from the root of
   *        the database whose schema will be used for casting the value.
   * @returns The passed-in `value`, cast to the specified schema.
   */
  castToSchema<Path extends string>(
    value: CollectionReference,
    optionalPath?: Path | undefined
  ): CollectionReference<SchemaAtPath<FirestoreSchema, Path, true>>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value (i.e., `castToSchema<"path/to/document">(value)`) or as a JavaScript
   * string value (i.e., `castToSchema(value, "path/to/collection")`).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * @example
   * ```ts
   * type Schema = {
   *   users: {
   *     [uid: string]: {
   *       [DOCUMENT_SCHEMA]: UserDataType;
   *     }
   *   },
   *   posts: {
   *     specificPostID: {
   *       [DOCUMENT_SCHEMA]: SomePostDataType;
   *     }
   *   }
   * }
   * const path = withSchema<Schema>(firestore);
   *
   * ( ... ).get(documentSnapshot => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = path.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and should be narrowed if necessary.
   *   const dataAsUserOrPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "{any collection}/specificPostID"
   *   );
   * });
   * ```
   *
   * @param value The object to cast to the specified schema.
   * @param optionalPath A path to the collection or document from the root of
   *        the database whose schema will be used for casting the value.
   * @returns The passed-in `value`, cast to the specified schema.
   */
  castToSchema<Path extends string>(
    value: DocumentSnapshot,
    optionalPath?: Path | undefined
  ): DocumentSnapshot<SchemaAtPath<FirestoreSchema, Path, true>>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value (i.e., `castToSchema<"path/to/document">(value)`) or as a JavaScript
   * string value (i.e., `castToSchema(value, "path/to/collection")`).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * @example
   * ```ts
   * type Schema = {
   *   users: {
   *     [uid: string]: {
   *       [DOCUMENT_SCHEMA]: UserDataType;
   *     }
   *   },
   *   posts: {
   *     specificPostID: {
   *       [DOCUMENT_SCHEMA]: SomePostDataType;
   *     }
   *   }
   * }
   * const path = withSchema<Schema>(firestore);
   *
   * ( ... ).get(documentSnapshot => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = path.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and should be narrowed if necessary.
   *   const dataAsUserOrPost = path.castToSchema(
   *     documentSnapshot.data(),
   *     "{any collection}/specificPostID"
   *   );
   * });
   * ```
   *
   * @param value The object to cast to the specified schema.
   * @param optionalPath A path to the collection or document from the root of
   *        the database whose schema will be used for casting the value.
   * @returns The passed-in `value`, cast to the specified schema.
   */
  castToSchema<Path extends string>(
    value: DocumentReference,
    optionalPath?: Path | undefined
  ): DocumentReference<SchemaAtPath<FirestoreSchema, Path, true>>;
  castToSchema(value: unknown): unknown {
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
   * @throws {TypeError} If the number of path segments is even (which would
   *        correspond to a document instead of a collection).
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
      if (additionalSegments.length % 2 === 1) {
        // The total number of path segments (counting `collectionPath`) is
        // even. For a collection, the number of path segments must be odd.
        throw new TypeError("Number of segments for a collection must be odd.");
      }
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
   * @throws {TypeError} If the number of path segments is odd (which would
   *        correspond to a collection instead of a document).
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
      if (additionalSegments.length % 2 === 0) {
        // The total number of path segments (counting `docPath`) is odd. For a
        // document, the number of path segments must be even.
        throw new TypeError("Number of segments for a document must be even.");
      }
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
