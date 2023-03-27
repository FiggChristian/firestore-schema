# Which package should you use?

Since Firestore has a few libraries, all with slightly different APIs, types,
and use cases, you'll need to use the appropriate `@firestore-schema/*` package
for the library you're using. Generally, you can look at your `package.json`
file for one of the packages listed below. Depending on which package (on the
left) you're using to access Firestore, you'll want to use the corresponding
package (on the right).

<table>
  <thead>
    <tr>
      <th align="center">Firestore Library</th>
      <th align="center"><code>@firestore-schema/*</code> Package</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>@google-cloud/firestore</code></td>
      <td rowspan="2"><a href="https://npmjs.com/package/@firestore-schema/admin"><code>@firestore-schema/admin</code></a></td>
    </tr>
    <tr>
      <td><code>firebase-admin</code></td>
      <!-- <td rowspan="2"><a href="https://npmjs.com/package/@firestore-schema/admin"><code>@firestore-schema/admin</code></a></td> -->
    </tr>
    <tr>
      <td><code>@react-native-firebase/firestore</code></td>
      <td><code>@firestore-schema/react-native</code> [Coming soon]</td>
    </tr>
    <tr>
      <td><code>firebase</code></td>
      <td><code>@firestore-schema/web</code> [Coming soon]</td>
    </tr>
  </tbody>
</table>