import {
  ConvertDocumentSchemaType,
  Expand,
  GenericDocumentSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  SchemaOfDocument,
  StrKeyof,
  UnionOfTuplesToIntersection,
} from "@firestore-schema/core";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

/**
 * Utility type used by `GettableFirestoreDataType`. Returns the passed in value
 * or an array of the passed in value.
 */
type ValueOrArray<T> = T | T[];

/**
 * The value types that be returned from Firestore in a document's fields, minus
 * Arrays since Arrays are only allowed to be one-dimensional.
 */
export type GettableFirestoreDataTypeNoArray =
  | string
  | number
  | boolean
  | null
  | FirebaseFirestoreTypes.Timestamp
  | FirebaseFirestoreTypes.Blob
  | FirebaseFirestoreTypes.GeoPoint
  | FirebaseFirestoreTypes.DocumentReference
  | { [key: string]: GettableFirestoreDataType };

/**
 * The value types that can be returned from Firestore in a document's fields.
 */
export type GettableFirestoreDataType =
  ValueOrArray<GettableFirestoreDataTypeNoArray>;

/**
 * The value types that be uploaded to Firestore in a document's fields, minus
 * Arrays since Arrays are only allowed to be one-dimensional.
 */
export type SettableFirestoreDataTypeNoArray =
  | GettableFirestoreDataType
  | Date
  | { [key: string]: SettableFirestoreDataType };

/**
 * The value types that can be uploaded to Firestore in a document's fields.
 */
export type SettableFirestoreDataType =
  ValueOrArray<SettableFirestoreDataTypeNoArray>;

/**
 * Returns a "gettable" version of a document's schema. All values in the schema
 * are replaced with their "gettable" version (i.e., the value that would be
 * returned from Firestore after `get`ting the document). The most important one
 * of these substitutions is turning `Date` objects into Firebase `Timestamp`s.
 */
export type GettableDocumentSchema<Document extends GenericFirestoreDocument> =
  Expand<
    ConvertDocumentSchemaType<
      SchemaOfDocument<Document>,
      Date,
      FirebaseFirestoreTypes.Timestamp
    >
  >;
/**
 * Returns a "settable" version of a document's schema. All values in the schema
 * are replaced with their "settable" version (i.e., the value that can be used
 * to `set` or `update` the document). The most important one of these
 * substitutions is turning Firestore `Timestamp` objects into `Date`s since
 * those are easier to work with and upload (or direct Firestore `Timestamp`
 * objects too since those are also valid).
 */
export type SettableDocumentSchema<Document extends GenericFirestoreDocument> =
  Expand<
    ConvertDocumentSchemaType<
      SchemaOfDocument<Document>,
      Date | FirebaseFirestoreTypes.Timestamp,
      Date | FirebaseFirestoreTypes.Timestamp
    >
  >;

/**
 * A type that filters out documents from `Collection`, which can be a single
 * `Collection` or a union of `Collection`s, that do not have have the specified
 * key in their schema. This will maintain the original structure of the
 * `Collection`(s) instead of combining their results into a single `Collection`
 * object or union of many different `Collection`s.
 *
 * This type is used by `QueryWrapper.where`.
 */
export type EnsureDocumentHasKey<
  Collection extends GenericFirestoreCollection,
  Key extends string
> = Collection extends GenericFirestoreCollection
  ? Expand<
      Pick<
        Collection,
        {
          [SpecificDocumentName in StrKeyof<Collection>]: SpecificDocumentName extends string
            ? Collection[SpecificDocumentName] extends GenericFirestoreDocument
              ? Key extends StrKeyof<
                  SchemaOfDocument<Collection[SpecificDocumentName]>
                >
                ? SpecificDocumentName
                : never
              : never
            : never;
        }[StrKeyof<Collection>]
      >
    > extends infer FilteredCollection
    ? FilteredCollection extends Record<string, never>
      ? never
      : FilteredCollection
    : never
  : never;

/**
 * A type that filters out documents from `Collection`, which can be a single
 * `Collection` or a union of `Collection`s, that do not have have the specified
 * key in their schema, or where the associated value does not extend `Extends`.
 * This will maintain the original structure of the `Collection`(s) instead of
 * combining their results into a single `Collection` object or union of many
 * different `Collection`s.
 *
 * This type does the same as `EnsureDocumentHasKey`, with the additional check
 * that the value at the specified key extends `Extends`.
 *
 * This type is used by `QueryWrapper.where`.
 */
export type EnsureDocumentKeyDoesNotExtendValue<
  Collection extends GenericFirestoreCollection,
  Key extends string,
  Extends
> = Collection extends GenericFirestoreCollection
  ? Expand<
      Pick<
        Collection,
        {
          [SpecificDocumentName in StrKeyof<Collection>]: SpecificDocumentName extends string
            ? Collection[SpecificDocumentName] extends GenericFirestoreDocument
              ? Key extends StrKeyof<
                  SchemaOfDocument<Collection[SpecificDocumentName]>
                >
                ? SchemaOfDocument<
                    Collection[SpecificDocumentName]
                  >[Key] extends Extends
                  ? never
                  : SpecificDocumentName
                : never
              : never
            : never;
        }[StrKeyof<Collection>]
      >
    > extends infer FilteredCollection
    ? FilteredCollection extends Record<string, never>
      ? never
      : FilteredCollection
    : never
  : never;

/**
 * A type that filters out documents from `Collection`, which can be a single
 * `Collection` or a union of `Collection`s, that do not have have the specified
 * key in their schema, or where `Extends` does not extend the associated value.
 * This will maintain the original structure of the `Collection`(s) instead of
 * combining their results into a single `Collection` object or union of many
 * different `Collection`s.
 *
 * This type does the same as `EnsureDocumentHasKey`, with the additional check
 * that `Extends` extends the value at the specified key.
 *
 * This type is used by `QueryWrapper.where`.
 */
export type EnsureValueExtendsDocumentKey<
  Collection extends GenericFirestoreCollection,
  Key extends string,
  Extends
> = Collection extends GenericFirestoreCollection
  ? Expand<
      Pick<
        Collection,
        {
          [SpecificDocumentName in StrKeyof<Collection>]: SpecificDocumentName extends string
            ? Collection[SpecificDocumentName] extends GenericFirestoreDocument
              ? Key extends StrKeyof<
                  SchemaOfDocument<Collection[SpecificDocumentName]>
                >
                ? Extends extends SchemaOfDocument<
                    Collection[SpecificDocumentName]
                  >[Key]
                  ? SpecificDocumentName
                  : never
                : never
              : never
            : never;
        }[StrKeyof<Collection>]
      >
    > extends infer FilteredCollection
    ? FilteredCollection extends Record<string, never>
      ? never
      : FilteredCollection
    : never
  : never;

/**
 * Deeply adds `FirebaseFirestoreTypes.FieldValue`s to each field in `T`. This
 * is used when writing data to Firestore since each value can be teh expected
 * type, or a special FieldValue.
 */
export type WithFieldValue<T extends object> = T extends object
  ? {
      [K in keyof T]:
        | (T[K] extends infer R
            ? R extends object
              ? WithFieldValue<R>
              : R
            : never)
        | FirebaseFirestoreTypes.FieldValue;
    }
  : never;

/**
 * Returns all keys in `T`, including deeply nested keys as dot-separated keys.
 *
 * @example
 * ```ts
 * type Test DottedFieldValues<{
 *   a: {
 *     b: {
 *       c: string;
 *     };
 *     d: number;
 *   };
 *   e: boolean;
 * }> // "a" | "a.b" | "a.b.c" | "a.d" | "e";
 */
export type DottedFieldValues<T extends object> = T extends object
  ? {
      [K in StrKeyof<T>]:
        | K
        | (T[K] extends infer R
            ? R extends object
              ? `${K}.${DottedFieldValues<R>}`
              : never
            : never);
    }[StrKeyof<T>]
  : never;

/**
 * Given a potentially dot-separated key, deeply indexes `T` using the key and
 * returns the value. If `T` is a union of multiple types, returns the
 * intersection of the types at the specified key.
 *
 * @example
 * ```ts
 * type Test = DottedFieldNameIndex<"a.b.c", {
 *   a: {
 *     b: {
 *       c: string;
 *     };
 *     d: number;
 *   };
 *   e: boolean;
 * }>; // string
 * ```
 */
export type DottedFieldNameIndex<
  Field extends string,
  T extends object
> = UnionOfTuplesToIntersection<NestedDottedFieldNameIndex<Field, T>>;

type NestedDottedFieldNameIndex<
  Field extends string,
  T extends object
> = T extends object
  ? Field extends `${infer Pre}.${infer Post}`
    ? Pre extends StrKeyof<T>
      ? T[Pre] extends object
        ? NestedDottedFieldNameIndex<Post, T[Pre]>
        : never
      : never
    : T extends object
    ? Field extends StrKeyof<T>
      ? [T[Field]]
      : never
    : never
  : never;

/**
 * Given an object, adds deeply nested fields at the top level of the object as
 * dot-separated keys.
 *
 * @example
 * ```ts
 * type Test = WithDottedFieldNames<{
 *   a: {
 *     b: {
 *       c: string;
 *     };
 *     d: number;
 *   };
 *   e: boolean;
 * }>;
 * // {
 * //   a: { b: { c: string; }; d: number; };
 * //   e: boolean;
 * //   "a.b": { c: string; };
 * //   "a.d": number;
 * //   "a.b.c": string;
 * // }
 */
export type WithDottedFieldNames<T extends object> = {
  [K in DottedFieldValues<T>]: DottedFieldNameIndex<K, T>;
};

/**
 * Given a document schema, returns the type of data that can be used to
 * overwrite the data (i.e., what can be passed to `.doc().set()`).
 */
export type SetData<T extends GenericDocumentSchema> =
  T extends GenericDocumentSchema ? Expand<WithFieldValue<T>> : never;

/**
 * Given a document schema, returns the type of data that can be used to update
 * the data (i.e., what can be passed to `.doc().update()`).
 */
export type UpdateData<T extends GenericDocumentSchema> =
  T extends GenericDocumentSchema
    ? Expand<Partial<WithFieldValue<WithDottedFieldNames<T>>>>
    : never;

/**
 * Returns the dot-separated keys in a document's schema. If `Document` is a
 * union of multiple documents, the returned type will be a union of all the
 * documents' schemas' keys.
 */
export type DotNestedSchemaKeysOf<Document extends GenericFirestoreDocument> =
  Document extends GenericFirestoreDocument
    ? SchemaOfDocument<Document> extends infer R
      ? R extends object
        ? string extends StrKeyof<R>
          ? never
          : DottedFieldValues<R>
        : never
      : never
    : never;
