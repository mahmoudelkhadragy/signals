import { Component, inject, Signal } from '@angular/core';
import { MessagesService } from './messages.service';
import { NgClass } from '@angular/common';
import { Message } from '../models/message.model';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [NgClass],
})
export class MessagesComponent {
  messagesService = inject(MessagesService);

  message: Signal<Message | null> = this.messagesService.message;

  onClose() {
    this.messagesService.clear();
  }
}
