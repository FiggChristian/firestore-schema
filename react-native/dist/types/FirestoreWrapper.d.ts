import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Expand, GenericFirestoreCollection, GenericFirestoreDocument, GenericFirestoreSchema, IndexByCollectionGroupID, IndexByPath, IsMalformedPath, JoinPathSegments, SchemaAtPath, StrKeyof } from "@firestore-schema/core";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import TransactionWrapper from "./TransactionWrapper";
import WriteBatchWrapper from "./WriteBatchWrapper";
import QueryWrapper from "./QueryWrapper";
import { SettableFirestoreDataType } from "./types";
import { ReactNativeFirebase } from "@react-native-firebase/app";
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
declare class FirestoreWrapper<FirestoreSchema extends GenericFirestoreSchema> implements Omit<FirebaseFirestoreTypes.Module, never> {
    /** The Firestore object that was used to create the `FirestoreWrapper`. */
    firestore: FirebaseFirestoreTypes.Module;
    /**
     * Creates a typed `FirestoreWrapper` object around the specified `Firestore`
     * object.
     *
     * @param firestore The `Firestore` object to wrap.
     */
    constructor(firestore: FirebaseFirestoreTypes.Module);
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
     * the database whose schema will be used for casting the value.
     * @returns The passed-in `value`, cast to the specified schema.
     */
    castToSchema<Path extends string>(value: FirebaseFirestoreTypes.DocumentSnapshot, optionalPath?: Path | undefined): FirebaseFirestoreTypes.DocumentSnapshot<SchemaAtPath<FirestoreSchema, Path, true>>;
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
     * the database whose schema will be used for casting the value.
     * @returns The passed-in `value`, cast to the specified schema.
     */
    castToSchema<Path extends string>(value: DocumentWrapper<GenericFirestoreDocument>, optionalPath?: Path | undefined): DocumentWrapper<SchemaAtPath<FirestoreSchema, Path, true>>;
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
     * the database whose schema will be used for casting the value.
     * @returns The passed-in `value`, cast to the specified schema.
     */
    castToSchema<Path extends string>(value: FirebaseFirestoreTypes.DocumentReference, optionalPath?: Path | undefined): FirebaseFirestoreTypes.DocumentReference<SchemaAtPath<FirestoreSchema, Path, true>>;
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
     * the database whose schema will be used for casting the value.
     * @returns The passed-in `value`, cast to the specified schema.
     */
    castToSchema<Path extends string>(value: CollectionWrapper<GenericFirestoreCollection>, optionalPath?: Path | undefined): CollectionWrapper<SchemaAtPath<FirestoreSchema, Path, true>>;
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
     * the database whose schema will be used for casting the value.
     * @returns The passed-in `value`, cast to the specified schema.
     */
    castToSchema<Path extends string>(value: FirebaseFirestoreTypes.CollectionReference, optionalPath?: Path | undefined): FirebaseFirestoreTypes.CollectionReference<SchemaAtPath<FirestoreSchema, Path, true>>;
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
     * the database whose schema will be used for casting the value.
     * @returns The passed-in `value`, cast to the specified schema.
     */
    castToSchema<Path extends string>(value: QueryWrapper<GenericFirestoreCollection>, optionalPath?: Path | undefined): QueryWrapper<SchemaAtPath<FirestoreSchema, Path, true>>;
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
     * the database whose schema will be used for casting the value.
     * @returns The passed-in `value`, cast to the specified schema.
     */
    castToSchema<Path extends string>(value: FirebaseFirestoreTypes.Query, optionalPath?: Path | undefined): FirebaseFirestoreTypes.Query<SchemaAtPath<FirestoreSchema, Path, true>>;
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
     * the database whose schema will be used for casting the value.
     * @returns The passed-in `value`, cast to the specified schema.
     */
    castToSchema<Path extends string>(value: {
        [key: string]: SettableFirestoreDataType;
    }, optionalPath?: Path | undefined): SchemaAtPath<FirestoreSchema, Path, true>;
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
     * the database whose schema will be used for casting the value.
     * @returns The passed-in `value`, cast to the specified schema.
     */
    castToSchema<Path extends string>(value: {
        [key: string]: SettableFirestoreDataType;
    } | undefined, optionalPath?: Path | undefined): SchemaAtPath<FirestoreSchema, Path, true> | undefined;
    /** The current `FirebaseApp` instance for this Firebase service. */
    get app(): ReactNativeFirebase.FirebaseApp;
    /**
     * Creates a write batch, used for performing multiple writes as a single
     * atomic operation. The maximum number of writes allowed in a single
     * WriteBatch is 500, but note that each usage of
     * `FieldValue.serverTimestamp()`, `FieldValue.arrayUnion()`,
     * `FieldValue.arrayRemove()`, or `FieldValue.increment()` inside a WriteBatch
     * counts as an additional write.
     *
     * @example
     * ```ts
     * const batch = firestore.batch();
     * batch.delete(...);
     * ```
     */
    batch(): WriteBatchWrapper;
    /**
     * Gets a `CollectionWrapper` instance that refers to the collection at the
     * specified path.
     *
     * @example
     * ```ts
     * firestore.collection("users");
     * firestore.collection("users/userID/posts");
     * firestore.collection("users", "userID", "posts");
     * ```
     *
     * @param collectionPath A slash-separated path to a collection.
     * @returns The `CollectionWrapper` instance.
     */
    collection<CollectionName extends StrKeyof<FirestoreSchema>>(collectionName: CollectionName): CollectionWrapper<FirestoreSchema[CollectionName]>;
    /**
     * Gets a `CollectionWrapper` instance that refers to the collection at the
     * specified path.
     *
     * @example
     * ```ts
     * firestore.collection("users");
     * firestore.collection("users/userID/posts");
     * firestore.collection("users", "userID", "posts");
     * ```
     *
     * @param collectionPath A slash-separated path to a collection.
     * @returns The `CollectionWrapper` instance.
     */
    collection<Path extends string>(collectionPath: Path): IndexByPath<FirestoreSchema, Path, false> extends infer R ? R extends GenericFirestoreCollection ? CollectionWrapper<R> : never : never;
    /**
     * Gets a `CollectionWrapper` instance that refers to the collection at the
     * specified path.
     *
     * @example
     * ```ts
     * firestore.collection("users");
     * firestore.collection("users/userID/posts");
     * firestore.collection("users", "userID", "posts");
     * ```
     *
     * @param pathSegments A list of path segments that index a specific
     * collection.
     * @returns The `CollectionWrapper` instance.
     * @throws {TypeError} If the number of path segments is even (which would
     * correspond to a document instead of a collection).
     */
    collection<PathSegments extends string[]>(...pathSegments: PathSegments): string[] extends PathSegments ? CollectionWrapper<GenericFirestoreCollection> : IsMalformedPath<PathSegments> extends true ? never : JoinPathSegments<PathSegments> extends infer R ? R extends string ? IndexByPath<FirestoreSchema, R, false> extends infer Q ? Q extends GenericFirestoreDocument ? never : Q extends GenericFirestoreCollection ? CollectionWrapper<Q> : never : never : never : never;
    /**
     * Creates and returns a new `QueryWrapper` that includes all documents in the
     * database that are contained in a collection or subcollection with the given
     * `collectionId`.
     *
     * @example
     * ```ts
     * firestore.collectionGroup('orders');
     * ```
     *
     * @param collectionId Identifies the collections to query over. Every
     * collection or subcollection with this ID as the last segment of its path
     * will be included. Cannot contain a slash.
     * @returns The `QueryWrapper` instance.
     */
    collectionGroup<CollectionName extends string>(collectionId: CollectionName): IsMalformedPath<[CollectionName]> extends true ? never : [IndexByCollectionGroupID<FirestoreSchema, CollectionName>] extends [
        infer R
    ] ? [R] extends [GenericFirestoreCollection] ? QueryWrapper<Expand<R>> : never : never;
    /**
     * Disables network usage for this instance. It can be re-enabled via
     * `enableNetwork()`. While the network is disabled, any snapshot listeners or
     * `get()` calls will return results from cache, and any write operations will
     * be queued until the network is restored.
     *
     * Returns a promise that is resolved once the network has been disabled.
     *
     * @example
     * ```ts
     * await firestore.disableNetwork();
     * ```
     */
    disableNetwork(): Promise<void>;
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
     * @returns The `DocumentWrapper` instance.
     */
    doc<Path extends string>(docPath: Path): IndexByPath<FirestoreSchema, Path, false> extends infer R ? R extends GenericFirestoreDocument ? DocumentWrapper<R> : never : never;
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
     * collection.
     * @returns The `DocumentWrapper` instance.
     * @throws {TypeError} If the number of path segments is odd (which would
     * correspond to a collection instead of a document).
     */
    doc<PathSegments extends string[]>(...pathSegments: PathSegments): string[] extends PathSegments ? DocumentWrapper<GenericFirestoreDocument> : IsMalformedPath<PathSegments> extends true ? never : JoinPathSegments<PathSegments> extends infer R ? R extends string ? IndexByPath<FirestoreSchema, R, false> extends infer Q ? Q extends GenericFirestoreDocument ? DocumentWrapper<Q> : never : never : never : never;
    /**
     * Re-enables use of the network for this Firestore instance after a prior call to `disableNetwork()`.
     *
     * @example
     * ```ts
     * await firestore.enableNetwork();
     * ```
     */
    enableNetwork(): Promise<void>;
    /**
     * Executes the given `updateFunction` and then attempts to commit the changes
     * applied within the transaction. If any document read within the transaction
     * has changed, Cloud Firestore retries the `updateFunction`. If it fails to
     * commit after 5 attempts, the transaction fails.
     *
     * The maximum number of writes allowed in a single transaction is 500, but
     * note that each usage of `FieldValue.serverTimestamp()`,
     * `FieldValue.arrayUnion()`, `FieldValue.arrayRemove()`, or
     * `FieldValue.increment()` inside a transaction counts as an additional
     * write.
     *
     * @example
     * ```ts
     * const cityRef = firestore.doc('cities/SF');
     *
     * await firestore.runTransaction(async (transaction) => {
     *   const snapshot = await transaction.get(cityRef);
     *   await transaction.update(cityRef, {
     *     population: snapshot.data().population + 1,
     *   });
     * });
     * ```
     */
    runTransaction<ReturnType>(updateFunction: (transaction: TransactionWrapper) => Promise<ReturnType>): Promise<ReturnType>;
    /**
     * Specifies custom settings to be used to configure the Firestore instance.
     * Must be set before invoking any other methods.
     *
     * @example
     * ```ts
     * const settings = {
     *   cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
     * };
     *
     * await firestore.settings(settings);
     * ```
     *
     * @param settings A `Settings` object.
     */
    settings(settings: FirebaseFirestoreTypes.Settings): Promise<void>;
    /**
     * Loads a Firestore bundle into the local cache.
     *
     * @example
     * ```ts
     * const resp = await fetch('/createBundle');
     * const bundleString = await resp.text();
     * await firestore.loadBundle(bundleString);
     * ```
     */
    loadBundle(bundle: string): Promise<FirebaseFirestoreTypes.LoadBundleTaskProgress>;
    /**
     * Reads a Firestore Query from local cache, identified by the given name.
     *
     * @example
     * ```ts
     * const query = firestore.namedQuery('latest-stories-query');
     * const storiesSnap = await query.get({ source: 'cache' });
     * ```
     */
    namedQuery<Collection extends GenericFirestoreCollection>(name: string): QueryWrapper<Collection>;
    namedQuery<Collection extends GenericFirestoreCollection>(name: string): QueryWrapper<Collection>;
    /**
     * Aimed primarily at clearing up any data cached from running tests. Needs to
     * be executed before any database calls are made.
     *
     * @example
     *```ts
     * await firestore.clearPersistence();
     * ```
     */
    clearPersistence(): Promise<void>;
    /**
     * Waits until all currently pending writes for the active user have been
     * acknowledged by the backend.
     *
     * The returned Promise resolves immediately if there are no outstanding
     * writes. Otherwise, the Promise waits for all previously issued writes
     * (including those written in a previous app session), but it does not wait
     * for writes that were added after the method is called. If you want to wait
     * for additional writes, call `waitForPendingWrites()` again.
     *
     * Any outstanding `waitForPendingWrites()` Promises are rejected when the
     * logged-in user changes.
     *
     * @example
     *```ts
     * await firestore.waitForPendingWrites();
     * ```
     */
    waitForPendingWrites(): Promise<void>;
    /**
     * Typically called to ensure a new Firestore instance is initialized before
     * calling `firestore.clearPersistence()`.
     *
     * @example
     *```ts
     * await firestore.terminate();
     * ```
     */
    terminate(): Promise<void>;
    /**
     * Modify this Firestore instance to communicate with the Firebase Firestore
     * emulator. This must be called before any other calls to Firebase Firestore
     * to take effect. Do not use with production credentials as emulator traffic
     * is not encrypted.
     *
     * Note: on android, hosts 'localhost' and '127.0.0.1' are automatically
     * remapped to '10.0.2.2' (the "host" computer IP address for android
     * emulators) to make the standard development experience easy. If you want to
     * use the emulator on a real android device, you will need to specify the
     * actual host computer IP address.
     *
     * @param host emulator host (eg, 'localhost')
     * @param port emulator port (eg, 8080)
     */
    useEmulator(host: string, port: number): void;
}
export default FirestoreWrapper;
