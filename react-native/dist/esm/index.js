import { DOCUMENT_SCHEMA } from "@firestore-schema/core";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import FirestoreWrapper from "./FirestoreWrapper";
import QueryWrapper from "./QueryWrapper";
import TransactionWrapper from "./TransactionWrapper";
import WriteBatchWrapper from "./WriteBatchWrapper";
var withSchema = firestore => {
  return new FirestoreWrapper(firestore);
};
export { CollectionWrapper, DOCUMENT_SCHEMA, DocumentWrapper, FirestoreWrapper, QueryWrapper, TransactionWrapper, withSchema, WriteBatchWrapper };