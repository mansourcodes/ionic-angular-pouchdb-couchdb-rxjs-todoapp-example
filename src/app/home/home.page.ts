import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private data: DataService, private changeDetector: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.subMessages = this.data.messages.subscribe(messages => {
      this.loadedMessages = messages;
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.subMessages) {
      this.subMessages.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.data.fetchMessages().subscribe(() => {
      this.data.activeChangeDetect()
    });
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
