import { HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { ItemService } from 'src/item/item.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { exportGMAO } from './Interface';
import * as xlsx from 'xlsx';
import { createReadStream } from 'fs';
import { join } from 'path';
import { doc } from 'prettier';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { Item } from 'src/item/entities/item.entity';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';

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
   * Retourne l'ensemble des objets non exportés au sein de la GMAO.
   * @returns Objet contenant l'ensemble des objets repères, items et sous-items non exportés
   */
  async getAllExportItemForGMAO() {
    let OrToExport = await this.orService.getORforExportGMAO();
    let ItemToExport = await this.itemService.getItemforExportGMAO();
    let SiToExport = await this.siService.getSIforExportGMAO();
    let res : exportGMAO = {
      listeOR: OrToExport,
      listeItem: ItemToExport,
      listeSI: SiToExport,
      user: '',
      nomDocument: ''
    }
    return res;
  }

  
  remove(id: number) {
    return `This action removes a #${id} serviceExportation`;
  }

  async exportationData(data : exportGMAO){
    let updateExporteStatus = await this.updateExportStatus(data);
    
    if(updateExporteStatus.hasOwnProperty('error')){
      return {
        status : HttpStatus.INTERNAL_SERVER_ERROR,
        error :'Problème lors de la modification des status d\'exportation',
      }
    } else {
      try {
        let i = 4
        const workbook = xlsx.readFile('./../FeuilleMaintenance.xlsx');
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        
        if(data.listeOR.length != 0){
          for (const or of data.listeOR){
            let cellRef = xlsx.utils.encode_cell({c: 7, r: i});
            let cell = sheet[cellRef];
            if (cell) {
              // update existing cell
              cell.v = or.idObjetRepere;
            } else {
              // add new cell
              xlsx.utils.sheet_add_aoa(sheet, [[or.idObjetRepere]], {origin: cellRef});
            }

            cellRef = xlsx.utils.encode_cell({c: 8, r: i});
            cell = sheet[cellRef];
            if (cell) {
              // update existing cell
              cell.v = or.libelleObjetRepere;
            } else {
              // add new cell
              xlsx.utils.sheet_add_aoa(sheet, [[or.libelleObjetRepere]], {origin: cellRef});
            }
            cellRef = xlsx.utils.encode_cell({c: 10, r: i});
            cell = sheet[cellRef];
            if (cell) {
              // update existing cell
              cell.v = or.libelleObjetRepere;
            } else {
              // add new cell
              xlsx.utils.sheet_add_aoa(sheet, [[or.libelleObjetRepere]], {origin: cellRef});
            }


            cellRef = xlsx.utils.encode_cell({c: 13, r: i});
            cell = sheet[cellRef];
            
            if(or.description != undefined){
              let desc ="";
              for(const d of or.description ) {
                desc +=  d.lien + " - ";
              }
        
              if (cell) {
                // update existing cell
                cell.v = desc;
                
              } else {
                // add new cell
                xlsx.utils.sheet_add_aoa(sheet, [[desc]], {origin: cellRef});
              }
            }
            i = i+1;
          }
        }
        if(data.listeItem.length != 0){
          for (const item of data.listeItem){
            let cellRef = xlsx.utils.encode_cell({c: 7, r: i});
            let cell = sheet[cellRef];
            if (cell) {
              // update existing cell
              cell.v = item.idItem;
            } else {
              // add new cell
              xlsx.utils.sheet_add_aoa(sheet, [[item.idItem]], {origin: cellRef});
            }

            cellRef = xlsx.utils.encode_cell({c: 8, r: i});
            cell = sheet[cellRef];
            if (cell) {
              // update existing cell
              cell.v = item.libelleItem;
            } else {
              // add new cell
              xlsx.utils.sheet_add_aoa(sheet, [[item.libelleItem]], {origin: cellRef});
            }
            cellRef = xlsx.utils.encode_cell({c: 10, r: i});
            cell = sheet[cellRef];
            if (cell) {
              // update existing cell
              cell.v = item.libelleItem;
            } else {
              // add new cell
              xlsx.utils.sheet_add_aoa(sheet, [[item.libelleItem]], {origin: cellRef});
            }


            cellRef = xlsx.utils.encode_cell({c: 13, r: i});
            cell = sheet[cellRef];
            
            if(item.description != undefined) {
              let desc ="";
              for(const d of item.description ) {
                desc +=  d.lien + " - ";
              }
        
              if (cell) {
                // update existing cell
                cell.v = desc;
                
              } else {
                // add new cell
                xlsx.utils.sheet_add_aoa(sheet, [[desc]], {origin: cellRef});
              }
            }
            i = i+1;
          }
        }
        if(data.listeSI.length != 0){
          for (const si of data.listeSI){
            let cellRef = xlsx.utils.encode_cell({c: 7, r: i});
            let cell = sheet[cellRef];
            if (cell) {
              // update existing cell
              cell.v = si.idSousItem;
            } else {
              // add new cell
              xlsx.utils.sheet_add_aoa(sheet, [[si.idSousItem]], {origin: cellRef});
            }

            cellRef = xlsx.utils.encode_cell({c: 8, r: i});
            cell = sheet[cellRef];
            if (cell) {
              // update existing cell
              cell.v = si.libelleSousItem;
            } else {
              // add new cell
              xlsx.utils.sheet_add_aoa(sheet, [[si.libelleSousItem]], {origin: cellRef});
            }
            cellRef = xlsx.utils.encode_cell({c: 10, r: i});
            cell = sheet[cellRef];
            if (cell) {
              // update existing cell
              cell.v = si.libelleSousItem;
            } else {
              // add new cell
              xlsx.utils.sheet_add_aoa(sheet, [[si.libelleSousItem]], {origin: cellRef});
            }


            cellRef = xlsx.utils.encode_cell({c: 13, r: i});
            cell = sheet[cellRef];
          
            if(si.description != undefined) {
              let desc ="";
              
              for(const d of si.description ) {
                desc +=  d.lien + " - ";
              }
        
              if (cell) {
                // update existing cell
                cell.v = desc;
                
              } else {
                // add new cell
                xlsx.utils.sheet_add_aoa(sheet, [[desc]], {origin: cellRef});
              }
            }
            i = i+1;
          }
        }
        let EXCEL_EXTENSION = '.xlsx';
        let path ='./../exports/'+ data.nomDocument +'_export_' + new Date().getTime() + EXCEL_EXTENSION
        xlsx.writeFile(workbook, path );
        
        
        const fs = require('fs');    
        if (fs.existsSync(path)) {      
          return path;
        } else {
          return {
            status : HttpStatus.CONFLICT,
            error :'Document inconnu',
          }
        }
        
        } catch (e : any){
          console.log(e);
          console.log("error creation export");
          return e;
        }
    }
  }

  async updateExportStatus( data : exportGMAO){
    try {
      for (const or of data.listeOR){
        await this.updateExportStatusOR(or.idObjetRepere, true)
      }

      for (const item of data.listeItem){
        await this.updateExportStatusItem(item.idItem, true)
      }

      for (const si of data.listeSI){
        await this.updateExportStatusSi(si.idSousItem, true)
      }

      return {
        status : HttpStatus.OK,
        message :'Status d\'exportation mis à jour',
      }
    } catch (e: any){
      return {
        status : HttpStatus.INTERNAL_SERVER_ERROR,
        error :'Problème lors de la modification des status d\'exportation',
      }
    }  
}

  async updateExportStatusOR(or : string, value : boolean){
    return this.orService.updateExportStatus(or, value)
  }

  async updateExportStatusItem( item : string, value : boolean){
    return this.itemService.updateExportStatus(item, value);
  }

  async updateExportStatusSi( si : string, value : boolean){
    return this.siService.updateExportStatus(si, value);
  }

}
