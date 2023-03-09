import type { DocumentData, DocumentSnapshot, FieldPath, OrderByDirection, Query } from "firebase-admin/firestore";
import { DOCUMENT_SCHEMA, Expand, GenericFirestoreCollection, GenericFirestoreDocument, GettableFirestoreDataType, GettableFirestoreDataTypeNoArray, StrKeyof } from "./types";
/**
 * A type that returns all the string keys from a collection's nested documents'
 * schemas. Since `Collection` can actually be a union of multiple collections,
 * this type takes care of traversing all of them properly to return all
 * possible keys.
 */
type NestedDocumentKeys<Collection extends GenericFirestoreCollection> = Collection extends {
    [_ in infer DocumentNames]: GenericFirestoreDocument;
} ? {
    [DocumentName in DocumentNames]: Collection[DocumentName] extends {
        [DOCUMENT_SCHEMA]: infer Schema;
    } ? Schema extends object ? string extends StrKeyof<Schema> ? never : StrKeyof<Schema> : never : never;
}[DocumentNames] : never;
/**
 * A type that filters out documents from `Collection`, which can be a single
 * `Collection` or a union of `Collection`s, that do not have have the specified
 * key in their schema. This will maintain the original structure of the
 * `Collection`(s) instead of combining their results into a single `Collection`
 * object or union of many different `Collection`s.
 */
type EnsureDocumentHasKey<Collection extends GenericFirestoreCollection, Key extends string> = Collection extends {
    [_ in infer AllDocumentNames]: unknown;
} ? Expand<Pick<Collection, {
    [SpecificDocumentName in AllDocumentNames]: SpecificDocumentName extends string ? Collection[SpecificDocumentName] extends GenericFirestoreDocument ? Key extends StrKeyof<Collection[SpecificDocumentName][DOCUMENT_SCHEMA]> ? SpecificDocumentName : never : never : never;
}[AllDocumentNames & string]>> extends infer FilteredCollection ? FilteredCollection extends Record<string, never> ? never : FilteredCollection : never : never;
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
 */
type EnsureDocumentKeyDoesNotExtendValue<Collection extends GenericFirestoreCollection, Key extends string, Extends> = Collection extends {
    [_ in infer AllDocumentNames]: unknown;
} ? Expand<Pick<Collection, {
    [SpecificDocumentName in AllDocumentNames]: SpecificDocumentName extends string ? Collection[SpecificDocumentName] extends GenericFirestoreDocument ? Key extends StrKeyof<Collection[SpecificDocumentName][DOCUMENT_SCHEMA]> ? Collection[SpecificDocumentName][DOCUMENT_SCHEMA][Key] extends Extends ? never : SpecificDocumentName : never : never : never;
}[AllDocumentNames & string]>> extends infer FilteredCollection ? FilteredCollection extends Record<string, never> ? never : FilteredCollection : never : never;
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
 */
type EnsureValueExtendsDocumentKey<Collection extends GenericFirestoreCollection, Key extends string, Extends> = Collection extends {
    [_ in infer AllDocumentNames]: unknown;
} ? Expand<Pick<Collection, {
    [SpecificDocumentName in AllDocumentNames]: SpecificDocumentName extends string ? Collection[SpecificDocumentName] extends GenericFirestoreDocument ? Key extends StrKeyof<Collection[SpecificDocumentName][DOCUMENT_SCHEMA]> ? Extends extends Collection[SpecificDocumentName][DOCUMENT_SCHEMA][Key] ? SpecificDocumentName : never : never : never : never;
}[AllDocumentNames & string]>> extends infer FilteredCollection ? FilteredCollection extends Record<string, never> ? never : FilteredCollection : never : never;
declare class QueryWrapper<Collection extends GenericFirestoreCollection> {
    /**
     * The raw Firebase `Query` instance.
     */
    ref: Query<{
        [DocumentName in StrKeyof<Collection>]: Collection[DocumentName][DOCUMENT_SCHEMA];
    }[StrKeyof<Collection>]>;
    constructor(ref: Query);
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<FieldPathType extends NestedDocumentKeys<Collection>, InType extends GettableFirestoreDataType>(fieldPath: FieldPathType, opStr: "in", value: InType[]): EnsureValueExtendsDocumentKey<Collection, FieldPathType, InType> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<InType extends GettableFirestoreDataType>(fieldPath: string | FirebaseFirestore.FieldPath, opStr: "in", value: InType[]): EnsureValueExtendsDocumentKey<Collection, string, InType> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<FieldPathType extends NestedDocumentKeys<Collection>, ContainsType extends GettableFirestoreDataTypeNoArray>(fieldPath: FieldPathType, opStr: "array-contains", value: ContainsType): EnsureValueExtendsDocumentKey<Collection, FieldPathType, ContainsType[]> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<ContainsType extends GettableFirestoreDataTypeNoArray>(fieldPath: string | FirebaseFirestore.FieldPath, opStr: "array-contains", value: ContainsType): EnsureValueExtendsDocumentKey<Collection, string, ContainsType[]> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<FieldPathType extends NestedDocumentKeys<Collection>, ContainsAnyType extends GettableFirestoreDataTypeNoArray>(fieldPath: FieldPathType, opStr: "array-contains-any", value: ContainsAnyType[]): EnsureValueExtendsDocumentKey<Collection, FieldPathType, ContainsAnyType[]> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<ContainsAnyType extends GettableFirestoreDataTypeNoArray>(fieldPath: string | FirebaseFirestore.FieldPath, opStr: "array-contains-any", value: ContainsAnyType[]): EnsureValueExtendsDocumentKey<Collection, string, ContainsAnyType[]> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<FieldPathType extends NestedDocumentKeys<Collection>, CompareType extends GettableFirestoreDataType>(fieldPath: FieldPathType, opStr: "==" | "<=" | ">=" | "<" | ">", value: CompareType): EnsureValueExtendsDocumentKey<Collection, FieldPathType, CompareType> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<CompareType extends GettableFirestoreDataType>(fieldPath: string | FirebaseFirestore.FieldPath, opStr: "==" | "<=" | ">=" | "<" | ">", value: CompareType): EnsureValueExtendsDocumentKey<Collection, string, CompareType> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<FieldPathType extends NestedDocumentKeys<Collection>, CompareType extends GettableFirestoreDataType>(fieldPath: FieldPathType, opStr: "!=", value: CompareType): EnsureDocumentKeyDoesNotExtendValue<Collection, FieldPathType, CompareType> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<CompareType extends GettableFirestoreDataType>(fieldPath: string | FirebaseFirestore.FieldPath, opStr: "!=", value: CompareType): EnsureDocumentKeyDoesNotExtendValue<Collection, string, CompareType> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where<FieldPathType extends NestedDocumentKeys<Collection>>(fieldPath: FieldPathType, opStr: FirebaseFirestore.WhereFilterOp, value: unknown): EnsureDocumentHasKey<Collection, FieldPathType> extends infer R ? R extends GenericFirestoreCollection ? QueryWrapper<R> : never : never;
    /**
     * Creates and returns a new `QueryWrapper` with the additional filter that
     * documents must contain the specified field and that its value should
     * satisfy the relation constraint provided.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created `QueryWrapper`.
     */
    where(fieldPath: string | FirebaseFirestore.FieldPath, opStr: FirebaseFirestore.WhereFilterOp, value: unknown): QueryWrapper<Collection>;
    /**
     * Creates and returns a new `QueryWrapper` that's additionally sorted by the
     * specified field, optionally in descending order instead of ascending.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the order.
     *
     * @param fieldPath The field to sort by.
     * @param directionStr Optional direction to sort by ('asc' or 'desc'). If not
     * specified, order will be ascending.
     * @return The created `QueryWrapper`.
     */
    orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): QueryWrapper<Collection>;
    /**
     * Creates and returns a new `QueryWrapper` that only returns the first
     * matching documents.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the limit.
     *
     * @param limit The maximum number of items to return.
     * @return The created `QueryWrapper`.
     */
    limit(limit: number): QueryWrapper<Collection>;
    /**
     * Creates and returns a new `QueryWrapper` that only returns the last
     * matching documents.
     *
     * You must specify at least one `orderBy` clause for `limitToLast` queries,
     * otherwise an exception will be thrown during execution.
     *
     * Results for `limitToLast` queries cannot be streamed via the `stream()`
     * API.
     *
     * @param limit The maximum number of items to return.
     * @return The created `QueryWrapper`.
     */
    limitToLast(limit: number): QueryWrapper<Collection>;
    /**
     * Specifies the offset of the returned results.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the offset.
     *
     * @param offset The offset to apply to the `QueryWrapper` results.
     * @return The created `QueryWrapper`.
     */
    offset(offset: number): QueryWrapper<Collection>;
    /**
     * Creates and returns a new `QueryWrapper` instance that applies a field mask
     * to the result and returns only the specified subset of fields. You can
     * specify a list of field paths to return, or use an empty list to only
     * return the references of matching documents.
     *
     * Queries that contain field masks cannot be listened to via `onSnapshot()`
     * listeners.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the field mask.
     *
     * @param field The field paths to return.
     * @return The created `QueryWrapper`.
     */
    select<Fields extends NestedDocumentKeys<Collection>>(...field: Fields[]): QueryWrapper<DocumentData>;
    /**
     * Creates and returns a new `QueryWrapper` instance that applies a field mask
     * to the result and returns only the specified subset of fields. You can
     * specify a list of field paths to return, or use an empty list to only
     * return the references of matching documents.
     *
     * Queries that contain field masks cannot be listened to via `onSnapshot()`
     * listeners.
     *
     * This function returns a new (immutable) instance of the `QueryWrapper`
     * (rather than modify the existing instance) to impose the field mask.
     *
     * @param field The field paths to return.
     * @return The created `QueryWrapper`.
     */
    select(...field: (string | FieldPath)[]): QueryWrapper<DocumentData>;
    /**
     * Creates and returns a new `QueryWrapper` that starts at the provided
     * document (inclusive). The starting position is relative to the order of the
     * query. The document must contain all of the fields provided in the orderBy
     * of this query.
     *
     * @param snapshot The snapshot of the document to start after.
     * @return The created `QueryWrapper`.
     */
    startAt(snapshot: DocumentSnapshot): QueryWrapper<Collection>;
}
export default QueryWrapper;
