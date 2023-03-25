import { DOCUMENT_SCHEMA } from "@firestore-schema/core";
import CollectionGroupWrapper from "./CollectionGroupWrapper";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import FirestoreWrapper from "./FirestoreWrapper";
import QueryWrapper from "./QueryWrapper";
import { ReadOnlyTransactionWrapper, ReadWriteTransactionWrapper } from "./TransactionWrapper";
import WriteBatchWrapper from "./WriteBatchWrapper";
var withSchema = firestore => {
  return new FirestoreWrapper(firestore);
};
export { CollectionGroupWrapper, CollectionWrapper, DOCUMENT_SCHEMA, DocumentWrapper, FirestoreWrapper, QueryWrapper, ReadOnlyTransactionWrapper, ReadWriteTransactionWrapper, withSchema, WriteBatchWrapper };