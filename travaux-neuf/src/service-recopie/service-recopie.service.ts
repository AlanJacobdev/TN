import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { Item } from 'src/item/entities/item.entity';
import { ItemService } from 'src/item/item.service';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';
import { SousitemService } from 'src/sousitem/sousitem.service';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { create } from 'domain';


@Injectable()
export class ServiceRecopieService {

    constructor(@InjectRepository(Objetrepere) private OrRepo : Repository<Objetrepere>, @InjectRepository(Sousitem) private SiRepo : Repository<Sousitem>,
                @InjectRepository(Item) private ItemRepo : Repository<Item>, private OrService : ObjetrepereService, private itemService:ItemService,
                private SiService : SousitemService, private configservice : ConfigService
                ){}


    async recopyItemFromObjetRepere(or: string, nu : string ) {
        const orSourceExist = await this.OrService.findOne(or);
        if (orSourceExist != undefined) {
            const orTargetExist = await this.OrService.findOne(orSourceExist.codeType + nu);
            if (orTargetExist != undefined) {
                const ItemsOfOrOrigin = await this.itemService.findAllItemOfOR(or);
                if(ItemsOfOrOrigin.length != 0){ 
                    for (const item of ItemsOfOrOrigin ){
                        const itemExist = await this.itemService.findOne(item.codeObjet + nu + item.digit)
                        if (itemExist == undefined){
                            const idTargetItem = (item.securite ? item.codeObjet + nu + item.digit + 'Z' : item.codeObjet + nu + item.digit)
                            let createitem = new CreateItemDto();
                            createitem = {
                                idItem : idTargetItem ,
                                libelleItem :  `Item issue de la recopie de ${item.idItem}`,
                                idOR : orSourceExist.codeType + nu,
                                numeroUnique : nu,
                                digit : item.digit,
                                codeObjet : item.codeObjet,
                                securite : item.securite,
                                actif : item.actif,
                                description : "",
                                profilCreation : this.configservice.get('profil') ,
                                dateCreation : new Date(),
                                posteCreation : ""
                            }
                            await this.itemService.create(createitem);
                        }
                    }
                    return await this.itemService.findAllItemOfOR(orSourceExist.codeType + nu);
                } else {
                    return  {
                        status : HttpStatus.NOT_FOUND,
                        error :'Source Objet Repere hasn\'t item'
                    }
                }
            } else {
                return  {
                    status : HttpStatus.NOT_FOUND,
                    error :'Origin Objet repere doesn\'t exist'
                }
            }
        } else {
            return  {
                status : HttpStatus.NOT_FOUND,
                error :'Origin Objet repere doesn\'t exist'
            }
        }
    }

}
