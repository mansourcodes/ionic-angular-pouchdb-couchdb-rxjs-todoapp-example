import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import PouchDB from 'node_modules/pouchdb';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap, filter, findIndex, find } from 'rxjs/operators';

// import * as PouchDB from 'pouchdb';
// import { PouchDB } from '@types/pouchdb';


export interface Message {
  subject: string;
  _id: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {


  // public messages: Message[] = [
  //   {
  //     subject: 'New event: Trip to Vegas',
  //     date: '9:32 AM',
  //     _id: '123',
  //     read: false
  //   },
  //   {
  //     subject: 'Long time no chat',
  //     date: '6:12 AM',
  //     _id: '33',
  //     read: false
  //   },

  // ];

  private _db;
  private _messages = new BehaviorSubject<Message[]>([]);



  constructor() {
    this._db = new PouchDB('todos');
    var remoteCouch = false;
  }


  get messages() {
    return this._messages.asObservable();
  }

  public fetchMessages() {

    return this.messages.pipe(
      take(1),
      tap(result => {
        return result;
      })
    )

  }

  public getMessageById(id: number): Message {
    return this.messages[id];
  }

  public addMessage(text) {

    var newMessage = {
      _id: new Date().toISOString(),
      subject: text,
      read: false
    };

    return this.messages.pipe(
      take(1),
      tap(result => {
        return this._messages.next([newMessage, ...result]);
      })
    )
  }

  public readMessage(chosenMessage: Message) {


    return this.messages.pipe(
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
      switchMap(() => {
        return this.messages;
      }),
      take(1),
      tap(result => {
        return this._messages.next(result.filter(singleMessage => singleMessage._id !== chosenMessage._id));
      })
    );

  }



}
