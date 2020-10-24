# ionic angular pouchdb & couchdb rxjs todoapp example

## sync offline Pouchdb Database with online CouchDB
I have created this example because I did not found a similar example,
I hope it helps you learn how to create and sync offline Pouchdb Database with online CouchDB

![alt text](https://github.com/mansourcodes/ionic-angular-pouchdb-couchdb-rxjs-todoapp-example/blob/main/src/assets/pouchdb-couchdb.gif?raw=true)



## Installation

clone this project then install the necessary packages, 
```bash
git clone .....
npm install
```

Change the remote couchDB with your link on data.service.ts

```js
    // TODO: replace couchDB 
    this.remoteCouch = 'http://127.0.0.1:5984/todos';
```

that all done.
Now start the ionic server .

```bash
ionic serve
```

## Offline Database with auto-sync 

This project will only example sync offline Pouchdb Database with online CouchDB.

## Next updates

Other project examples will be created with MongoDB to sync the database online to many devices 



## License
[MIT](https://choosealicense.com/licenses/mit/)
