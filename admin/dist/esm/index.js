import Path from "./Path";
import DocumentWrapper from "./DocumentWrapper";
import CollectionWrapper from "./CollectionWrapper";
import QueryWrapper from "./QueryWrapper";
export var makePath = firestore => {
  return new Path(firestore);
};
export var path = makePath;
export { Path, DocumentWrapper, CollectionWrapper, QueryWrapper };
export default makePath;