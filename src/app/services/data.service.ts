import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

export interface Message {
  subject: string;
  date: string;
  id: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public messages: Message[] = [
    {
      subject: 'New event: Trip to Vegas',
      date: '9:32 AM',
      id: 0,
      read: false
    },
    {
      subject: 'Long time no chat',
      date: '6:12 AM',
      id: 1,
      read: false
    },

  ];

  constructor() { }

  public getMessages(): Message[] {
    return this.messages;
  }

  public getMessageById(id: number): Message {
    return this.messages[id];
  }

  public add(subject: string) {

    this.messages = [
      {
        subject: subject,
        date: new DatePipe('en-US').transform(new Date(), 'shortTime'),
        id: this.messages.length + 1,
        read: false
      }, ...this.messages];


    console.log(this.messages);

  }
}
