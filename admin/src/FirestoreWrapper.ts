import FirebaseFirestore from "@google-cloud/firestore";
import {
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
} from "@firestore-schema/core";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import CollectionGroupWrapper from "./CollectionGroupWrapper";
import type { ReadOnlyTransactionWrapper } from "./TransactionWrapper";
import { ReadWriteTransactionWrapper } from "./TransactionWrapper";
import WriteBatchWrapper from "./WriteBatchWrapper";
import QueryWrapper from "./QueryWrapper";
import { SettableFirestoreDataType } from "./types";

/**
 * A typed wrapper class around your
 * {@link FirebaseFirestore.Firestore `Firestore`} instance.
 *
 * This class can be instantiated manually via its constructor, or using the
 * `withSchema` function.
 *
 * ```ts
 * type Schema = {
 *   // Define your Firestore schema here
 * }
 *
 * const firestore = new FirestoreWrapper<Schema>(unwrappedFirestore);
 * // or
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * ```
 *
 * It includes the same methods as the underlying `Firestore` object with the
 * same behavior so that it can be used interchangeably. It also includes the
 * following additional properties and methods:
 *
 * Properties:
 * - {@link firestore `firestore`}
 *
 * Methods:
 * - {@link castToSchema `castToSchema`}
 */
class FirestoreWrapper<FirestoreSchema extends GenericFirestoreSchema>
  implements FirebaseFirestore.Firestore
{
  /** The Firestore object that was used to create the `FirestoreWrapper`. */
  public firestore: FirebaseFirestore.Firestore;

  /**
   * Creates a typed `FirestoreWrapper` object around the specified `Firestore`
   * object.
   *
   * @param firestore The `Firestore` object to wrap.
   */
  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
  }

  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: FirebaseFirestore.DocumentSnapshot,
    optionalPath?: Path | undefined
  ): FirebaseFirestore.DocumentSnapshot<
    SchemaAtPath<FirestoreSchema, Path, true>
  >;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: DocumentWrapper<GenericFirestoreDocument, unknown>,
    optionalPath?: Path | undefined
  ): DocumentWrapper<SchemaAtPath<FirestoreSchema, Path, true>, never>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: FirebaseFirestore.DocumentReference,
    optionalPath?: Path | undefined
  ): FirebaseFirestore.DocumentReference<
    SchemaAtPath<FirestoreSchema, Path, true>
  >;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: CollectionWrapper<GenericFirestoreCollection, unknown>,
    optionalPath?: Path | undefined
  ): CollectionWrapper<SchemaAtPath<FirestoreSchema, Path, true>, never>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: FirebaseFirestore.CollectionReference,
    optionalPath?: Path | undefined
  ): FirebaseFirestore.CollectionReference<
    SchemaAtPath<FirestoreSchema, Path, true>
  >;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: CollectionGroupWrapper<GenericFirestoreCollection, unknown>,
    optionalPath?: Path | undefined
  ): CollectionGroupWrapper<SchemaAtPath<FirestoreSchema, Path, true>, never>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: FirebaseFirestore.CollectionGroup,
    optionalPath?: Path | undefined
  ): FirebaseFirestore.CollectionGroup<
    SchemaAtPath<FirestoreSchema, Path, true>
  >;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: QueryWrapper<GenericFirestoreCollection, unknown>,
    optionalPath?: Path | undefined
  ): QueryWrapper<SchemaAtPath<FirestoreSchema, Path, true>, never>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: FirebaseFirestore.Query,
    optionalPath?: Path | undefined
  ): FirebaseFirestore.Query<SchemaAtPath<FirestoreSchema, Path, true>>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: { [key: string]: SettableFirestoreDataType },
    optionalPath?: Path | undefined
  ): SchemaAtPath<FirestoreSchema, Path, true>;
  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
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
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
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
    value: { [key: string]: SettableFirestoreDataType } | undefined,
    optionalPath?: Path | undefined
  ): SchemaAtPath<FirestoreSchema, Path, true> | undefined;
  castToSchema(value: unknown): unknown {
    // Remove any `withConverter`s that have been applied to this object since
    // the returned object will be case to the specified schema, not to whatever
    // the previous converter was.
    if (
      typeof value === "object" &&
      value != null &&
      "withConverter" in value &&
      typeof value.withConverter === "function"
    ) {
      value.withConverter(null);
    }

    // Nothing else special happens to the object; it's just cast for
    // TypeScript's sake.
    return value;
  }

  /**
   * Specifies custom settings to be used to configure the `Firestore` instance.
   * Can only be invoked once and before any other Firestore method.
   *
   * If settings are provided via both `settings()` and the `Firestore`
   * constructor, both settings objects are merged and any settings provided via
   * `settings()` take precedence.
   *
   * @param settings The settings to use for all Firestore operations.
   */
  settings(settings: FirebaseFirestore.Settings): void {
    return this.firestore.settings(settings);
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
      let lastDocRef: FirebaseFirestore.DocumentReference;
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
      let lastDocRef: FirebaseFirestore.DocumentReference;
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

  /**
   * Retrieves multiple documents from Firestore.
   *
   * The first argument is required and must be of type `DocumentReference` /
   * `DocumentWrapper` followed by any additional `DocumentReference` /
   * `DocumentWrapper` documents. If used, the optional `ReadOptions` must be
   * the last argument.
   *
   * @param documentRefsOrReadOptions The `DocumentReference`s /
   *        `DocumentWrapper`s to receive, followed by an optional field mask.
   * @returns A Promise that resolves with an array of resulting document
   *        snapshots.
   */
  // This is (one of) the most type-safe overload for getAll; it has a generic
  // that keeps track of the individual documents that get passed to the
  // function as a tuple so that the return Promise can be mapped to the proper
  // document schemas. This overload does not include a ReadOptions argument
  // since including it as an optional in the tuple (i.e., [...M, ReadOptions?])
  // seems to not let TypesScript choose this overload when it can for some
  // reason, so a second overload is included below that has the ReadOptions.
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
   * Retrieves multiple documents from Firestore.
   *
   * The first argument is required and must be of type `DocumentReference` /
   * `DocumentWrapper` followed by any additional `DocumentReference` /
   * `DocumentWrapper` documents. If used, the optional `ReadOptions` must be
   * the last argument.
   *
   * @param documentRefsOrReadOptions The `DocumentReference`s /
   *        `DocumentWrapper`s to receive, followed by an optional field mask.
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
   * Retrieves multiple documents from Firestore.
   *
   * The first argument is required and must be of type `DocumentReference` /
   * `DocumentWrapper` followed by any additional `DocumentReference` /
   * `DocumentWrapper` documents. If used, the optional `ReadOptions` must be
   * the last argument.
   *
   * @param documentRefsOrReadOptions The `DocumentReference`s /
   *        `DocumentWrapper`s to receive, followed by an optional field mask.
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
    return this.firestore.getAll(...unwrappedArgs);
  }

  /**
   * Recursively deletes all documents and subcollections at and under the
   * specified level.
   *
   * If any delete fails, the promise is rejected with an error message
   * containing the number of failed deletes and the stack trace of the last
   * failed delete. The provided reference is deleted regardless of whether
   * all deletes succeeded.
   *
   * `recursiveDelete()` uses a BulkWriter instance with default settings to
   * perform the deletes. To customize throttling rates or add success/error
   * callbacks, pass in a custom BulkWriter instance.
   *
   * @param ref The reference of a document or collection to delete.
   * @param bulkWriter A custom BulkWriter instance used to perform the
   *        deletes.
   * @return A promise that resolves when all deletes have been performed.
   *        The promise is rejected if any of the deletes fail.
   *
   * @example
   * // Recursively delete a reference and log the references of failures.
   * const bulkWriter = firestore.bulkWriter();
   * bulkWriter
   *   .onWriteError((error) => {
   *     if (
   *       error.failedAttempts < MAX_RETRY_ATTEMPTS
   *     ) {
   *       return true;
   *     } else {
   *       console.log('Failed write at document: ', error.documentRef.path);
   *       return false;
   *     }
   *   });
   * await firestore.recursiveDelete(docRef, bulkWriter);
   */
  recursiveDelete(
    ref:
      | CollectionWrapper<GenericFirestoreCollection, unknown>
      | DocumentWrapper<GenericFirestoreDocument, unknown>
      | FirebaseFirestore.CollectionReference<unknown>
      | FirebaseFirestore.DocumentReference<unknown>,
    bulkWriter?: FirebaseFirestore.BulkWriter
  ): Promise<void> {
    return this.firestore.recursiveDelete(
      ref instanceof CollectionWrapper || ref instanceof DocumentWrapper
        ? ref.ref
        : ref,
      bulkWriter
    );
  }

  /**
   * Terminates the Firestore client and closes all open streams.
   *
   * @return A Promise that resolves when the client is terminated.
   */
  terminate(): Promise<void> {
    return this.firestore.terminate();
  }

  /**
   * Fetches the root collections that are associated with this Firestore
   * database.
   *
   * @returns A Promise that resolves with an array of `CollectionWrapper`s.
   */
  listCollections(): Promise<
    CollectionWrapper<FirestoreSchema[string], never>[]
  > {
    return this.firestore
      .listCollections()
      .then((collections) =>
        collections.map(
          (collection) =>
            new CollectionWrapper<FirestoreSchema[string], never>(collection)
        )
      );
  }

  /**
   * Executes the given `updateFunction` and commits the changes applied within
   * the transaction.
   *
   * You can use the transaction object passed to `updateFunction` to read and
   * modify Firestore documents under lock. You have to perform all reads before
   * you perform any write.
   *
   * Transactions can be performed as read-only or read-write transactions. By
   * default, transactions are executed in read-write mode.
   *
   * A read-write transaction obtains a pessimistic lock on all documents that
   * are read during the transaction. These locks block other transactions,
   * batched writes, and other non-transactional writes from changing that
   * document. Any writes in a read-write transactions are committed once
   * `updateFunction` resolves, which also releases all locks.
   *
   * If a read-write transaction fails with contention, the transaction is
   * retried up to five times. The `updateFunction` is invoked once for each
   * attempt.
   *
   * Read-only transactions do not lock documents. They can be used to read
   * documents at a consistent snapshot in time, which may be up to 60 seconds
   * in the past. Read-only transactions are not retried.
   *
   * Transactions time out after 60 seconds if no documents are read.
   * Transactions that are not committed within than 270 seconds are also
   * aborted. Any remaining locks are released when a transaction times out.
   *
   * @param updateFunction The function to execute within the transaction
   *        context.
   * @param transactionOptions Transaction options.
   * @return If the transaction completed successfully or was explicitly aborted
   *        (by the `updateFunction` returning a failed Promise), the Promise
   *        returned by the `updateFunction` will be returned here. Else if the
   *        transaction failed, a rejected Promise with the corresponding
   *        failure error will be returned.
   */
  // This overload passes a `ReadWriteTransactionWrapper` object to the
  // `updateFunction` because the user needs to specify `readOnly: true`
  // explicitly to get a `ReadOnlyTransactionWrapper`.
  runTransaction<T>(
    updateFunction: (transaction: ReadWriteTransactionWrapper) => Promise<T>,
    transactionOptions?: FirebaseFirestore.ReadWriteTransactionOptions
  ): Promise<T>;
  /**
   * Executes the given `updateFunction` and commits the changes applied within
   * the transaction.
   *
   * You can use the transaction object passed to `updateFunction` to read and
   * modify Firestore documents under lock. You have to perform all reads before
   * you perform any write.
   *
   * Transactions can be performed as read-only or read-write transactions. By
   * default, transactions are executed in read-write mode.
   *
   * A read-write transaction obtains a pessimistic lock on all documents that
   * are read during the transaction. These locks block other transactions,
   * batched writes, and other non-transactional writes from changing that
   * document. Any writes in a read-write transactions are committed once
   * `updateFunction` resolves, which also releases all locks.
   *
   * If a read-write transaction fails with contention, the transaction is
   * retried up to five times. The `updateFunction` is invoked once for each
   * attempt.
   *
   * Read-only transactions do not lock documents. They can be used to read
   * documents at a consistent snapshot in time, which may be up to 60 seconds
   * in the past. Read-only transactions are not retried.
   *
   * Transactions time out after 60 seconds if no documents are read.
   * Transactions that are not committed within than 270 seconds are also
   * aborted. Any remaining locks are released when a transaction times out.
   *
   * @param updateFunction The function to execute within the transaction
   *        context.
   * @param transactionOptions Transaction options.
   * @return If the transaction completed successfully or was explicitly aborted
   *        (by the `updateFunction` returning a failed Promise), the Promise
   *        returned by the `updateFunction` will be returned here. Else if the
   *        transaction failed, a rejected Promise with the corresponding
   *        failure error will be returned.
   */
  // This overload passes a `ReadOnlyTransactionWrapper` object to the
  // `updateFunction` because the user specified `readOnly: true`. In reality,
  // since `ReadWriteTransactionWrapper` extends `ReadOnlyTransactionWrapper`, a
  // `ReadWriteTransactionWrapper` gets passed, but according to TypeScript, the
  // read-write methods are missing from the object, preventing the user from
  // using them.
  runTransaction<T>(
    updateFunction: (transaction: ReadOnlyTransactionWrapper) => Promise<T>,
    transactionOptions: FirebaseFirestore.ReadOnlyTransactionOptions
  ): Promise<T>;
  /**
   * Executes the given `updateFunction` and commits the changes applied within
   * the transaction.
   *
   * You can use the transaction object passed to `updateFunction` to read and
   * modify Firestore documents under lock. You have to perform all reads before
   * you perform any write.
   *
   * Transactions can be performed as read-only or read-write transactions. By
   * default, transactions are executed in read-write mode.
   *
   * A read-write transaction obtains a pessimistic lock on all documents that
   * are read during the transaction. These locks block other transactions,
   * batched writes, and other non-transactional writes from changing that
   * document. Any writes in a read-write transactions are committed once
   * `updateFunction` resolves, which also releases all locks.
   *
   * If a read-write transaction fails with contention, the transaction is
   * retried up to five times. The `updateFunction` is invoked once for each
   * attempt.
   *
   * Read-only transactions do not lock documents. They can be used to read
   * documents at a consistent snapshot in time, which may be up to 60 seconds
   * in the past. Read-only transactions are not retried.
   *
   * Transactions time out after 60 seconds if no documents are read.
   * Transactions that are not committed within than 270 seconds are also
   * aborted. Any remaining locks are released when a transaction times out.
   *
   * @param updateFunction The function to execute within the transaction
   *        context.
   * @param transactionOptions Transaction options.
   * @return If the transaction completed successfully or was explicitly aborted
   *        (by the `updateFunction` returning a failed Promise), the Promise
   *        returned by the `updateFunction` will be returned here. Else if the
   *        transaction failed, a rejected Promise with the corresponding
   *        failure error will be returned.
   */
  // This overload is the case for when TypeScript can't determine whether this
  // is a read-only transaction or not, so the function gets passed a read-write
  // transaction object, which has all the functionality of a read-only
  // transaction anyway. It's up to the function that actually gets passed in to
  // use or not use those writing methods.
  runTransaction<T>(
    updateFunction: (transaction: ReadWriteTransactionWrapper) => Promise<T>,
    transactionOptions?:
      | FirebaseFirestore.ReadWriteTransactionOptions
      | FirebaseFirestore.ReadOnlyTransactionOptions
  ): Promise<T>;
  runTransaction<T>(
    updateFunction: (transaction: ReadWriteTransactionWrapper) => Promise<T>,
    transactionOptions?:
      | FirebaseFirestore.ReadWriteTransactionOptions
      | FirebaseFirestore.ReadOnlyTransactionOptions
  ): Promise<T> {
    return this.firestore.runTransaction(
      (transaction) =>
        updateFunction(new ReadWriteTransactionWrapper(transaction)),
      transactionOptions
    );
  }

  /**
   * Creates a write batch, used for performing multiple writes as a single
   * atomic operation.
   */
  batch(): WriteBatchWrapper {
    return new WriteBatchWrapper(this.firestore.batch());
  }

  /**
   * Creates a {@link FirebaseFirestore.BulkWriter BulkWriter}, used for
   * performing multiple writes in parallel. Gradually ramps up writes as
   * specified by the 500/50/5 rule.
   *
   * @see
   * https://firebase.google.com/docs/firestore/best-practices#ramping_up_traffic
   *
   * @param options An options object used to configure the throttling behavior
   *        for the underlying BulkWriter.
   */
  bulkWriter(
    options?: FirebaseFirestore.BulkWriterOptions
  ): FirebaseFirestore.BulkWriter {
    return this.firestore.bulkWriter(options);
  }

  /**
   * Creates a new `BundleBuilder` instance to package selected Firestore data
   * into a bundle.
   *
   * @param bundleId The ID of the bundle. When loaded on clients, client SDKs
   *        use this ID and the timestamp associated with the bundle to tell if
   *        it has been loaded already. If not specified, a random identifier
   *        will be used.
   *
   *
   * @example
   * const bundle = firestore.bundle('data-bundle');
   * const docSnapshot = await firestore.doc('abc/123').get();
   * const querySnapshot = await firestore.collection('coll').get();
   *
   * const bundleBuffer = bundle.add(docSnapshot); // Add a document
   *                            .add('coll-query', querySnapshot) // Add a named query.
   *                            .build()
   * // Save `bundleBuffer` to CDN or stream it to clients.
   */
  bundle(bundleId?: string): FirebaseFirestore.BundleBuilder {
    return this.firestore.bundle(bundleId);
  }
}

export default FirestoreWrapper;
