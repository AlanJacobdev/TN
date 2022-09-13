import { HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { ItemService } from 'src/item/item.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { createExportGMAO, exportGMAO } from './Interface';
import * as xlsx from 'xlsx';
import { ExportationService } from 'src/exportation/exportation.service';
import { CreateExportationDto } from 'src/exportation/dto/create-exportation.dto';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class ServiceExportationService {

  constructor(private orService : ObjetrepereService ,private itemService: ItemService ,private siService: SousitemService, private exportationService :ExportationService,
    private utilisateurService :UtilisateurService){}

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
  async getAllExportItemForGMAOForOneUser(user : string) {

    let OrToExport = await this.orService.getORforExportGMAOForOneUser(user);
    let ItemToExport = await this.itemService.getItemforExportGMAOForOneUser(user);
    let SiToExport = await this.siService.getSIforExportGMAOForOneUser(user);
    let res : exportGMAO = {
      listeOR: OrToExport,
      listeItem: ItemToExport,
      listeSI: SiToExport,
      profilCreation: '',
      nomDocument: ''
    }
    return res;
  }

  async getAllExportItemForGMAO() {

    let OrToExport = await this.orService.getORforExportGMAO();
    let ItemToExport = await this.itemService.getItemforExportGMAO();
    let SiToExport = await this.siService.getSIforExportGMAO();
    let res : exportGMAO = {
      listeOR: OrToExport,
      listeItem: ItemToExport,
      listeSI: SiToExport,
      profilCreation: '',
      nomDocument: ''
    }
    return res;
  }

  
  remove(id: number) {
    return `This action removes a #${id} serviceExportation`;
  }

  async exportationData(data : createExportGMAO){
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
        // Création Objets 
        if (data.createObject.listeItem.length != 0 || data.createObject.listeOR.length != 0 || data.createObject.listeSI.length != 0 ) {  
          let cellRef = xlsx.utils.encode_cell({c: 7, r: i});
          xlsx.utils.sheet_add_aoa(sheet, [["Objets créés"]], {origin: cellRef});
          i = i+1;
          if(data.createObject.listeOR.length != 0){
            for (const or of data.createObject.listeOR){
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
          if(data.createObject.listeItem.length != 0){
            for (const item of data.createObject.listeItem){
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
          if(data.createObject.listeSI.length != 0){
            for (const si of data.createObject.listeSI){
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
        }

        // Modification items

        if (data.updateObject.listeItem.length != 0 || data.updateObject.listeOR.length != 0 || data.updateObject.listeSI.length != 0 ) {  
          let cellRef = xlsx.utils.encode_cell({c: 7, r: i});
          xlsx.utils.sheet_add_aoa(sheet, [["Objets modifiés"]], {origin: cellRef});
          i = i+1;
          if(data.updateObject.listeOR.length != 0){
            for (const or of data.updateObject.listeOR){
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
          if(data.updateObject.listeItem.length != 0){
            for (const item of data.updateObject.listeItem){
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
          if(data.updateObject.listeSI.length != 0){
            for (const si of data.updateObject.listeSI){
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
        }

        const fs = require('fs');    
        let EXCEL_EXTENSION = '.xlsx';
        let date = new Date().getTime()
        let name = data.nomDocument +'_export_' + date + EXCEL_EXTENSION
        let dir = "./../exports"
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        let path =dir + name;
        xlsx.writeFile(workbook, path );
        
        
        
        if (fs.existsSync(path)) {   

          let createExport :CreateExportationDto = {
            nomDocument: name,
            path: path,
            date: new Date(),
            profil: data.user
          }
          this.exportationService.create(createExport);
          
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

  async updateExportStatus( data : createExportGMAO){
    try {
      for (const or of data.createObject.listeOR){
        await this.updateExportStatusOR(or.idObjetRepere, true)
      }
      for (const item of data.createObject.listeItem){
        await this.updateExportStatusItem(item.idItem, true)
      }
      for (const si of data.createObject.listeSI){
        await this.updateExportStatusSi(si.idSousItem, true)
      }

      for (const or of data.updateObject.listeOR){
        await this.updateExportStatusOR(or.idObjetRepere, true)
      }
      for (const item of data.updateObject.listeItem){
        await this.updateExportStatusItem(item.idItem, true)
      }
      for (const si of data.updateObject.listeSI){
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
