import type {
  ConvertDocumentSchemaType,
  Expand,
  GenericDocumentSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  SchemaOfDocument,
  StrKeyof,
} from "@firestore-schema/core";
import type FirebaseFirestore from "@google-cloud/firestore";

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
  | FirebaseFirestore.Timestamp
  | Buffer
  | FirebaseFirestore.GeoPoint
  | FirebaseFirestore.DocumentReference
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
  | Uint8Array
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
      ConvertDocumentSchemaType<
        SchemaOfDocument<Document>,
        Date,
        FirebaseFirestore.Timestamp
      >,
      Uint8Array,
      Buffer
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
      ConvertDocumentSchemaType<
        SchemaOfDocument<Document>,
        Date | FirebaseFirestore.Timestamp,
        Date | FirebaseFirestore.Timestamp
      >,
      Uint8Array | Buffer,
      Uint8Array | Buffer
    >
  >;

/**
 * A better typed version of Firestore's DataConverter interface. It includes
 * two generics: one corresponding to the type that is being converted to (which
 * is the generic type that comes with Firestore's normal DataConverter
 * interface) and another type corresponding to the document schema that is
 * being retrieved from Firestore.
 */
export interface TypedFirestoreDataConverter<
  DocumentSchema extends GenericDocumentSchema,
  ConvertedType
> {
  /**
   * Called by the Firestore SDK to convert a custom model object of type T
   * into a plain Javascript object (suitable for writing directly to the
   * Firestore database). To use set() with `merge` and `mergeFields`,
   * toFirestore() must be defined with `Partial<T>`.
   *
   * The `WithFieldValue<T>` type extends `T` to also allow FieldValues such
   * as `FieldValue.delete()` to be used as property values.
   */
  toFirestore(
    modelObject: FirebaseFirestore.WithFieldValue<ConvertedType>
  ): DocumentSchema;

  /**
   * Called by the Firestore SDK to convert a custom model object of type T
   * into a plain Javascript object (suitable for writing directly to the
   * Firestore database). To use set() with `merge` and `mergeFields`,
   * toFirestore() must be defined with `Partial<T>`.
   *
   * The `PartialWithFieldValue<T>` type extends `Partial<T>` to allow
   * FieldValues such as `FieldValue.delete()` to be used as property values.
   * It also supports nested `Partial` by allowing nested fields to be
   * omitted.
   */
  toFirestore(
    modelObject: FirebaseFirestore.PartialWithFieldValue<ConvertedType>,
    options: FirebaseFirestore.SetOptions
  ): DocumentSchema;

  /**
   * Called by the Firestore SDK to convert Firestore data into an object of
   * type T.
   */
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot<DocumentSchema>
  ): ConvertedType;
}

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
