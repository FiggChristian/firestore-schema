/** Extracts the string keys from an object. */
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
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/** If `T` is `never`, returns `Default`. Otherwise, returns `T`. */
export type DefaultIfNever<T, Default> = [T] extends [never] ? Default : T;

/**
 * Expands a union of single-item tuples, which can themselves contain
 * unions, into an intersection of each tuple's items. This is used for
 * grouping intersections of intersections, and only intersecting the first
 * layer.
 *
 * @example
 * ```ts
 * type Foo = UnionOfTuplesToIntersection<
 *   | [{ foo: 1 } | { foo: 2 }]
 *   | [{ bar: 3 }]
 * >
 * // Intersects the outer group only, but keeps inner unions:
 * // ({ foo: 1 } | { foo: 2 }) & { bar: 3 }
 * // which is equivalent to:
 * // { foo: 1 | 2, bar: 3 }
 * ```
 *
 * This is distinct from a normal `UnionToIntersection` in that it lets you
 * maintain "inner" intersections by wrapping them in `[]` so that they don't
 * also become intersected.
 */
export type UnionOfTuplesToIntersection<U> = (
  U extends [infer T] ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

/**
 * A Symbol used for accessing/defining the schema of documents in the database.
 * Each document is an object that can hold nested collections as keys, so the
 * document's schema must be accessed/defined via this special Symbol.
 */
export const DOCUMENT_SCHEMA = Symbol.for("DOCUMENT_SCHEMA");
/**
 * A Symbol used for accessing/defining the schema of documents in the database.
 * Each document is an object that can hold nested collections as keys, so the
 * document's schema must be accessed/defined via this special Symbol.
 */
export type DOCUMENT_SCHEMA = typeof DOCUMENT_SCHEMA;

/**
 * A generic, untyped document schema.
 *
 * Each document schema must contain a `[DOCUMENT_SCHEMA]` key that refers to a
 * document schema. This type represents that schema, with no associated type
 * information.
 */
export interface GenericDocumentSchema {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * A generic, untyped document in the DatabaseSchema.
 *
 * Each document must contain a `[DOCUMENT_SCHEMA]` key that refers to an object
 * describing the document's schema. It can contain other keys as regular
 * strings that refer to nested collection names, each with their own documents.
 */
export interface GenericFirestoreDocument {
  [DOCUMENT_SCHEMA]: GenericDocumentSchema;
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
 * Returns the schema of a document. If `Document` is a union of multiple
 * documents, the returned type will be a union of all the documents' schemas.
 */
export type SchemaOfDocument<Document extends GenericFirestoreDocument> =
  Document[DOCUMENT_SCHEMA];

/**
 * Returns the schema of a collection's documents. If `Collection` is a union of
 * multiple collections, the returned type will be a union of all the
 * collections' documents' schemas.
 */
export type SchemaOfCollection<Collection extends GenericFirestoreCollection> =
  SchemaOfDocument<DocumentsIn<Collection>>;

/**
 * Returns all the documents in a collection. If `Collection` is a union of
 * multiple collections, the returned type will be a union of all the
 * collections' documents.
 */
export type DocumentsIn<Collection extends GenericFirestoreCollection> =
  Collection extends GenericFirestoreCollection ? Collection[string] : never;

/**
 * Returns all the sub-collections in a document. If `Document` is a union of
 * multiple documents, the returned type will be a union of all the documents'
 * sub-collections.
 */
export type SubCollectionsIn<Document extends GenericFirestoreDocument> =
  Document extends GenericFirestoreDocument
    ? Document[StrKeyof<Document>]
    : never;

/**
 * Returns the keys in a document's schema. If `Document` is a union of multiple
 * documents, the returned type will be a union of all the documents' schemas'
 * keys.
 */
export type SchemaKeysOf<Document extends GenericFirestoreDocument> =
  Document extends GenericFirestoreDocument
    ? SchemaOfDocument<Document> extends infer R
      ? R extends object
        ? string extends StrKeyof<R>
          ? never
          : StrKeyof<R>
        : never
      : never
    : never;

/**
 * A type used for indexing into the database schema with a string path. It
 * returns the collection or document at the specified path, or `never` if the
 * path does not exist in the database schema.
 *
 * Pass `true`/`false` for `AllowWildcard` to enable/disable `{wildcard}` paths.
 *
 * @example
 * ```ts
 * type SpecificUserDocument = IndexByPath<Schema, "users/userID", false>;
 * // Returns the document at the `users/userID` path.
 * type SpecificUserPostCollection = IndexByPath<Schema, "users/userID/posts", false>;
 * // Returns the collection at the `users/uid/posts` path.
 * type AllUserDocuments = IndexByPath<Schema, "users/{userID}", true>;
 * // Returns all documents in the `users` collection.
 * ```
 */
export type IndexByPath<
  FirestoreSchema extends GenericFirestoreSchema,
  Path extends string,
  AllowWildcard extends true | false
> = Path extends `${infer CollectionName}/${infer Rest}`
  ? CollectionName extends `{${string}}`
    ? AllowWildcard extends true
      ? IndexAllCollectionsInDocument<FirestoreSchema, Rest>
      : CollectionName extends StrKeyof<FirestoreSchema>
      ? NestedCollectionIndexByPath<
          FirestoreSchema[CollectionName],
          Rest,
          AllowWildcard
        >
      : never
    : CollectionName extends StrKeyof<FirestoreSchema>
    ? NestedCollectionIndexByPath<
        FirestoreSchema[CollectionName],
        Rest,
        AllowWildcard
      >
    : never
  : Path extends `{${string}}`
  ? AllowWildcard extends true
    ? IndexAllCollectionsInDocument<FirestoreSchema, "">
    : Path extends StrKeyof<FirestoreSchema>
    ? FirestoreSchema[Path]
    : never
  : Path extends StrKeyof<FirestoreSchema>
  ? FirestoreSchema[Path]
  : never;

/**
 * A helper type used by `IndexByPath`, `IndexAllCollectionsInDocument`, and
 * `NestedDocumentIndexByPath`. This helps with selecting the specified
 * documents based on a path string from a given collection.
 */
type NestedCollectionIndexByPath<
  Collection extends GenericFirestoreCollection,
  Path extends string,
  AllowWildcard extends true | false
> = Path extends ""
  ? Collection
  : Path extends `${infer DocumentName}/${infer Rest}`
  ? DocumentName extends `{${string}}`
    ? AllowWildcard extends true
      ? IndexAllDocumentsInCollection<Collection, Rest>
      : DocumentName extends StrKeyof<Collection>
      ? NestedDocumentIndexByPath<Collection[DocumentName], Rest, AllowWildcard>
      : never
    : DocumentName extends StrKeyof<Collection>
    ? NestedDocumentIndexByPath<Collection[DocumentName], Rest, AllowWildcard>
    : never
  : Path extends `{${string}}`
  ? AllowWildcard extends true
    ? IndexAllDocumentsInCollection<Collection, "">
    : Path extends StrKeyof<Collection>
    ? Collection[Path]
    : never
  : Path extends StrKeyof<Collection>
  ? Collection[Path]
  : never;

/**
 * A helper type used by `IndexByPath` and `NestedDocumentIndexByPath`. This
 * helps with wildcard indexing by selecting all collections in a document.
 */
type IndexAllCollectionsInDocument<
  Document extends Pick<GenericFirestoreDocument, string>,
  Rest extends string
> = Document extends Pick<GenericFirestoreDocument, string>
  ? {
      [CollectionName in StrKeyof<Document>]: NestedCollectionIndexByPath<
        Document[CollectionName],
        Rest,
        true
      >;
    }[StrKeyof<Document>]
  : never;

/**
 * A helper type used by `NestedCollectionIndexByPath` and
 * `IndexAllDocumentsInCollection`. This helps with selecting the specified
 * collections based on a path string from a given document.
 */
type NestedDocumentIndexByPath<
  Document extends GenericFirestoreDocument,
  Path extends string,
  AllowWildcard extends true | false
> = Path extends ""
  ? Document
  : Path extends `${infer CollectionName}/${infer Rest}`
  ? CollectionName extends `{${string}}`
    ? AllowWildcard extends true
      ? IndexAllCollectionsInDocument<Document, Rest>
      : CollectionName extends StrKeyof<Document>
      ? NestedCollectionIndexByPath<
          Document[CollectionName],
          Rest,
          AllowWildcard
        >
      : never
    : CollectionName extends StrKeyof<Document>
    ? NestedCollectionIndexByPath<Document[CollectionName], Rest, AllowWildcard>
    : never
  : Path extends `{${string}}`
  ? AllowWildcard extends true
    ? IndexAllCollectionsInDocument<Document, "">
    : Path extends StrKeyof<Document>
    ? Document[Path]
    : never
  : Path extends StrKeyof<Document>
  ? Document[Path]
  : never;

/**
 * A helper type used by `NestedCollectionIndexByPath`. This helps with wildcard
 * indexing by selecting all documents in a collection.
 */
type IndexAllDocumentsInCollection<
  Collection extends GenericFirestoreCollection,
  Rest extends string
> = Collection extends GenericFirestoreCollection
  ? {
      [DocumentName in StrKeyof<Collection>]: NestedDocumentIndexByPath<
        Collection[DocumentName],
        Rest,
        true
      >;
    }[StrKeyof<Collection>]
  : never;

/**
 * A type used for indexing into the Firestore schema with a nested collection
 * group ID. It returns a union of all the collections in the database that have
 * the specified name (or `never` if none match).
 *
 * This can be used with Firestore's `.collectionGroup` method for type-safe
 * documents.
 *
 * @example
 * ```ts
 * type Schema = {
 *   collectionName: {
 *     documentName: {
 *       [DOCUMENT_SCHEMA]: { ... }
 *       collectionName: { ... }
 *     }
 *   }
 * }
 * type UnionOfCollections = IndexByCollectionGroupID<Schema, "collectionName">;
 * // Returns the a union of the collection at `collectionName` and the collection at
 * // `collectionName/documentName/collectionName` because they both have the same collection ID.
 * ```
 */
export type IndexByCollectionGroupID<
  FirestoreSchema extends GenericFirestoreSchema,
  CollectionName extends string
> = NestedIndexByCollectionGroupID<CollectionName, FirestoreSchema>;

/**
 * This type is a helper type for `IndexByCollectionGroupID` to allow it to
 * recursively search the Firestore schema for collections matching the given
 * `CollectionName`. It works on an individual document (or the entire root
 * database object since it's kind of like a document with no schema). If any
 * nested collections in the document match the `CollectionName`, that
 * collection is returned, and then any other nested documents inside those
 * nested collections are searched recursively.
 */
type NestedIndexByCollectionGroupID<
  CollectionName extends string,
  Document extends Pick<GenericFirestoreDocument, string>
> = Document extends Pick<GenericFirestoreDocument, string>
  ? {
      [NestedCollectionName in StrKeyof<Document>]:
        | (CollectionName extends NestedCollectionName
            ? Document[NestedCollectionName]
            : never)
        // This next section looks for documents in the current nested collection
        // and recursively calls `NestedIndexByCollectionGroupID` on them to look
        // for nested collections with the same name.
        | {
            [NestedDocumentName in StrKeyof<
              Document[NestedCollectionName]
            >]: NestedIndexByCollectionGroupID<
              CollectionName,
              Document[NestedCollectionName][NestedDocumentName]
            >;
          }[StrKeyof<Document[NestedCollectionName]>];
    }[StrKeyof<Document>]
  : never;

/**
 * Returns the schema of the document or collection at the specified path.
 *
 * Pass `true`/`false` for `AllowWildcard` to enable/disable `{wildcard}` paths.
 *
 * @example
 * ```ts
 * type SpecificUserSchema = SchemaAtPath<Schema, "users/userID", false>;
 * // Returns the schema of the document at the `users/userID` path.
 * type SpecificUserPostSchemas = SchemaAtPath<Schema, "users/userID/posts", false>;
 * // Returns the schema of all documents in the collection at the `users/uid/posts` path.
 * type AllUserDocumentSchemas = SchemaAtPath<Schema, "users/{userID}", true>;
 * // Returns the schema of all documents in the `users` collection.
 * // In this case, this is equivalent to SchemaAtPath<Schema, "users", true>.
 * ```
 */
export type SchemaAtPath<
  FirestoreSchema extends GenericFirestoreSchema,
  Path extends string,
  AllowWildcard extends true | false
> = IndexByPath<
  FirestoreSchema,
  Path,
  AllowWildcard
> extends infer IndexedObject
  ? IndexedObject extends GenericFirestoreDocument
    ? SchemaOfDocument<IndexedObject>
    : IndexedObject extends GenericFirestoreCollection
    ? SchemaOfCollection<IndexedObject>
    : never
  : never;

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
export type JoinPathSegments<Segments extends string[]> =
  number extends Segments["length"]
    ? string
    : Segments extends [string]
    ? Segments[0]
    : Segments extends [infer First, ...infer Rest]
    ? First extends string
      ? Rest extends string[]
        ? `${First}/${JoinPathSegments<Rest>}`
        : never
      : never
    : never;

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
export type IsMalformedPath<Segments extends string[]> =
  number extends Segments["length"]
    ? false
    : Segments extends [infer First, ...infer Rest]
    ? First extends `${string}/${string}`
      ? true
      : Rest extends string[]
      ? Rest["length"] extends 0
        ? false
        : IsMalformedPath<Rest>
      : never
    : false;

/**
 * Converts types within a document schema from `From` to `To`. Each field that
 * includes `From` will have `From` removed and replaced with `To`. Fields that
 * don't include `From` will be left as-is.
 */
export type ConvertDocumentSchemaType<
  DocumentSchema extends GenericDocumentSchema,
  From,
  To
> = DocumentSchema extends GenericDocumentSchema
  ? {
      [Key in keyof DocumentSchema]: ConvertDocumentSchemaValueType<
        DocumentSchema[Key],
        From,
        To
      >;
    }
  : never;

/**
 * A helper type for `ConvertDocumentSchemaType` that searches a specific value
 * for `From` and replaces it with `To`. It works recursively so it can be
 * applied to arrays and objects.
 */
type ConvertDocumentSchemaValueType<Value, From, To> =
  // Check if this is an array/tuple or not.
  Value extends (infer T)[]
    ? // Check if this is an array or an exact-length tuple.
      number extends Value["length"]
      ? // This is an array, so we can just recurse on the array's type.
        ConvertDocumentSchemaValueType<T, From, To>[]
      : // This is an exact-length tuple, so each item needs to be replaced
        // one-by-one.
        {
          [Key in keyof Value]: ConvertDocumentSchemaValueType<
            Value[Key],
            From,
            To
          >;
        }
    : // Check if this is an object or not.
    Value extends { [key: PropertyKey]: unknown }
    ? // This is an object. Recurse on each of the object's fields.
      {
        [Key in keyof Value]: ConvertDocumentSchemaValueType<
          Value[Key],
          From,
          To
        >;
      }
    : // This is (probably) a primitive. Replace it directly.
      ReplaceIfExtends<Value, From, To>;

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
