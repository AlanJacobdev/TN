  import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
   } from '@nestjs/websockets';
   import { Logger } from '@nestjs/common';
   import { Socket, Server } from 'socket.io';
import { DemandeAdminService } from '../demande-admin.service';
import { editOR, payloadEditOr } from 'src/objetrepere/interface/EditOR';

@WebSocketGateway({ cors: true } )
export class NbDemandeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    
    constructor(private demandeAdminService: DemandeAdminService){}
    public editOR : editOR [] = []
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');
   
  
    @SubscribeMessage('demande')
    async onChat(client: Socket, payload: string) {
      this.server.emit('demandeResponse',  (await this.demandeAdminService.findAll()).length);
    }

    afterInit(server: Server) {
     this.logger.log('Init');
    }
   
    handleDisconnect(client: Socket) {
    }
   
    handleConnection(client: Socket, ...args: any[]) {
    }
   }