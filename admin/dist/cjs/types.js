"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOCUMENT_SCHEMA = void 0;
/**
 * A Symbol used for accessing the schema of documents in the database. Each
 * document is an object that can hold nested collections as keys, so the
 * document's schema must be accessed via this special Symbol.
 */
const DOCUMENT_SCHEMA = Symbol.for("DOCUMENT_SCHEMA");
/**
 * A Symbol used for accessing the schema of documents in the database. Each
 * document is an object that can hold nested collections as keys, so the
 * document's schema must be accessed via this special Symbol.
 */
exports.DOCUMENT_SCHEMA = DOCUMENT_SCHEMA;