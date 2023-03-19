# firestore-schema

## Enforce schema types on your Firestore database.

This is an npm package for defining and enforcing a schema on your Firestore
database in your JavaScript/TypeScript code. This package gives your collections
and documents more specific types that let you write safer code for interacting
with your Firestore database.

### Installation

Firestore comes in multiple flavors. Depending on which version of Firestore
you're using, you'll want to use one of the following packages:

- [@firestore-schema/admin](./tree/main/admin#readme) &ndash; if you're using
  [`@google-cloud/firestore`](https://www.npmjs.com/package/@google-cloud/firestore)
  or [`firebase-admin`](https://www.npmjs.com/package/firebase-admin) (which
  uses `@google-cloud/firestore` under the hood). If you're code is running on a
  NodeJS server (e.g. a Cloud Function) or any other privileged environment,
  this is probably what you're using.
- [Coming soon] @firestore-schema/react-native &ndash; if you're using
  [`@react-native-firebase/firestore`](https://www.npmjs.com/package/@react-native-firebase/firestore).
  If you're writing a React Native app, you'll either be using this package or
  the regular web SDK ([`firebase`](https://www.npmjs.com/package/firebase)).
  Check your dependencies in `package.json` to find out which.
- [Coming soon] @firestore-schema/web &ndash; if you're using the
  [`firebase`](https://www.npmjs.com/package/firebase) package. If you're
  building a website or a React Native app using [Expo
  Go](https://expo.dev/client), this is probably what you're using.

Reference each package's README using the links above for more specific
installation instructions.

### Usage

There are two steps for using the library: defining your schema as a TypeScript
type, and then pass that schema to the API's wrapper function to give your
Firestore instance all the necessary types.

#### Defining Your Schema

In a new TypeScript `.ts` file, declare and export a new type that matches the
following general structure:

```typescript
import { DOCUMENT_SCHEMA } from '@firestore-schema/whatever-package-you-installed';
// or
const { DOCUMENT_SCHEMA } = require('@firestore-schema/whatever-package-you-installed');

type Schema = {
  // The top-level nesting contains collection names:
  topLevelCollectionName: {
    // The nest level of nesting contains document names:
    documentName: {
      // Each document contains a [DOCUMENT_SCHEMA] key corresponding to the schema of that document.
      // Here's the schema of the document at 'topLevelCollectionName/documentName':
      [DOCUMENT_SCHEMA]: {
        someKeyInYourDocument: string;
        anotherKey: number;
      }
    }
  },
  // You can define multiple top-level collections:
  anotherTopLevelCollectionName: {
    // Use [key: string] to target all documents in a collection:
    [documentName: string]: {
      // Here's the schema of *all* documents in the 'anotherTopLevelCollectionName' collection:
      [DOCUMENT_SCHEMA]: {
        someKeyInAllDocumentsInThisCollection: boolean;
        anotherKey: boolean;
      }
    }
  },
  yetAnotherCollectionName: {
    [documentName: string]: {
      [DOCUMENT_SCHEMA]: { /* Document schema here */ },
      // Each document can also include nested collection names; this matches the sub-collection in
      // 'yetAnotherCollectionName/{any document}/nestedCollectionName'.
      nestedCollectionName: {
        nestedDocumentName: {
          // Here's the schema of
          // 'yetAnotherCollectionName/{any document}/nestedCollectionName/nestedDocumentName':
          [DOCUMENT_SCHEMA]: { /* Document schema here */ },
          eventMoreNestedSubCollectionsIfYouWant: { /* More documents here */ }
        }
      }
    }
  }
}
```

In general, you specify each collection at the top level, then all the documents
inside that collection as either a static name (e.g., `documentName` or
`nestedDocumentName` in the example above) or *all* documents using `[key:
string]` to match all document IDs. Each document requires a `[DOCUMENT_SCHEMA]`
key that points to the schema of that document, and can optionally include more
sub-collection names as other keys, each of which points to another collection
with its own set of documents.

The `DOCUMENT_SCHEMA` type is an exported member of the `@firestore-schema/*`
package you're using, and is required for specifying each document's schema.

#### Using Your Schema

Once you've defined your schema, you can pass it to `withSchema` (an exported
function of the package you're using) to get a typed wrapper around your
Firestore instance:

```typescript
const typedFirestore = withSchema<Schema>(firestore);
```

You can find more specific instructions for using the library in the associated
package's README:

- [@firestore-schema/admin README](./tree/main/admin#readme)
- [Coming soon] @firestore-schema/react-native README
- [Coming soon] @firestore-schema/web README
