import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';


import { BehaviorSubject, from } from 'rxjs';
import { take, map, tap, delay, switchMap, filter, findIndex, find } from 'rxjs/operators';


import PouchDB from 'node_modules/pouchdb';
import PouchdbFind from 'pouchdb-find';



export interface Message {
  subject: string;
  _id: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private _db;
  private remoteCouch;
  private _messages = new BehaviorSubject<Message[]>([]);



  constructor() {


    PouchDB.plugin(PouchdbFind);

    this._db = new PouchDB('todos');
    this._db.createIndex({
      index: { fields: ['read', '_id'] }
    })


  }


  get messages() {
    return this._messages.asObservable();
  }

  public activeChangeDetect() {
    this._db.changes({
      since: 'now',
      live: true
    }).on(
      'change',
      () => {
        console.log('database changed')
        this.fetchMessages().subscribe();
      }
    );



    // TODO: replace couchDB 
    this.remoteCouch = 'http://127.0.0.1:5984/todos';

    if (this.remoteCouch) {

      //method 1
      var opts = { live: true };
      this._db.sync(this.remoteCouch, opts, console.log('sync error'))
        .on('change', () => console.log('onSyncChange'))
        .on('paused', () => console.log('onSyncPaused'))
        .on('error', () => console.log('onSyncError'));
      console.log('database synced')

      //method 2: this will reduce on replication at the start
      // var opts = { live: true, retry: true };
      // this._db.replicate.from(this.remoteCouch).on('complete', function (info) {
      //   this._db.sync(this.remoteCouch, opts)
      //     .on('change', () => console.log('onSyncChange'))
      //     .on('paused', () => console.log('onSyncPaused'))
      //     .on('error', () => console.log('onSyncError'));
      // }).on('error', () => console.log('onSyncError'));

    }
  }

  public fetchMessages() {

    return this.messages.pipe(
      take(1),
      switchMap(result => {
        return from(
          this._db.find(
            {
              selector: { _id: { $gt: null } },
              include_docs: true,
              sort: [{ '_id': "desc" }]
            }
          )
        );
      }),
      take(1),
      tap((request: any) => {
        console.log('fetchMessages');
        console.log("Total docs = " + request.docs.lenght);
        return this._messages.next([...request.docs]);
      })
    )

  }



  public addMessage(text) {

    var newMessage = {
      _id: new Date().toISOString(),
      subject: text,
      read: false
    };

    return this.messages.pipe(
      take(1),
      switchMap(result => {
        return from(this._db.put(newMessage));
      }),
      switchMap(() => {
        return this._messages;
      }),
      take(1),
      tap(result => {
        return this._messages.next([newMessage, ...result]);
      })
    )
  }

  public readMessage(chosenMessage: Message) {

    return this.messages.pipe(
      take(1),
      switchMap(result => {
        return from(
          this._db.get(chosenMessage._id)
            .then(doc => {
              return this._db.put(
                {
                  ...doc,
                  read: !doc.read,
                })
            })
        );
      }),
      switchMap(() => {
        return this._messages;
      }),
      take(1),
      map(messages => {
        messages.forEach(singleMessage => {
          if (singleMessage._id === chosenMessage._id) {
            singleMessage.read = !singleMessage.read
          }
        })
        return messages;
      }),
      take(1),
      tap(result => {
        return this._messages.next([...result]);
      })
    );


  }



  public deleteMessage(chosenMessage: Message) {

    return this.messages.pipe(
      take(1),
      switchMap(result => {
        return from(
          this._db.get(chosenMessage._id)
            .then(doc => {
              return this._db.remove(doc)
            })
        );
      }),
      switchMap(() => {
        return this._messages;
      }),
      take(1),
      tap(result => {
        return this._messages.next(result.filter(singleMessage => singleMessage._id !== chosenMessage._id));
      })
    );

  }



}
