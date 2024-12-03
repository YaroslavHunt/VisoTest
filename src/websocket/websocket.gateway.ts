import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server} from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  sendRowUpdate(data: { sheetId: string, values: any[] }) {
    this.server.emit('row-update', data);
  }
}
