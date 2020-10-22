import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../services/data.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;
  @Output() deleteEvent = new EventEmitter();
  @Output() readEvent = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  deleteThis() {
    this.deleteEvent.emit();
  }
  readThis() {
    this.readEvent.emit();
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
