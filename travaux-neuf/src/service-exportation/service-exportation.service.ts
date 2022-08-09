import { Injectable } from '@nestjs/common';
import { ItemService } from 'src/item/item.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { exportGMAO } from './Interface';


@Injectable()
export class ServiceExportationService {

  constructor(private orService : ObjetrepereService ,private itemService: ItemService ,private siService: SousitemService){}

  findAll() {
    return `This action returns all serviceExportation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceExportation`;
  }

  /**
   * Retourne l'ensemble des pbjets non exportés au sein de la GMAO.
   * @returns Objet contenant l'ensemble des objets repères, items et sous-items non exportés
   */
  async getAllExportItemForGMAO() {
    let OrToExport = await this.orService.getORforExportGMAO();
    let ItemToExport = await this.itemService.getItemforExportGMAO();
    let SiToExport = await this.siService.getSIforExportGMAO();
    let res : exportGMAO = {
      listeOR: OrToExport,
      listeItem: ItemToExport,
      listeSI: SiToExport
    }
    return res;
  }

  
  remove(id: number) {
    return `This action removes a #${id} serviceExportation`;
  }
}
