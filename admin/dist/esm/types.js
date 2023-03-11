import "core-js/modules/es.symbol.description.js";
/**
 * A Symbol used for accessing the schema of documents in the database. Each
 * document is an object that can hold nested collections as keys, so the
 * document's schema must be accessed via this special Symbol.
 */
export var DOCUMENT_SCHEMA = Symbol.for("DOCUMENT_SCHEMA");
/**
 * A Symbol used for accessing the schema of documents in the database. Each
 * document is an object that can hold nested collections as keys, so the
 * document's schema must be accessed via this special Symbol.
 */