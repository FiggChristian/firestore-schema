import type { CollectionGroup, CollectionReference, DocumentReference, DocumentSnapshot } from "firebase-admin/firestore";
import type { Expand, GenericFirestoreCollection, GenericFirestoreDocument, GenericFirestoreSchema, IndexByCollectionGroupID, IndexByPath, IsMalformedPath, JoinPathSegments, SchemaAtPath, StrKeyof } from "./types";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import QueryWrapper from "./QueryWrapper";
declare class Path<FirestoreSchema extends GenericFirestoreSchema> {
    /**
     * The Firestore object that was used to create the `Path`.
     */
    firestore: FirebaseFirestore.Firestore;
    constructor(firestore: FirebaseFirestore.Firestore);
    castToSchema<Path extends string>(value: CollectionGroup, optionalPath?: Path | undefined): CollectionGroup<SchemaAtPath<FirestoreSchema, Path>>;
    castToSchema<Path extends string>(value: CollectionReference, optionalPath?: Path | undefined): CollectionReference<SchemaAtPath<FirestoreSchema, Path>>;
    castToSchema<Path extends string>(value: DocumentSnapshot, optionalPath?: Path | undefined): DocumentSnapshot<SchemaAtPath<FirestoreSchema, Path>>;
    castToSchema<Path extends string>(value: DocumentReference, optionalPath?: Path | undefined): DocumentReference<SchemaAtPath<FirestoreSchema, Path>>;
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
    collection<CollectionName extends StrKeyof<FirestoreSchema>>(collectionName: CollectionName): CollectionWrapper<FirestoreSchema[CollectionName]>;
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
    collection<Path extends string>(collectionPath: Path): IndexByPath<FirestoreSchema, Path> extends infer R ? R extends GenericFirestoreCollection ? CollectionWrapper<R> : never : never;
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
    collection<PathSegments extends string[]>(...pathSegments: PathSegments): string[] extends PathSegments ? CollectionWrapper<GenericFirestoreCollection> : IsMalformedPath<PathSegments> extends true ? never : JoinPathSegments<PathSegments> extends infer R ? R extends string ? IndexByPath<FirestoreSchema, R> extends infer Q ? Q extends GenericFirestoreDocument ? never : Q extends GenericFirestoreCollection ? CollectionWrapper<Q> : never : never : never : never;
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
    doc<Path extends string>(docPath: Path): IndexByPath<FirestoreSchema, Path> extends infer R ? R extends GenericFirestoreDocument ? DocumentWrapper<R> : never : never;
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
    doc<PathSegments extends string[]>(...pathSegments: PathSegments): string[] extends PathSegments ? DocumentWrapper<GenericFirestoreDocument> : IsMalformedPath<PathSegments> extends true ? never : JoinPathSegments<PathSegments> extends infer R ? R extends string ? IndexByPath<FirestoreSchema, R> extends infer Q ? Q extends GenericFirestoreDocument ? DocumentWrapper<Q> : never : never : never : never;
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
    ] ? [R] extends [GenericFirestoreCollection] ? QueryWrapper<Expand<R>> : never : never;
}
export default Path;
