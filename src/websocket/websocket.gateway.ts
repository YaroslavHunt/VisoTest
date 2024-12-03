import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit {
  @WebSocketServer()
  private server: Server;

  afterInit() {
    console.log('WebSocket server initialized');
  }

  sendRowUpdate(data: any) {
    console.log('Sending row update via WebSocket:', data);
    this.server.emit('rowUpdate', data);
  }
}
