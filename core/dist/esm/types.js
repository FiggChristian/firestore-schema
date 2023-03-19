import "core-js/modules/es.symbol.description.js";
/** Extracts the string keys from an object. */

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

/** If `T` is `never`, returns `Default`. Otherwise, returns `T`. */

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

/**
 * A Symbol used for accessing/defining the schema of documents in the database.
 * Each document is an object that can hold nested collections as keys, so the
 * document's schema must be accessed/defined via this special Symbol.
 */
export var DOCUMENT_SCHEMA = Symbol.for("DOCUMENT_SCHEMA");
/**
 * A Symbol used for accessing/defining the schema of documents in the database.
 * Each document is an object that can hold nested collections as keys, so the
 * document's schema must be accessed/defined via this special Symbol.
 */