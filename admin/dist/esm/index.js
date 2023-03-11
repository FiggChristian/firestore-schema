import Path from "./Path";
import DocumentWrapper from "./DocumentWrapper";
import CollectionWrapper from "./CollectionWrapper";
import QueryWrapper from "./QueryWrapper";
export var makePath = firestore => {
  return new Path(firestore);
};
export var path = makePath;
export { CollectionWrapper, DocumentWrapper, Path, QueryWrapper };
export default makePath;