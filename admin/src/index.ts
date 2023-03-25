import type FirebaseFirestore from "@google-cloud/firestore";
import { DOCUMENT_SCHEMA } from "@firestore-schema/core";
import type {
  GenericFirestoreSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
} from "@firestore-schema/core";
import CollectionGroupWrapper from "./CollectionGroupWrapper";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import FirestoreWrapper from "./FirestoreWrapper";
import QueryWrapper from "./QueryWrapper";
import {
  ReadOnlyTransactionWrapper,
  ReadWriteTransactionWrapper,
} from "./TransactionWrapper";
import WriteBatchWrapper from "./WriteBatchWrapper";

const withSchema = <FirestoreSchema extends GenericFirestoreSchema>(
  firestore: FirebaseFirestore.Firestore
): FirestoreWrapper<FirestoreSchema> => {
  return new FirestoreWrapper<FirestoreSchema>(firestore);
};

export {
  CollectionGroupWrapper,
  CollectionWrapper,
  DOCUMENT_SCHEMA,
  DocumentWrapper,
  GenericFirestoreSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  FirestoreWrapper,
  QueryWrapper,
  ReadOnlyTransactionWrapper,
  ReadWriteTransactionWrapper,
  withSchema,
  WriteBatchWrapper,
};
