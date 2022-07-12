import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway,WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { editOR, payloadEditOr } from '../interface/EditOR';

@WebSocketGateway({ cors: true })
export class EditOrGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  constructor(){}

  public editOR : editOR [] = []
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
 

  @SubscribeMessage('reservationItem')
  async onChat(client: Socket, payload: payloadEditOr) {
    let index = this.editOR.findIndex((element) => element.clientId == client.id);
    if(index != -1) {
      this.editOR.splice(index,1);
    }
    this.editOR.push({
      clientId : client.id,
      idObjetRepere : payload.idObjetRepere,
      login : payload.login
    })
    
    this.server.emit('broadcastReservation', this.editOR);
    // client.broadcast.emit('broadcastReservation', this.editOR);
  }

  afterInit(server: Server) {
   this.logger.log('Init');
  }
 
  handleDisconnect(client: Socket) {
    let index = this.editOR.findIndex((element) => element.clientId == client.id);
    if(index != -1) {
      this.editOR.splice(index,1);
    }
    
    this.server.emit('broadcastReservation', this.editOR);
  }
 
  handleConnection(client: Socket, ...args: any[]) {
    client.emit("sendReservationOR", this.editOR)
  }
}
