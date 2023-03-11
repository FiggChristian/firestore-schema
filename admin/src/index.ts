import type { Firestore } from "firebase-admin/firestore";
import type {
  DOCUMENT_SCHEMA,
  GenericFirestoreSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
} from "./types";
import CollectionGroupWrapper from "./CollectionGroupWrapper";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import Path from "./Path";
import QueryWrapper from "./QueryWrapper";

const withSchema = <FirestoreSchema extends GenericFirestoreSchema>(
  firestore: Firestore
): Path<FirestoreSchema> => {
  return new Path<FirestoreSchema>(firestore);
};

export {
  CollectionGroupWrapper,
  CollectionWrapper,
  DOCUMENT_SCHEMA,
  DocumentWrapper,
  GenericFirestoreSchema,
  GenericFirestoreCollection,
  GenericFirestoreDocument,
  Path,
  QueryWrapper,
  withSchema,
};

export default withSchema;
