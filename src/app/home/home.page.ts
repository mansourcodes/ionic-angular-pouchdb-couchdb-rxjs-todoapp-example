import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService, Message } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  newSubject: string;
  loadedMessages: Message[];
  private subMessages: Subscription;

  constructor(private data: DataService) { }


  ngOnInit() {
    this.subMessages = this.data.messages.subscribe(messages => {
      this.loadedMessages = messages;
    });
  }

  ngOnDestroy() {
    if (this.subMessages) {
      this.subMessages.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.data.fetchMessages().subscribe();
  }

  addMessage() {
    this.data.addMessage(this.newSubject).subscribe();
    this.newSubject = '';
  }

  readMessage(message: Message) {
    this.data.readMessage(message).subscribe();
  }

  deleteMessage(message: Message) {
    this.data.deleteMessage(message).subscribe();
  }

}
