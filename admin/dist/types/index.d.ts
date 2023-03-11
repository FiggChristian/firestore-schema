import type { Firestore } from "firebase-admin/firestore";
import type { DOCUMENT_SCHEMA, GenericFirestoreSchema, GenericFirestoreCollection, GenericFirestoreDocument } from "./types";
import Path from "./Path";
import DocumentWrapper from "./DocumentWrapper";
import CollectionWrapper from "./CollectionWrapper";
import QueryWrapper from "./QueryWrapper";
export declare const makePath: <FirestoreSchema extends GenericFirestoreSchema>(firestore: Firestore) => Path<FirestoreSchema>;
export declare const path: <FirestoreSchema extends GenericFirestoreSchema>(firestore: Firestore) => Path<FirestoreSchema>;
export { CollectionWrapper, DOCUMENT_SCHEMA, DocumentWrapper, GenericFirestoreSchema, GenericFirestoreCollection, GenericFirestoreDocument, Path, QueryWrapper, };
export default makePath;
