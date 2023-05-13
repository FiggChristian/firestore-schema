# @firestore-schema/react-native

## Enforce schema types on your Firestore database.

[![npm version](https://img.shields.io/npm/v/@firestore-schema/react-native.svg)](https://www.npmjs.org/package/@firestore-schema/react-native)

This is an npm package for defining and enforcing a schema on your Firestore
database in your JavaScript/TypeScript code. This package gives your collections
and documents more specific types that let you write safer code for interacting
with your Firestore database.

> This package is a plugin for the
> [`@react-native-firebase/firestore`](https://www.npmjs.com/package/@react-native-firebase/firestore)
> package. If you're using another package to access Firestore, you can [find
> the appropriate `@firestore-schema/*` package
> here](https://github.com/FiggChristian/firestore-schema/blob/main/docs/Which-package-should-you-use.md).

## Installation

```bash
npm install @firestore-schema/react-native
```

## Usage

There are two steps to use this package: defining your Firestore schema, and
passing that type information to your Firestore instance.

### Defining Your Schema

In a new TypeScript `.ts` file, declare and export a new type that matches the
following general structure (but that reflects your actual database schema):

```typescript
import { DOCUMENT_SCHEMA } from '@firestore-schema/react-native';

type Schema = {
  // The top-level nesting contains collection names:
  topLevelCollectionName: {
    // The next level of nesting contains individual document names:
    documentName: {
      // Each document contains a [DOCUMENT_SCHEMA] key corresponding to the schema of that document.
      // Here's the schema of the document at 'topLevelCollectionName/documentName':
      [DOCUMENT_SCHEMA]: {
        someKeyInYourDocument: string;
        anotherKey: number;
      }
    }
  },
  // You can define multiple top-level collections like this one:
  anotherTopLevelCollectionName: {
    // Use [key: string] to target *all* documents in a collection (regardless of exact name):
    [documentName: string]: {
      // Here's the schema of *all* documents in the 'anotherTopLevelCollectionName' collection:
      [DOCUMENT_SCHEMA]: {
        someKeyInAllDocumentsInThisCollection: boolean;
        anotherKey: Date;
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
          evenMoreNestedSubCollectionsIfYouWant: { /* More documents here */ }
        }
      }
    }
  }
}
```

You can [read more about defining your Firestore schema properly
here](https://github.com/FiggChristian/firestore-schema/blob/main/docs/Defining-your-schema.md),
including examples and more specific information.

### Using Your Schema

Once you've defined your Firestore schema, you can wrap your Firestore instance
using the `withSchema` function, passing the schema type information with it:

```typescript
import { withSchema } from '@firestore-schema/react-native';

// Pass your schema as a generic to the withSchema function as below:
const firestore = withSchema<Schema>(new Firestore());
```

From there, you can use `firestore` as you normally would. The library
automatically wraps the underlying `Firestore` instance with a type-aware
wrapper class that handles all the type information stored in your schema.

## Example

```typescript
import untypedFirestore from '@react-native-firebase/firestore';
import { DOCUMENT_SCHEMA, withSchema } from '@firestore-schema/react-native';

type Schema = {
  users: {
    // This collection has many documents (one per user). Each user document has
    // the schema below:
    [userID: string]: {
      [DOCUMENT_SCHEMA]: {
        username: string;
        name: string;
        birthDate: Date;
      },
      // Separate sub-collection in each user document with private user information:
      privateData: {
        // This collection only has one document with the exact name below:
        additionalProfileInfo: {
          [DOCUMENT_SCHEMA]: {
            favoriteColor: string;
            favoriteNumber: number;
          }
        }
      }
    }
  },
  posts: {
    [postID: string]: {
      [DOCUMENT_SCHEMA]: {
        title: string;
        content: string;
        createdAt: Date;
      }
    }
  }
}

// Wrap the original Firestore instance with the schema type information:
const firestore = withSchema<Schema>(untypedFirestore());

const userID: string = getSomeUserIDSomehow();
const postID: string = getSomePostIDSomehow();

// Retrieve a document using individual path segments:
const userInfoDoc = firestore.doc("users", userID);
// Or a slash-separated path:
const postDoc = firestore.doc(`posts/${postID}`);
// Or by building off existing document/collection references individually:
const userPrivateDataDoc = userInfoDoc.collection("privateData").doc("additionalProfileInfo");

userInfoDoc.get().then((snapshot) => {
  const data = snapshot.data()!;
  data.username; // string
  data.name; // string
  data.birthDate; // Firestore.Timestamp, since that's what Firestore uses for Dates
});

postDoc.get().then((snapshot) => {
  const data = snapshot.data()!;
  data.title; // string
  data.contents; // TypeScript Error: 'contents' does not exist. Did you mean 'content'?
});

userPrivateDataDoc.set({
  favoriteColor: "blue",
  favoriteNumber: "forty-two", // TypeScript Error: string is not assignable to number.
  createdAt: Timestamp.now() // Timestamp is able to be coerced to Date automatically.
});
```

The example above illustrates a basic usage of the package. Some things to note:
1. All the type information is declared in one place (your `Schema`). No need to
   use converters or a bunch of TypeScript assertions; your collections and
   documents are 100% automatically type-aware everywhere you use `firestore` to
   interact with your database. This makes it super easy to alter your database
   schema in the future all from one place.
2. TypeScript will automatically warn you when you try to deviate from your
   expected schema. `data.contents` is pretty close to what you actually meant
   (`data.content`). Without the package, it'd be hard to catch this bug until
   runtime when what you thought was a string is actually returning `undefined`.
3. TypeScript will also warn you when you try to write the wrong type. Without
   the package, Firestore would happily let you write a string in place of a
   number. If this isn't caught in time, you might end up with a large chunk of
   your database now containing the wrong type of data.
4. The package is aware of the fact that some types are translatable to other
   types. Even though the schema defines `users/{userID}.birthDate` as a `Date`,
   when you `get` the document, the type is correctly changed to a Firestore
   `Timestamp` since that's what Firestore uses to represent timestamps (and
   what the actual type is at runtime). Even though `posts/{postID}.createdAt`
   is a `Date` in the schema, you can `set` either a `Date` or a `Timestamp`
   object since Firestore is able to convert `Date`s to `Timestamp`s
   automatically.
