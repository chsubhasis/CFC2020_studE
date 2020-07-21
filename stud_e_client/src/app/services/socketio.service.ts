import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  public socket;
  constructor() {   }

  /**
   * 
   * @param roomName is a string
   * Setup Socket Connection
   */
  setupSocketConnection(roomName: string) {
    this.socket = io(environment.SOCKET_ENDPOINT);
    const msgData = { roomName };
    this.socket.emit('connection', msgData);
  }
}
