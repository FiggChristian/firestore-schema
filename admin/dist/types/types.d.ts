/// <reference types="node" />
import type { DocumentData, DocumentReference, FieldValue, GeoPoint, Timestamp } from "firebase-admin/firestore";
/**
 * A Symbol used for accessing the schema of documents in the database. Each
 * document is an object that can hold nested collections as keys, so the
 * document's schema must be accessed via this special Symbol.
 */
export declare const DOCUMENT_SCHEMA: unique symbol;
/**
 * A Symbol used for accessing the schema of documents in the database. Each
 * document is an object that can hold nested collections as keys, so the
 * document's schema must be accessed via this special Symbol.
 */
export type DOCUMENT_SCHEMA = typeof DOCUMENT_SCHEMA;
/**
 * A generic, untyped document in the DatabaseSchema.
 *
 * Each document must contain a `[DOCUMENT_SCHEMA]` key that refers to an object
 * describing the document's schema. It can contain other keys as regular
 * strings that refer to nested collection names, each with their own documents.
 */
export interface GenericFirestoreDocument {
    [DOCUMENT_SCHEMA]: DocumentData;
    [key: string]: GenericFirestoreCollection;
}
/**
 * A generic collection or nested sub-collection in the DatabaseSchema.
 *
 * Each collection contains string keys that represent document names in that
 * collection. A collection has no schema the way documents do, only documents
 * with their own schemas.
 */
export interface GenericFirestoreCollection {
    [key: string]: GenericFirestoreDocument;
}
/**
 * A generic database schema.
 *
 * Each collection contains string keys that represent document names in that
 * collection. A collection has no schema the way documents do, only documents
 * with their own schemas.
 */
export interface GenericFirestoreSchema {
    [key: string]: GenericFirestoreCollection;
}
/**
 * A type used for indexing into the database schema with a string path,
 * relative from a given document. This is used by `IndexByPath` for recursive
 * indexing.
 */
export type NestedDocumentIndexByPath<Document extends GenericFirestoreDocument, Path extends string> = Path extends "" ? Document : Path extends `${infer CollectionName}/${infer Rest}` ? CollectionName extends `{${string}}` ? IndexAllCollectionsInDocument<Document, Rest> : CollectionName extends StrKeyof<Document> ? NestedCollectionIndexByPath<Document[CollectionName], Rest> : never : Path extends `{${string}}` ? IndexAllCollectionsInDocument<Document, ""> : Path extends StrKeyof<Document> ? Document[Path] : never;
export type IndexAllCollectionsInDocument<Document extends Omit<GenericFirestoreDocument, DOCUMENT_SCHEMA>, Rest extends string> = Document extends {
    [_ in infer CollectionNames]: unknown;
} ? {
    [CollectionName in CollectionNames]: NestedCollectionIndexByPath<Document[CollectionName], Rest>;
}[Exclude<CollectionNames, DOCUMENT_SCHEMA>] : never;
/**
 * A type used for indexing into the database schema with a string path,
 * relative from a given collection. This is used by `IndexByPath` for recursive
 * indexing.
 */
export type NestedCollectionIndexByPath<Collection extends GenericFirestoreCollection, Path extends string> = Path extends "" ? Collection : Path extends `${infer DocumentName}/${infer Rest}` ? DocumentName extends `{${string}}` ? IndexAllDocumentsInCollection<Collection, Rest> : DocumentName extends StrKeyof<Collection> ? NestedDocumentIndexByPath<Collection[DocumentName], Rest> : never : Path extends `{${string}}` ? IndexAllDocumentsInCollection<Collection, ""> : Path extends StrKeyof<Collection> ? Collection[Path] : never;
export type IndexAllDocumentsInCollection<Collection extends GenericFirestoreCollection, Rest extends string> = Collection extends {
    [_ in infer DocumentNames]: GenericFirestoreDocument;
} ? {
    [DocumentName in DocumentNames]: NestedDocumentIndexByPath<Collection[DocumentName], Rest>;
}[DocumentNames] : never;
/**
 * A type used for indexing into the database schema with a string path. It
 * returns the collection or document at the specified path, or `never` if the
 * path does not exist in the database schema.
 *
 * This can be combined with `SchemaFromObject` to return the schema at a
 * specific path in the database.
 *
 * @example
 * ```ts
 * type VideoPostSchema = IndexByPath<"videoposts/randomID">;
 * // Returns the document at the `videoposts/randomID` path.
 * type UserProfileSchema = IndexByPath<"users/uid/restricted">;
 * // Returns the collection at the `users/uid/restricted` path.
 *
 * type UserProfileSchema =
 *   SchemaFromObject<IndexByPath<"users/uid/restricted/profile">>;
 * // Returns the schema of the `users/uid/restricted/profile` document.
 * ```
 */
export type IndexByPath<FirestoreSchema extends GenericFirestoreSchema, Path extends string> = Path extends `${infer CollectionName}/${infer Rest}` ? CollectionName extends `{${string}}` ? IndexAllCollectionsInDocument<FirestoreSchema, Rest> : CollectionName extends StrKeyof<FirestoreSchema> ? NestedCollectionIndexByPath<FirestoreSchema[CollectionName], Rest> : never : Path extends StrKeyof<FirestoreSchema> ? FirestoreSchema[Path] : never;
export type SchemaAtPath<FirestoreSchema extends GenericFirestoreSchema, Path extends string> = IndexByPath<FirestoreSchema, Path> extends infer IndexedObject ? IndexedObject extends GenericFirestoreDocument ? IndexedObject[typeof DOCUMENT_SCHEMA] : IndexedObject extends GenericFirestoreCollection ? {
    [DocumentName in StrKeyof<IndexedObject>]: IndexedObject[DocumentName][DOCUMENT_SCHEMA];
}[StrKeyof<IndexedObject>] : never : never;
/**
 * This type is a utility type for `IndexByCollectionGroupID` to allow it to
 * recursively search the database schema for collections matching the given
 * `CollectionName`. It works on an individual document (or the entire root
 * database object since it's kind of like a document with no schema). If any
 * nested collections in the document match the `CollectionName`, that
 * collection is returned, and then any other nested documents inside those
 * nested collections are searched recursively.
 */
type NestedIndexByCollectionGroupID<CollectionName extends string, Document extends {
    [key in DocumentKeys]: GenericFirestoreCollection;
}, DocumentKeys extends StrKeyof<Document> = StrKeyof<Document>> = {
    [NestedCollectionName in DocumentKeys]: (CollectionName extends NestedCollectionName ? Document[NestedCollectionName] : never) | {
        [NestedDocumentName in StrKeyof<Document[NestedCollectionName]>]: NestedIndexByCollectionGroupID<CollectionName, Document[NestedCollectionName][NestedDocumentName]>;
    }[StrKeyof<Document[NestedCollectionName]>];
}[DocumentKeys];
/**
 * A type used for indexing into the database with a nested collection group ID.
 * It returns a union of all the collections in the database that have the
 * specified name (or `never` if none match).
 *
 * This can be used with Firestore's `.collectionGroup` method for type-safe
 * documents.
 *
 * @example
 * ```ts
 * type RestrictedCollectionGroup = IndexByCollectionGroupID<"restricted">;
 * // Returns the collection `users/{UID}/restricted` (along with any other
 * // collections named `restricted` if any were to exist).
 * type UserProfileSchema = IndexByPath<"users">;
 * // Returns the collection at `users`.
 * ```
 */
export type IndexByCollectionGroupID<FirestoreSchema extends GenericFirestoreSchema, CollectionName extends string> = NestedIndexByCollectionGroupID<CollectionName, FirestoreSchema>;
export type ConvertSchemaType<FirestoreSchema extends GenericFirestoreSchema, From, To> = {
    [CollectionName in keyof FirestoreSchema]: ConvertCollectionType<FirestoreSchema[CollectionName], From, To>;
};
export type ConvertCollectionType<Collection extends GenericFirestoreCollection, From, To> = {
    [DocumentName in keyof Collection]: ConvertDocumentType<Collection[DocumentName], From, To>;
};
export type ConvertDocumentType<Document extends GenericFirestoreDocument, From, To> = {
    [CollectionName in keyof Document]: CollectionName extends DOCUMENT_SCHEMA ? ConvertDocumentSchemaType<Document[DOCUMENT_SCHEMA], From, To> : ConvertCollectionType<Document[CollectionName], From, To>;
};
export type ConvertDocumentSchemaType<DocumentSchema extends DocumentData, From, To> = {
    [Key in keyof DocumentSchema]: ConvertDocumentSchemaValueType<DocumentSchema[Key], From, To>;
};
export type ConvertDocumentSchemaValueType<Value, From, To> = Value extends (infer T)[] ? ConvertDocumentSchemaValueType<T, From, To>[] : Value extends {
    [key: string | number]: unknown;
} ? {
    [Key in keyof Value]: ConvertDocumentSchemaValueType<Value[Key], From, To>;
} : ReplaceIfExtends<Value, From, To>;
/**
 * Replaces `From` with `To` in `T`. If `T` does not extend `From` to begin
 * with, `To` is not added.
 *
 * @example
 * ```ts
 * type A = ReplaceIfExtends<boolean | number, boolean, string>; // string | number
 * type B = ReplaceIfExtends<boolean | number, string, string>; // boolean | number
 * ```
 */
type ReplaceIfExtends<T, From, To> = T extends From ? To : T;
/**
 * Extracts the string keys from an object.
 */
export type StrKeyof<T extends object> = Extract<keyof T, string>;
/**
 * Given an object, forces TypeScript to evaluate it one level deep instead of
 * keeping it as a generic type. Most simple types don't need this; more complex
 * types are not completely evaluated by TypeScript until they get wrapped in
 * this.
 *
 * @example
 * ```ts
 * type Unexpanded = Pick<SomeComplexObject, "some_key"> // Sometimes remains unresolved as Pick<...>
 * type Expanded = Expand<Pick<SomeComplexObject, "some_key">> // Forces TypeScript to evaluate the type, expanding the Pick<...>
 * ```
 */
export type Expand<T> = T extends infer O ? {
    [K in keyof O]: O[K];
} : never;
/**
 * Given a string tuple, joins each string with a slash (/) and returns the
 * joined string.
 *
 * @example
 * ```ts
 * type Foo = JoinPathSegments<["users", "uid", "posts"]>; // "users/uid/posts"
 * type Foo = JoinPathSegments<["ab", string, "cd"]>; // `ab/${string}/cd`
 * ```
 */
export type JoinPathSegments<Segments extends string[]> = number extends Segments["length"] ? string : Segments extends [string] ? Segments[0] : Segments extends [infer First, ...infer Rest] ? First extends string ? Rest extends string[] ? `${First}/${JoinPathSegments<Rest>}` : never : never : never;
/**
 * Given a string tuple, returns whether the any string in the tuple is
 * considered "malformed" in a path. A malformed string is one that contains a
 * slash in it. The return value is either `true` or `false`. This only checks
 * for when the path is for sure malformed. This means any instances of `string`
 * (i.e., not a specific string) cannot be checked, and will assume `false`
 *
 * @example
 * ```ts
 * type Foo<Path extends string[]> = IsMalformedPath<Path> extends true
 *   ? never
 *   : DoSomethingWithNonMalformedPath<Path>;
 * type Bar = Foo<["foo", "bar"]>; // Works
 * type Baz = Foo<["foo", "bar/baz"]>; // Returns `never`
 * type Qux = Foo<["foo", string]>; // Works since `foo` passes and `string` can't be determined.
 * type Quux = Foo<["foo/bar", string]>; // Returns `never`
 * ```
 */
export type IsMalformedPath<Segments extends string[]> = number extends Segments["length"] ? false : Segments extends [infer First, ...infer Rest] ? First extends `${string}/${string}` ? true : Rest extends string[] ? Rest["length"] extends 0 ? false : IsMalformedPath<Rest> : never : false;
/**
 * Utility type used by `GettableFirestoreDataType` and
 * `SettableFirestoreDataType`. Returns the passed in value or an array of the
 * passed in value.
 */
type ValueOrArray<T> = T | T[];
/**
 * The value types that be returned from Firestore in a document's fields, minus
 * Arrays since Arrays are only allowed to be one-dimensional.
 */
export type GettableFirestoreDataTypeNoArray = string | number | boolean | null | Timestamp | Buffer | GeoPoint | DocumentReference | {
    [key: string]: GettableFirestoreDataType;
};
/**
 * The value types that be returned from Firestore in a document's fields.
 */
export type GettableFirestoreDataType = ValueOrArray<GettableFirestoreDataTypeNoArray>;
/**
 * The value types that be uploaded to Firestore in a document's fields.
 */
export type SettableFirestoreDataType = ValueOrArray<GettableFirestoreDataTypeNoArray | Date | Uint8Array | FieldValue>;
export type GettableDocumentSchema<Document extends GenericFirestoreDocument> = Expand<ConvertDocumentSchemaType<ConvertDocumentSchemaType<Document[DOCUMENT_SCHEMA], Date, Timestamp>, Uint8Array, Buffer>>;
export type SettableDocumentSchema<Document extends GenericFirestoreDocument> = Expand<ConvertDocumentSchemaType<ConvertDocumentSchemaType<Document[DOCUMENT_SCHEMA], Date | Timestamp, Date | Timestamp>, Uint8Array | Buffer, Uint8Array | Buffer>>;
export {};
