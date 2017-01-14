import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class MediatorService {
  private _messages: Subject<Message> = new Subject<Message>();

  /**
   * Provides access to subscribe for new messages.
   */
  public get messages() {
    return this._messages.asObservable();
  }

  /**
   * Sends a message to all subscribers
   */
  public broadcast(msg: Message): void {
    this._messages.next(msg);
  }
}

/**
 * Represents a message to be delivered
 */
export class Message {
  public type: MessageType;
  public value: any;

  constructor(t: MessageType, v?: any) {
    this.type = t;
    this.value = v;
  }
}

export enum MessageType {
  ShowError,
  ShowSuccess,
  BusyStart,
  BusyEnd
}