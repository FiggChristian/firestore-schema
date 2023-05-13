# firestore-schema

## Enforce schema types on your Firestore database.

This is an npm package for defining and enforcing a schema on your Firestore
database in your JavaScript/TypeScript code. This package gives your Firestore
collections and documents more specific types that let you write safer code for
interacting with your Firestore database.

## Installation

Firestore comes in multiple variations. Depending on which variation of
Firestore you're using, you'll want to use one of the following packages:

- [`@firestore-schema/admin`](./admin#readme) &ndash; if you're using
  [`@google-cloud/firestore`](https://www.npmjs.com/package/@google-cloud/firestore)
  or [`firebase-admin`](https://www.npmjs.com/package/firebase-admin). If you're
  code is running on a NodeJS server (e.g. a Cloud Function) or any other
  privileged environment, this is probably what you're using.
- [`@firestore-schema/react-native`](./react-native#readme) &ndash; if you're
  using
  [`@react-native-firebase/firestore`](https://www.npmjs.com/package/@react-native-firebase/firestore).
  If you're writing a React Native app, you'll either be using this package or
  the regular web SDK ([`firebase`](https://www.npmjs.com/package/firebase)).
  Check your dependencies in `package.json` to find out which.
- [Coming soon] `@firestore-schema/web` &ndash; if you're using the
  [`firebase`](https://www.npmjs.com/package/firebase) package. If you're
  building a website or a React Native app using [Expo
  Go](https://expo.dev/client), this is probably what you're using.

> You can find more information about which package you should use in [this
> short
> guide](https://github.com/FiggChristian/firestore-schema/blob/docs/Which-package-should-you-use.md).

Reference each package's README using the links above for more specific
installation instructions.

## Usage

You can define your database schema using a TypeScript type, and then wrap your
Firestore instance using the `withSchema` function to add your schema's type
information to your Firestore instance. After that, you're able to use Firestore
in the same way you normally would; the library will automatically handle all
the necessary type information for you. For more information, reference the
README for the package you're using:

- [@firestore-schema/admin](https://github.com/FiggChristian/firestore-schema/blob/admin/README.md)
- [@firestore-schema/react-native](https://github.com/FiggChristian/firestore-schema/blob/react-native/README.md)
- [Coming soon] @firestore-schema/web
