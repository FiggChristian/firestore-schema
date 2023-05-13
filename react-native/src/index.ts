import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { DOCUMENT_SCHEMA } from "@firestore-schema/core";
import type {
  GenericFirestoreSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
} from "@firestore-schema/core";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import FirestoreWrapper from "./FirestoreWrapper";
import QueryWrapper from "./QueryWrapper";
import TransactionWrapper from "./TransactionWrapper";
import WriteBatchWrapper from "./WriteBatchWrapper";

const withSchema = <FirestoreSchema extends GenericFirestoreSchema>(
  firestore: FirebaseFirestoreTypes.Module
): FirestoreWrapper<FirestoreSchema> => {
  return new FirestoreWrapper<FirestoreSchema>(firestore);
};

export {
  CollectionWrapper,
  DOCUMENT_SCHEMA,
  DocumentWrapper,
  GenericFirestoreSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  FirestoreWrapper,
  QueryWrapper,
  TransactionWrapper,
  withSchema,
  WriteBatchWrapper,
};
