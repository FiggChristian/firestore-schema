import DocumentWrapper from "./DocumentWrapper";
import QueryWrapper from "./QueryWrapper";
class CollectionWrapper extends QueryWrapper {
  constructor(ref) {
    super(ref);
    this.ref = ref;
  }

  /**
   * Get a `DocumentWrapper` for a randomly-named document within this
   * collection. An automatically-generated unique ID will be used as the
   * document ID.
   *
   * @return The `DocumentWrapper` instance.
   */

  doc(documentName) {
    return typeof documentName === "string" ? new DocumentWrapper(this.ref.doc(documentName)) : new DocumentWrapper(this.ref.doc());
  }

  /**
   * Add a new document to this collection with the specified data, assigning it
   * a document ID automatically.
   *
   * @param data An object containing the data for the new document.
   * @throws Error If the provided input is not a valid Firestore document.
   * @return A Promise resolved with a `DocumentWrapper` pointing to the newly
   *        created document after it has been written to the backend.
   */

  add(data) {
    // Wrap the returned `DocumentReference` in a `DocumentWrapper` after the
    // Promise returns.
    return this.ref.add(data).then(ref => new DocumentWrapper(ref));
  }
}
export default CollectionWrapper;