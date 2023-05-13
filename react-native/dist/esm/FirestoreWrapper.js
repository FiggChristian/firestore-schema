import "core-js/modules/es.symbol.description.js";
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import CollectionWrapper from "./CollectionWrapper";
import DocumentWrapper from "./DocumentWrapper";
import TransactionWrapper from "./TransactionWrapper";
import WriteBatchWrapper from "./WriteBatchWrapper";
import QueryWrapper from "./QueryWrapper";
/**
 * A typed wrapper class around your
 * {@link FirebaseFirestore.Firestore `Firestore`} instance.
 *
 * This class can be instantiated manually via its constructor, or using the
 * `withSchema` function.
 *
 * ```ts
 * type Schema = {
 *   // Define your Firestore schema here
 * }
 *
 * const firestore = new FirestoreWrapper<Schema>(unwrappedFirestore);
 * // or
 * const firestore = withSchema<Schema>(unwrappedFirestore);
 * ```
 *
 * It includes the same methods as the underlying `Firestore` object with the
 * same behavior so that it can be used interchangeably. It also includes the
 * following additional properties and methods:
 *
 * Properties:
 * - {@link firestore `firestore`}
 *
 * Methods:
 * - {@link castToSchema `castToSchema`}
 */
class FirestoreWrapper {
  /** The Firestore object that was used to create the `FirestoreWrapper`. */

  /**
   * Creates a typed `FirestoreWrapper` object around the specified `Firestore`
   * object.
   *
   * @param firestore The `Firestore` object to wrap.
   */
  constructor(firestore) {
    _defineProperty(this, "firestore", void 0);
    this.firestore = firestore;
  }

  /**
   * Casts an object to the specified schema as determined by the path to the
   * document/collection.
   *
   * You can pass the path to the document/collection as a TypeScript generic
   * value or as a JavaScript string value (see example below for more
   * information).
   *
   * You can specify "wildcard" values by surrounding one of the path segments
   * in `{` braces `}`. This will match the schema of *all*
   * documents/collections at that path segment.
   *
   * Note that this method will cast any object to the specified schema, even if
   * the object doesn't satisfy the actual schema type. The function does not
   * verify that the object actually *should* be cast. Use it only when you know
   * for sure that the underlying object is of the specified schema type or you
   * may introduce type-related bugs into your code.
   *
   * @example
   * ```ts
   * type ExampleSchema = {
   *   users: {
   *     [uid: string]: {
   *       [DOCUMENT_SCHEMA]: UserDataType;
   *     }
   *   },
   *   posts: {
   *     specificPostID: {
   *       [DOCUMENT_SCHEMA]: SomePostDataType;
   *     }
   *   }
   * }
   * const firestore = withSchema<ExampleSchema>(unwrappedFirestore);
   *
   * ( ... ).get((documentSnapshot) => {
   *   // Makes `dataAsUser` have type `UserDataType`. This passes the
   *   // schema path as a TypeScript generic.
   *   const dataAsUser = firestore.castToSchema<"users/{uid}">(
   *     documentSnapshot.data()
   *   );
   *
   *   // Makes `dataAsPost` have type `SomePostDataType`. This passes
   *   // the schema path as a JavaScript value instead of as a
   *   // TypeScript generic.
   *   const dataAsPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "posts/specificPostID"
   *   );
   *
   *   // Makes `dataAsUserOrPost` have type `UserDataType |
   *   // SomePostDataType`. This happens because
   *   // `{any collection}/specificPostID` matches both
   *   // `users/specificPostID` and `posts/specificPostID`.
   *   // Even though `specificPostID` is unlikely to match a
   *   // user ID, it's still a valid schema path to a possible
   *   // document, and the type should be narrowed if
   *   // necessary.
   *   const dataAsUserOrPost = firestore.castToSchema(
   *     documentSnapshot.data(),
   *     "{any collection}/specificPostID"
   *   );
   * });
   * ```
   *
   * @param value The object to cast to the specified schema.
   * @param optionalPath A path to the collection or document from the root of
   * the database whose schema will be used for casting the value.
   * @returns The passed-in `value`, cast to the specified schema.
   */

  castToSchema(value) {
    // Remove any `withConverter`s that have been applied to this object since
    // the returned object will be case to the specified schema, not to whatever
    // the previous converter was.
    if (typeof value === "object" && value != null && "withConverter" in value && typeof value.withConverter === "function") {
      value.withConverter(null);
    }

    // Nothing else special happens to the object; it's just cast for
    // TypeScript's sake.
    return value;
  }

  /** The current `FirebaseApp` instance for this Firebase service. */
  get app() {
    return this.firestore.app;
  }

  /**
   * Creates a write batch, used for performing multiple writes as a single
   * atomic operation. The maximum number of writes allowed in a single
   * WriteBatch is 500, but note that each usage of
   * `FieldValue.serverTimestamp()`, `FieldValue.arrayUnion()`,
   * `FieldValue.arrayRemove()`, or `FieldValue.increment()` inside a WriteBatch
   * counts as an additional write.
   *
   * @example
   * ```ts
   * const batch = firestore.batch();
   * batch.delete(...);
   * ```
   */
  batch() {
    return new WriteBatchWrapper(this.firestore.batch());
  }

  /**
   * Gets a `CollectionWrapper` instance that refers to the collection at the
   * specified path.
   *
   * @example
   * ```ts
   * firestore.collection("users");
   * firestore.collection("users/userID/posts");
   * firestore.collection("users", "userID", "posts");
   * ```
   *
   * @param collectionPath A slash-separated path to a collection.
   * @returns The `CollectionWrapper` instance.
   */

  collection(collectionPath) {
    for (var _len = arguments.length, additionalSegments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      additionalSegments[_key - 1] = arguments[_key];
    }
    if (additionalSegments.length > 0) {
      if (additionalSegments.length % 2 === 1) {
        // The total number of path segments (counting `collectionPath`) is
        // even. For a collection, the number of path segments must be odd.
        throw new TypeError("Number of segments for a collection must be odd.");
      }
      var lastCollectionRef = this.firestore.collection(collectionPath);
      var lastDocRef;
      for (var i = 0; i < additionalSegments.length; i++) {
        if (i % 2 === 0) {
          lastDocRef = lastCollectionRef.doc(additionalSegments[i]);
        } else {
          lastCollectionRef = lastDocRef.collection(additionalSegments[i]);
        }
      }
      return new CollectionWrapper(lastCollectionRef);
    } else {
      return new CollectionWrapper(this.firestore.collection(collectionPath));
    }
  }

  /**
   * Creates and returns a new `QueryWrapper` that includes all documents in the
   * database that are contained in a collection or subcollection with the given
   * `collectionId`.
   *
   * @example
   * ```ts
   * firestore.collectionGroup('orders');
   * ```
   *
   * @param collectionId Identifies the collections to query over. Every
   * collection or subcollection with this ID as the last segment of its path
   * will be included. Cannot contain a slash.
   * @returns The `QueryWrapper` instance.
   */

  collectionGroup(collectionId) {
    return new QueryWrapper(this.firestore.collectionGroup(collectionId));
  }

  /**
   * Disables network usage for this instance. It can be re-enabled via
   * `enableNetwork()`. While the network is disabled, any snapshot listeners or
   * `get()` calls will return results from cache, and any write operations will
   * be queued until the network is restored.
   *
   * Returns a promise that is resolved once the network has been disabled.
   *
   * @example
   * ```ts
   * await firestore.disableNetwork();
   * ```
   */
  disableNetwork() {
    return this.firestore.disableNetwork();
  }

  /**
   * Gets a `DocumentWrapper` instance that refers to the document at the
   * specified path.
   *
   * @example
   * ```ts
   * path.doc("users/userID");
   * path.collection("users", "userID");
   * ```
   *
   * @param documentPath A slash-separated path to a document.
   * @returns The `DocumentWrapper` instance.
   */

  doc(docPath) {
    for (var _len2 = arguments.length, additionalSegments = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      additionalSegments[_key2 - 1] = arguments[_key2];
    }
    if (additionalSegments.length > 0) {
      if (additionalSegments.length % 2 === 0) {
        // The total number of path segments (counting `docPath`) is odd. For a
        // document, the number of path segments must be even.
        throw new TypeError("Number of segments for a document must be even.");
      }
      var lastCollectionRef = this.firestore.collection(docPath);
      var lastDocRef;
      for (var i = 0; i < additionalSegments.length; i++) {
        if (i % 2 === 0) {
          lastDocRef = lastCollectionRef.doc(additionalSegments[i]);
        } else {
          lastCollectionRef = lastDocRef.collection(additionalSegments[i]);
        }
      }
      return new DocumentWrapper(lastDocRef);
    } else {
      return new DocumentWrapper(this.firestore.doc(docPath));
    }
  }

  /**
   * Re-enables use of the network for this Firestore instance after a prior call to `disableNetwork()`.
   *
   * @example
   * ```ts
   * await firestore.enableNetwork();
   * ```
   */
  enableNetwork() {
    return this.firestore.enableNetwork();
  }

  /**
   * Executes the given `updateFunction` and then attempts to commit the changes
   * applied within the transaction. If any document read within the transaction
   * has changed, Cloud Firestore retries the `updateFunction`. If it fails to
   * commit after 5 attempts, the transaction fails.
   *
   * The maximum number of writes allowed in a single transaction is 500, but
   * note that each usage of `FieldValue.serverTimestamp()`,
   * `FieldValue.arrayUnion()`, `FieldValue.arrayRemove()`, or
   * `FieldValue.increment()` inside a transaction counts as an additional
   * write.
   *
   * @example
   * ```ts
   * const cityRef = firestore.doc('cities/SF');
   *
   * await firestore.runTransaction(async (transaction) => {
   *   const snapshot = await transaction.get(cityRef);
   *   await transaction.update(cityRef, {
   *     population: snapshot.data().population + 1,
   *   });
   * });
   * ```
   */
  runTransaction(updateFunction) {
    return this.firestore.runTransaction(transaction => updateFunction(new TransactionWrapper(transaction)));
  }

  /**
   * Specifies custom settings to be used to configure the Firestore instance.
   * Must be set before invoking any other methods.
   *
   * @example
   * ```ts
   * const settings = {
   *   cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
   * };
   *
   * await firestore.settings(settings);
   * ```
   *
   * @param settings A `Settings` object.
   */
  settings(settings) {
    return this.firestore.settings(settings);
  }

  /**
   * Loads a Firestore bundle into the local cache.
   *
   * @example
   * ```ts
   * const resp = await fetch('/createBundle');
   * const bundleString = await resp.text();
   * await firestore.loadBundle(bundleString);
   * ```
   */
  loadBundle(bundle) {
    return this.firestore.loadBundle(bundle);
  }

  /**
   * Reads a Firestore Query from local cache, identified by the given name.
   *
   * @example
   * ```ts
   * const query = firestore.namedQuery('latest-stories-query');
   * const storiesSnap = await query.get({ source: 'cache' });
   * ```
   */

  namedQuery(name) {
    return new QueryWrapper(this.firestore.namedQuery(name));
  }

  /**
   * Aimed primarily at clearing up any data cached from running tests. Needs to
   * be executed before any database calls are made.
   *
   * @example
   *```ts
   * await firestore.clearPersistence();
   * ```
   */
  clearPersistence() {
    return this.firestore.clearPersistence();
  }

  /**
   * Waits until all currently pending writes for the active user have been
   * acknowledged by the backend.
   *
   * The returned Promise resolves immediately if there are no outstanding
   * writes. Otherwise, the Promise waits for all previously issued writes
   * (including those written in a previous app session), but it does not wait
   * for writes that were added after the method is called. If you want to wait
   * for additional writes, call `waitForPendingWrites()` again.
   *
   * Any outstanding `waitForPendingWrites()` Promises are rejected when the
   * logged-in user changes.
   *
   * @example
   *```ts
   * await firestore.waitForPendingWrites();
   * ```
   */
  waitForPendingWrites() {
    return this.firestore.waitForPendingWrites();
  }

  /**
   * Typically called to ensure a new Firestore instance is initialized before
   * calling `firestore.clearPersistence()`.
   *
   * @example
   *```ts
   * await firestore.terminate();
   * ```
   */
  terminate() {
    return this.firestore.terminate();
  }

  /**
   * Modify this Firestore instance to communicate with the Firebase Firestore
   * emulator. This must be called before any other calls to Firebase Firestore
   * to take effect. Do not use with production credentials as emulator traffic
   * is not encrypted.
   *
   * Note: on android, hosts 'localhost' and '127.0.0.1' are automatically
   * remapped to '10.0.2.2' (the "host" computer IP address for android
   * emulators) to make the standard development experience easy. If you want to
   * use the emulator on a real android device, you will need to specify the
   * actual host computer IP address.
   *
   * @param host emulator host (eg, 'localhost')
   * @param port emulator port (eg, 8080)
   */
  useEmulator(host, port) {
    return this.firestore.useEmulator(host, port);
  }
}
export default FirestoreWrapper;