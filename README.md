# RecordLibrary

RecordLibrary is an integration of Discogs and Spotify APIs. This sample app lets users find their favorite records from Discogs Library and prelisten to them.

## Setup

Clone this repository in your terminal:

```console
$ git clone https://github.com/Mind1992/RecordLibrary.git
```

Run npm to install all the needed packages:

```console
$ npm install
```
if an error occures run:

```console
$ sudo npm install
```

Make sure you are in the root folder (RecordLibrary) and run this command in order to create env folder:

```console
$ mkdir ./config/env && cd ./config/env
```

Create development.js file inside the env folder:

```console
$ touch development.js
```

Add these lines to development.js file:

**Change db, key and secret values to yours**
```javascript
module.exports = {
  db: 'mongodb://localhost/your-database-name',
  key: 'DiscogsKey',
  secret: 'DiscogsSecret'
};
```

Make sure you are in the root folder (RecordLibrary) and run this command to start your local node server:

```console
$ node server.js
```

## Author
Sergii Mertsalov

## License
MIT
