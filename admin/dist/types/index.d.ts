import type { Firestore } from "firebase-admin/firestore";
import type { GenericFirestoreSchema, GenericFirestoreCollection, GenericFirestoreDocument } from "./types";
import Path from "./Path";
import DocumentWrapper from "./DocumentWrapper";
import CollectionWrapper from "./CollectionWrapper";
import QueryWrapper from "./QueryWrapper";
export declare const makePath: <FirestoreSchema extends GenericFirestoreSchema>(firestore: Firestore) => Path<FirestoreSchema>;
export declare const path: <FirestoreSchema extends GenericFirestoreSchema>(firestore: Firestore) => Path<FirestoreSchema>;
export { Path, GenericFirestoreSchema, GenericFirestoreCollection, GenericFirestoreDocument, DocumentWrapper, CollectionWrapper, QueryWrapper, };
export default makePath;
