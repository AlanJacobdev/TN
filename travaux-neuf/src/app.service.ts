import { Injectable } from '@nestjs/common';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class AppService {

  /**
   * Hello world
   * @returns Hello World!
   */
  getHello(): string {
    return 'Hello World!';
  }
}
