import CollectionGroupWrapper from "./CollectionGroupWrapper";
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import Path from "./Path";
import QueryWrapper from "./QueryWrapper";
var withSchema = firestore => {
  return new Path(firestore);
};
export { CollectionGroupWrapper, CollectionWrapper, DocumentWrapper, Path, QueryWrapper, withSchema };
export default withSchema;