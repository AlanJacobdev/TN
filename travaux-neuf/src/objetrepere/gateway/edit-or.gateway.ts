import {  forwardRef, Inject, Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway,WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ItemService } from 'src/item/item.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { userIdentity } from 'src/utilisateur/dto/user';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { editObjet, payloadEditOr } from '../interface/EditOR';
import { ObjetrepereService } from '../objetrepere.service';

@WebSocketGateway({ cors: true })
export class EditOrGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  constructor(private u : UtilisateurService, private orService : ObjetrepereService, private itemService : ItemService, private siService : SousitemService){}

  public editOBjet : editObjet [] = []
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
 

  @SubscribeMessage('reservationObject')
  async hold(client: Socket, payload: payloadEditOr) {
    let index = this.editOBjet.findIndex((element) => element.clientId == client.id);
    if(index != -1) {
      this.editOBjet.splice(index,1);
    }
    let user: userIdentity = await this.u.findOneByLogin(payload.login)
    this.editOBjet.push({
      clientId : client.id,
      id : payload.id,
      login : payload.login,
      profil : user.nom.toUpperCase() + " "+ user.prenom
    })
    
    this.server.emit('broadcastReservation', this.editOBjet);
    // client.broadcast.emit('broadcastReservation', this.editOR);
  }


  @SubscribeMessage('modificationObjet')
  async free(client: Socket, type: string) {
    let index = this.editOBjet.findIndex((element) => element.clientId == client.id);
    let objet : editObjet;
    if(index != -1) {
      objet = this.editOBjet.find((element) => element.clientId == client.id);
      this.editOBjet.splice(index,1);
    

      let returnObject;
      if (type == 'OR'){
        returnObject = await this.orService.findOne(objet.id)
      } else if (type == 'Item'){
        returnObject = await this.itemService.findOne(objet.id)
      } else if (type == 'SI'){
        returnObject = await this.siService.findOne(objet.id)
      }
      this.server.emit('updateElementEdit', {type : type, returnObject : returnObject});
    } else {
      this.server.emit('updateElementEdit', {error : "Aucun objet en cours de modification pour cet utilisateur (Rafraichir la page)"});
    }
  }

  afterInit(server: Server) {
   this.logger.log('Init');
  }
 
  handleDisconnect(client: Socket) {
    let index = this.editOBjet.findIndex((element) => element.clientId == client.id);
    if(index != -1) {
      this.editOBjet.splice(index,1);
    }
    
    this.server.emit('broadcastReservation', this.editOBjet);
  }
 
  handleConnection(client: Socket, ...args: any[]) {
    
    client.emit("sendReservation", this.editOBjet)
  }
}
