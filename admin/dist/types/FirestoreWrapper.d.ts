import type FirebaseFirestore from "@google-cloud/firestore";
import type { Expand, GenericDocumentSchema, GenericFirestoreCollection, GenericFirestoreDocument, GenericFirestoreSchema, IndexByCollectionGroupID, IndexByPath, IsMalformedPath, JoinPathSegments, SchemaAtPath, StrKeyof } from "@firestore-schema/core";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import CollectionGroupWrapper from "./CollectionGroupWrapper";
declare class FirestoreWrapper<FirestoreSchema extends GenericFirestoreSchema> {
    /** The Firestore object that was used to create the `FirestoreWrapper`. */
    firestore: FirebaseFirestore.Firestore;
    /**
     * Creates a typed `FirestoreWrapper` object around the specified `Firestore`
     * object.
     *
     * @param firestore The `Firestore` object to wrap.
     */
    constructor(firestore: FirebaseFirestore.Firestore);
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
    castToSchema<Path extends string>(value: GenericDocumentSchema, optionalPath?: Path | undefined): SchemaAtPath<FirestoreSchema, Path, true>;
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
    castToSchema<Path extends string>(value: GenericDocumentSchema | undefined, optionalPath?: Path | undefined): SchemaAtPath<FirestoreSchema, Path, true> | undefined;
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
    castToSchema<Path extends string>(value: FirebaseFirestore.Query, optionalPath?: Path | undefined): FirebaseFirestore.Query<SchemaAtPath<FirestoreSchema, Path, true>>;
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
    castToSchema<Path extends string>(value: FirebaseFirestore.CollectionGroup, optionalPath?: Path | undefined): FirebaseFirestore.CollectionGroup<SchemaAtPath<FirestoreSchema, Path, true>>;
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
    castToSchema<Path extends string>(value: FirebaseFirestore.CollectionReference, optionalPath?: Path | undefined): FirebaseFirestore.CollectionReference<SchemaAtPath<FirestoreSchema, Path, true>>;
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
    castToSchema<Path extends string>(value: FirebaseFirestore.DocumentSnapshot, optionalPath?: Path | undefined): FirebaseFirestore.DocumentSnapshot<SchemaAtPath<FirestoreSchema, Path, true>>;
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
    castToSchema<Path extends string>(value: FirebaseFirestore.DocumentReference, optionalPath?: Path | undefined): FirebaseFirestore.DocumentReference<SchemaAtPath<FirestoreSchema, Path, true>>;
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
    collection<CollectionName extends StrKeyof<FirestoreSchema>>(collectionName: CollectionName): CollectionWrapper<FirestoreSchema[CollectionName], never>;
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
    collection<Path extends string>(collectionPath: Path): IndexByPath<FirestoreSchema, Path, false> extends infer R ? R extends GenericFirestoreCollection ? CollectionWrapper<R, never> : never : never;
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
    collection<PathSegments extends string[]>(...pathSegments: PathSegments): string[] extends PathSegments ? CollectionWrapper<GenericFirestoreCollection, never> : IsMalformedPath<PathSegments> extends true ? never : JoinPathSegments<PathSegments> extends infer R ? R extends string ? IndexByPath<FirestoreSchema, R, false> extends infer Q ? Q extends GenericFirestoreDocument ? never : Q extends GenericFirestoreCollection ? CollectionWrapper<Q, never> : never : never : never : never;
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
    doc<Path extends string>(docPath: Path): IndexByPath<FirestoreSchema, Path, false> extends infer R ? R extends GenericFirestoreDocument ? DocumentWrapper<R, never> : never : never;
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
    doc<PathSegments extends string[]>(...pathSegments: PathSegments): string[] extends PathSegments ? DocumentWrapper<GenericFirestoreDocument, never> : IsMalformedPath<PathSegments> extends true ? never : JoinPathSegments<PathSegments> extends infer R ? R extends string ? IndexByPath<FirestoreSchema, R, false> extends infer Q ? Q extends GenericFirestoreDocument ? DocumentWrapper<Q, never> : never : never : never : never;
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
    collectionGroup<CollectionName extends string>(collectionId: CollectionName): IsMalformedPath<[CollectionName]> extends true ? never : [IndexByCollectionGroupID<FirestoreSchema, CollectionName>] extends [
        infer R
    ] ? [R] extends [GenericFirestoreCollection] ? CollectionGroupWrapper<Expand<R>, never> : never : never;
}
export default FirestoreWrapper;
