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

/**
 * Gateway permettant l'échange instantanée de données entre les différents client enregistrés au sein du websocket 
 */

@WebSocketGateway({ cors: true } )
export class NbDemandeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    
    constructor(private demandeAdminService: DemandeAdminService){}
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');
   
    /**
     * Retourne le nombre de demande administrateurs
     * @param client : Socket de connexion du client 
     * @param payload : Inutilisé
     */
    @SubscribeMessage('demande')
    async onChat(client: Socket, payload: string) {
      this.server.emit('demandeResponse',  (await this.demandeAdminService.findAll()).length);
    }

    /**
     * Initialisation du webSocket lors du lancement de l'applciation
     * @param server 
     */
    afterInit(server: Server) {
     this.logger.log('Init');
    }
   
    /** 
     * Méthode utile pour vérifier la bonne déconnexion d'un utilisateur
    */
    handleDisconnect(client: Socket) {
    }
   
    /** 
    * Méthode utile pour vérifier la bonne connexion d'un utilisateur
    */
    handleConnection(client: Socket, ...args: any[]) {
    }
   }